import { readFileSync } from "node:fs";
import { createServer } from "node:http";

const HOST = "0.0.0.0";
const PORT = 3000;
const MAX_BODY_BYTES = 16 * 1024;
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

class HttpError extends Error {
  constructor(statusCode, publicMessage) {
    super(publicMessage);
    this.statusCode = statusCode;
    this.publicMessage = publicMessage;
  }
}

function readRuntimeSecret(name) {
  const environmentValue = process.env[name]?.trim();
  if (environmentValue) return environmentValue;

  try {
    return readFileSync(`/run/secrets/${name}`, "utf8").trim();
  } catch {
    return "";
  }
}

const configuration = {
  resendApiKey: readRuntimeSecret("RESEND_API_KEY"),
  emailFrom: readRuntimeSecret("CONTACT_EMAIL_FROM"),
  emailTo: readRuntimeSecret("CONTACT_EMAIL_TO"),
};

const missingConfiguration = Object.entries(configuration)
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missingConfiguration.length > 0) {
  console.error("Contact API configuration is incomplete.", {
    missingConfiguration,
  });
  process.exit(1);
}

function sendText(response, statusCode, message, headers = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers,
  });
  response.end(message);
}

function redirectToSuccess(response) {
  sendText(response, 303, "See Other", {
    Location: "/contact-success.html",
  });
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const declaredLength = request.headers["content-length"];
    if (declaredLength !== undefined) {
      const parsedLength = Number(declaredLength);
      if (!Number.isInteger(parsedLength) || parsedLength < 0) {
        reject(new HttpError(400, "Invalid request."));
        return;
      }
      if (parsedLength > MAX_BODY_BYTES) {
        reject(new HttpError(413, "Request too large."));
        return;
      }
    }

    const chunks = [];
    let totalBytes = 0;
    let settled = false;

    request.on("data", (chunk) => {
      if (settled) return;

      totalBytes += chunk.length;
      if (totalBytes > MAX_BODY_BYTES) {
        settled = true;
        reject(new HttpError(413, "Request too large."));
        return;
      }

      chunks.push(chunk);
    });

    request.on("end", () => {
      if (!settled) resolve(Buffer.concat(chunks).toString("utf8"));
    });

    request.on("error", () => {
      if (!settled) {
        settled = true;
        reject(new HttpError(400, "Invalid request."));
      }
    });
  });
}

function parseBody(request, rawBody) {
  const contentType = request.headers["content-type"]
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();

  if (contentType === "application/x-www-form-urlencoded") {
    return Object.fromEntries(new URLSearchParams(rawBody));
  }

  if (contentType === "application/json") {
    let parsed;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      throw new HttpError(400, "Invalid request.");
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new HttpError(400, "Invalid request.");
    }

    return parsed;
  }

  throw new HttpError(415, "Unsupported content type.");
}

function normalizedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function hasHoneypotValue(fields) {
  const value = fields["bot-field"];
  if (typeof value === "string") return value.trim().length > 0;
  return value !== undefined && value !== null;
}

function characterCount(value) {
  return Array.from(value).length;
}

function validateSubmission(fields) {
  const name = normalizedString(fields.name);
  const email = normalizedString(fields.email);
  const message = normalizedString(fields.message);
  const locale = normalizedString(fields.locale) || "unknown";

  if (!name || characterCount(name) > 100 || /[\r\n\0]/u.test(name)) {
    throw new HttpError(400, "Please provide a valid name.");
  }

  if (
    !email ||
    characterCount(email) > 254 ||
    !EMAIL_PATTERN.test(email) ||
    /[\r\n\0]/u.test(email)
  ) {
    throw new HttpError(400, "Please provide a valid email address.");
  }

  if (!message || characterCount(message) > 5000 || /\0/u.test(message)) {
    throw new HttpError(400, "Please provide a valid message.");
  }

  if (characterCount(locale) > 35 || /[\r\n\0]/u.test(locale)) {
    throw new HttpError(400, "Invalid request.");
  }

  return { name, email, message, locale };
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/gu, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return replacements[character];
  });
}

function buildEmail(submission, submittedAt) {
  const safeName = escapeHtml(submission.name);
  const safeEmail = escapeHtml(submission.email);
  const safeLocale = escapeHtml(submission.locale);
  const safeMessage = escapeHtml(submission.message).replace(/\r?\n/gu, "<br>");
  const safeSubmittedAt = escapeHtml(submittedAt);
  const subjectName = submission.name.replace(/[\r\n]+/gu, " ");

  return {
    subject: `New Owlnest website inquiry from ${subjectName}`,
    text: [
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      `Locale: ${submission.locale}`,
      `Submitted at: ${submittedAt}`,
      "",
      "Message:",
      submission.message,
    ].join("\n"),
    html: `
      <h1>New Owlnest website inquiry</h1>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Locale:</strong> ${safeLocale}</p>
      <p><strong>Submitted at:</strong> ${safeSubmittedAt}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `.trim(),
  };
}

async function sendContactEmail(submission) {
  const submittedAt = new Date().toISOString();
  const email = buildEmail(submission, submittedAt);

  let resendResponse;
  try {
    resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${configuration.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: configuration.emailFrom,
        to: [configuration.emailTo],
        reply_to: submission.email,
        subject: email.subject,
        text: email.text,
        html: email.html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error("Resend request failed.", {
      statusCode: null,
      summary: error?.name || "network_error",
    });
    throw new HttpError(502, "Unable to send message.");
  }

  if (!resendResponse.ok) {
    console.error("Resend request failed.", {
      statusCode: resendResponse.status,
      summary: "upstream_error",
    });
    throw new HttpError(502, "Unable to send message.");
  }
}

async function handleRequest(request, response) {
  const requestUrl = new URL(request.url, "http://localhost");

  if (requestUrl.pathname === "/health") {
    if (request.method !== "GET") {
      sendText(response, 405, "Method not allowed.", { Allow: "GET" });
      return;
    }

    sendText(response, 200, "ok");
    return;
  }

  if (requestUrl.pathname !== "/api/contact") {
    sendText(response, 404, "Not found.");
    return;
  }

  if (request.method !== "POST") {
    sendText(response, 405, "Method not allowed.", { Allow: "POST" });
    return;
  }

  try {
    const rawBody = await readBody(request);
    const fields = parseBody(request, rawBody);

    if (hasHoneypotValue(fields)) {
      redirectToSuccess(response);
      return;
    }

    const submission = validateSubmission(fields);
    await sendContactEmail(submission);
    redirectToSuccess(response);
  } catch (error) {
    if (error instanceof HttpError) {
      sendText(response, error.statusCode, error.publicMessage);
      return;
    }

    console.error("Contact request failed.", {
      statusCode: 500,
      summary: error?.name || "internal_error",
    });
    sendText(response, 500, "Unable to process request.");
  }
}

const server = createServer((request, response) => {
  void handleRequest(request, response);
});

server.listen(PORT, HOST, () => {
  console.log(`Owlnest contact API listening on ${HOST}:${PORT}.`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
