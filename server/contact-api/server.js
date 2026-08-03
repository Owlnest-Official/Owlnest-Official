import { readFileSync } from "node:fs";
import { createServer } from "node:http";

const HOST = "0.0.0.0";
const PORT = 3000;
const MAX_BODY_BYTES = 16 * 1024;
const RESEND_API_BASE_URL =
  process.env.NODE_ENV === "test" && process.env.RESEND_API_BASE_URL
    ? process.env.RESEND_API_BASE_URL.replace(/\/$/u, "")
    : "https://api.resend.com";
const RESEND_EMAIL_ENDPOINT = `${RESEND_API_BASE_URL}/emails`;
const DEFAULT_SCIENCE_URL = "https://owlnestofficial.com/science/";
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

function sendJson(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers,
  });
  response.end(JSON.stringify(body));
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

function normalizeEmail(value) {
  return normalizedString(value).toLowerCase();
}

function isValidEmail(value) {
  return (
    Boolean(value) &&
    characterCount(value) <= 254 &&
    EMAIL_PATTERN.test(value) &&
    !/[\r\n\0]/u.test(value)
  );
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
    !isValidEmail(email)
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
  return String(value || "").replace(/[&<>"']/gu, (character) => {
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
    resendResponse = await fetch(RESEND_EMAIL_ENDPOINT, {
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

function hasExplicitConsent(value) {
  if (value === true) return true;
  if (typeof value !== "string") return false;
  return ["true", "on", "1", "yes"].includes(value.trim().toLowerCase());
}

function validateUpdateSubscription(fields) {
  const email = normalizeEmail(fields.email);
  const locale = normalizedString(fields.locale) || "unknown";
  const source = normalizedString(fields.source) || "unknown";

  if (!isValidEmail(email)) {
    throw new HttpError(400, "Please provide a valid email address.");
  }

  if (!hasExplicitConsent(fields.consent)) {
    throw new HttpError(400, "Consent is required.");
  }

  if (
    characterCount(locale) > 35 ||
    characterCount(source) > 120 ||
    /[\r\n\0]/u.test(locale) ||
    /[\r\n\0]/u.test(source)
  ) {
    throw new HttpError(400, "Invalid request.");
  }

  return { email, locale, source };
}

async function resendContactsRequest(apiKey, path, options = {}) {
  return fetch(`${RESEND_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    signal: AbortSignal.timeout(10_000),
  });
}

async function availableContactPropertyKeys(apiKey) {
  try {
    const response = await resendContactsRequest(
      apiKey,
      "/contact-properties?limit=100",
      { method: "GET" },
    );
    if (!response.ok) return new Set();

    const body = await response.json();
    const properties = Array.isArray(body?.data) ? body.data : [];
    return new Set(
      properties
        .map((property) => property?.key)
        .filter((key) => key === "locale" || key === "source"),
    );
  } catch {
    return new Set();
  }
}

function contactProperties(subscription, availableKeys) {
  const properties = {};
  if (availableKeys.has("locale")) properties.locale = subscription.locale;
  if (availableKeys.has("source")) properties.source = subscription.source;
  return properties;
}

async function mutateResendContact(apiKey, method, path, payload) {
  const request = (body) =>
    resendContactsRequest(apiKey, path, {
      method,
      body: JSON.stringify(body),
    });

  const response = await request(payload);
  if (
    response.ok ||
    !payload.properties ||
    ![400, 422].includes(response.status)
  ) {
    return response;
  }

  const fallbackPayload = { ...payload };
  delete fallbackPayload.properties;
  return request(fallbackPayload);
}

async function subscribeToUpdates(subscription) {
  const apiKey = readRuntimeSecret("RESEND_CONTACTS_API_KEY");
  if (!apiKey) {
    console.error("Resend Contacts configuration is incomplete.", {
      statusCode: 503,
      summary: "missing_api_key",
    });
    throw new HttpError(503, "Updates service is unavailable.");
  }

  const encodedEmail = encodeURIComponent(subscription.email);
  let propertyKeys;
  let existingContact;
  try {
    [propertyKeys, existingContact] = await Promise.all([
      availableContactPropertyKeys(apiKey),
      resendContactsRequest(apiKey, `/contacts/${encodedEmail}`, {
        method: "GET",
      }),
    ]);
  } catch (error) {
    console.error("Resend Contacts request failed.", {
      statusCode: null,
      summary: error?.name || "network_error",
    });
    throw new HttpError(502, "Unable to save subscription.");
  }

  const properties = contactProperties(subscription, propertyKeys);
  const commonPayload = {
    unsubscribed: false,
    ...(Object.keys(properties).length > 0 ? { properties } : {}),
  };

  let response;
  try {
    if (existingContact.ok) {
      response = await mutateResendContact(
        apiKey,
        "PATCH",
        `/contacts/${encodedEmail}`,
        commonPayload,
      );
    } else if (existingContact.status === 404) {
      response = await mutateResendContact(apiKey, "POST", "/contacts", {
        email: subscription.email,
        ...commonPayload,
      });

      if (response.status === 409 || response.status === 422) {
        response = await mutateResendContact(
          apiKey,
          "PATCH",
          `/contacts/${encodedEmail}`,
          commonPayload,
        );
      }
    } else {
      response = existingContact;
    }
  } catch (error) {
    console.error("Resend Contacts request failed.", {
      statusCode: null,
      summary: error?.name || "network_error",
    });
    throw new HttpError(502, "Unable to save subscription.");
  }

  if (!response.ok) {
    console.error("Resend Contacts request failed.", {
      statusCode: response.status,
      summary: "upstream_error",
    });
    throw new HttpError(502, "Unable to save subscription.");
  }
}

function sleepResultConfiguration() {
  return {
    emailFrom: readRuntimeSecret("RESULT_EMAIL_FROM"),
    replyTo: readRuntimeSecret("RESULT_EMAIL_REPLY_TO"),
    scienceUrl: readRuntimeSecret("OWLNEST_SCIENCE_URL"),
    unsubscribeUrl: readRuntimeSecret("RESULT_EMAIL_UNSUBSCRIBE_URL"),
    physicalAddress: readRuntimeSecret("OWLNEST_PHYSICAL_ADDRESS"),
  };
}

async function sendSleepCheckEmail(payload, email) {
  const resultConfiguration = sleepResultConfiguration();
  if (!configuration.resendApiKey || !resultConfiguration.emailFrom) {
    console.error("Sleep-Ready result email configuration is incomplete.", {
      statusCode: 503,
      summary: "missing_email_configuration",
    });
    throw new HttpError(503, "Result email is unavailable.");
  }

  const emailContent = buildResultEmail(payload, resultConfiguration);
  const requestBody = {
    from: safeText(resultConfiguration.emailFrom, 160),
    to: [email],
    subject: "Your Sleep-Ready Check result from Owlnest",
    html: emailContent.html,
    text: emailContent.text,
  };

  const replyTo = safeText(resultConfiguration.replyTo, 160);
  if (replyTo) requestBody.reply_to = replyTo;

  let resendResponse;
  try {
    resendResponse = await fetch(RESEND_EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${configuration.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error("Sleep-Ready result email request failed.", {
      statusCode: null,
      summary: error?.name || "network_error",
    });
    throw new HttpError(502, "Unable to send result email.");
  }

  if (!resendResponse.ok) {
    console.error("Sleep-Ready result email request failed.", {
      statusCode: resendResponse.status,
      summary: "upstream_error",
    });
    throw new HttpError(502, "Unable to send result email.");
  }
}

function buildResultEmail(payload, resultConfiguration) {
  const mode = payload.analysis_mode === "ai_photo" ? "ai_photo" : "quiz_only";
  const scienceUrl =
    safeUrl(resultConfiguration.scienceUrl) || DEFAULT_SCIENCE_URL;
  const unsubscribeUrl = safeUrl(resultConfiguration.unsubscribeUrl);
  const physicalAddress = safeText(resultConfiguration.physicalAddress, 240);
  const replyTo =
    safeText(resultConfiguration.replyTo, 160) || "team@owlnestofficial.com";
  const isAiPhoto = mode === "ai_photo";
  const heading = isAiPhoto
    ? "Your Sleep-Ready Room Check result"
    : "Your Sleep-Ready Check result";
  const intro =
    "Thanks for taking the Sleep-Ready Check. Here's a copy of your result.";
  const resultRows = isAiPhoto ? aiRows(payload) : quizRows(payload);
  const resultTextRows = resultRows
    .map((row) => `${row.label}: ${row.value}`)
    .join("\n");
  const noticed = aiSummary(payload);
  const tryItems = isAiPhoto ? aiTryItems(payload) : quizTryItems(payload);
  const tryText = tryItems.map((item) => `- ${item}`).join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark only">
  <meta name="supported-color-schemes" content="dark">
  <title>Your Sleep-Ready Check result from Owlnest</title>
</head>
<body style="margin:0;background-color:#07111f;background:#07111f;color:#f6efe3;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(intro)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#07111f;background:#07111f;padding:22px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#101d33;background:#101d33;border-radius:20px;overflow:hidden;border:1px solid rgba(240,176,79,0.32);">
          <tr>
            <td style="padding:26px 22px 16px;border-top:4px solid #d88a24;background-color:#101d33;background:#101d33;">
              <p style="margin:0 0 14px;color:#f0b04f;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;">Owlnest</p>
              <h1 style="margin:0;color:#fff6e8;font-size:28px;line-height:1.18;font-weight:700;">${escapeHtml(heading)}</h1>
              <p style="margin:12px 0 0;color:#e8edf7;font-size:15px;line-height:1.58;">${escapeHtml(intro)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 22px 14px;">
              <div style="border:1px solid rgba(240,176,79,0.28);border-radius:16px;padding:18px;background-color:#15243d;background:#15243d;">
                <div style="width:38px;height:2px;background-color:#d88a24;background:#d88a24;margin:0 0 13px;"></div>
                <h2 style="margin:0 0 12px;color:#fff6e8;font-size:21px;line-height:1.28;">Your result</h2>
                ${resultRows.map((row) => resultRowHtml(row.label, row.value)).join("")}
              </div>
            </td>
          </tr>
          ${isAiPhoto ? `
          <tr>
            <td style="padding:0 22px 14px;">
              <div style="border:1px solid rgba(240,176,79,0.28);border-radius:16px;padding:18px;background-color:#15243d;background:#15243d;">
                <div style="width:38px;height:2px;background-color:#d88a24;background:#d88a24;margin:0 0 13px;"></div>
                <h2 style="margin:0 0 10px;color:#fff6e8;font-size:21px;line-height:1.28;">What AI noticed</h2>
                <p style="margin:0;color:#e8edf7;font-size:15px;line-height:1.58;">${escapeHtml(noticed)}</p>
              </div>
            </td>
          </tr>` : ""}
          <tr>
            <td style="padding:0 22px 14px;">
              <div style="border:1px solid rgba(240,176,79,0.28);border-radius:16px;padding:18px;background-color:#15243d;background:#15243d;">
                <div style="width:38px;height:2px;background-color:#d88a24;background:#d88a24;margin:0 0 13px;"></div>
                <h2 style="margin:0 0 10px;color:#fff6e8;font-size:21px;line-height:1.28;">${isAiPhoto ? "Try this" : "Try this tonight"}</h2>
                ${bulletListHtml(tryItems)}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 22px 20px;">
              <div style="border:1px solid rgba(240,176,79,0.28);border-radius:16px;padding:18px;background-color:#15243d;background:#15243d;">
                <div style="width:38px;height:2px;background-color:#d88a24;background:#d88a24;margin:0 0 13px;"></div>
                <h2 style="margin:0 0 10px;color:#fff6e8;font-size:21px;line-height:1.28;">Why nighttime light matters</h2>
                <p style="margin:0 0 10px;color:#e8edf7;font-size:15px;line-height:1.58;">Lume is made for the moments after dark when the room still needs a little light.</p>
                <p style="margin:0;color:#e8edf7;font-size:15px;line-height:1.58;">Bright or blue-rich light can send a daytime-like signal at night. Lume is a sleep-spectrum lamp, specially tuned for after dark and designed to support the body's natural melatonin rhythm. Use it before bed or during brief nighttime wake-ups when a small amount of light is needed.</p>
                <p style="margin:14px 0 0;"><a href="${escapeAttribute(scienceUrl)}" style="color:#f0b04f;font-size:15px;font-weight:700;">Read the science</a></p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 22px 24px;background-color:#0b1628;background:#0b1628;color:#b9c3d6;">
              <p style="margin:0 0 8px;font-size:12px;line-height:1.52;">This is not a medical assessment. Owlnest Lume is not a medical device. Individual experiences may vary.</p>
              <p style="margin:0 0 8px;font-size:12px;line-height:1.52;">Reply to: ${escapeHtml(replyTo)}</p>
              ${unsubscribeUrl ? `<p style="margin:0 0 8px;font-size:12px;line-height:1.52;"><a href="${escapeAttribute(unsubscribeUrl)}" style="color:#f2c98a;">Unsubscribe</a></p>` : ""}
              ${physicalAddress ? `<p style="margin:0;font-size:12px;line-height:1.52;">${escapeHtml(physicalAddress)}</p>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textParts = [
    "Owlnest",
    "",
    heading,
    "",
    intro,
    "",
    "Your result",
    resultTextRows,
    "",
    ...(isAiPhoto ? ["What AI noticed", noticed, ""] : []),
    isAiPhoto ? "Try this" : "Try this tonight",
    tryText,
    "",
    "Why nighttime light matters",
    "Lume is made for the moments after dark when the room still needs a little light.",
    "Bright or blue-rich light can send a daytime-like signal at night. Lume is a sleep-spectrum lamp, specially tuned for after dark and designed to support the body's natural melatonin rhythm. Use it before bed or during brief nighttime wake-ups when a small amount of light is needed.",
    `Read the science: ${scienceUrl}`,
    "",
    "This is not a medical assessment. Owlnest Lume is not a medical device. Individual experiences may vary.",
    `Reply to: ${replyTo}`,
  ];

  if (unsubscribeUrl) textParts.push(`Unsubscribe: ${unsubscribeUrl}`);
  if (physicalAddress) textParts.push(physicalAddress);

  return { html, text: textParts.filter((part) => part !== "").join("\n") };
}

function quizRows(payload) {
  const category = resultCategoryLabel(payload.quiz_result_category);
  return [
    { label: "Result", value: category },
    { label: "Score", value: `${numberText(payload.quiz_score_40, 0)} / 40` },
    { label: "Short meaning", value: quizMeaning(category) },
  ];
}

function aiRows(payload) {
  const mainLight = safeText(payload.ai_main_light_source, 90);
  const riskLevel = lightRiskLabel(payload.ai_light_risk_level);
  const rows = [
    {
      label: "Overall result",
      value:
        safeText(payload.ai_combined_result_title, 120) ||
        safeText(payload.ai_archetype_name, 120) ||
        "Your room-light result",
    },
    {
      label: "Total score",
      value: `${numberText(payload.ai_total_score_100, 0)} / 100`,
    },
    {
      label: "Quiz score",
      value: `${numberText(payload.quiz_score_40, 0)} / 40`,
    },
  ];
  if (hasNumber(payload.ai_photo_score_60)) {
    rows.push({
      label: "Photo score",
      value: `${numberText(payload.ai_photo_score_60, 0)} / 60`,
    });
  }
  if (mainLight) rows.push({ label: "Main light source", value: mainLight });
  if (riskLevel) rows.push({ label: "Light risk level", value: riskLevel });
  return rows;
}

function quizMeaning(category) {
  if (category === "High Match") {
    return "Your answers suggest your room may still be sending a daytime-like signal at night.";
  }
  if (category === "Medium Match") {
    return "Your room may not be extreme, but mixed light, screens, or overhead brightness can still send the wrong signal at night.";
  }
  return "Your bedroom already looks relatively sleep-friendly, so Owlnest Lume may be less essential as your main sleep light.";
}

function quizTryItems(payload) {
  const category = resultCategoryLabel(payload.quiz_result_category);
  if (category === "High Match") {
    return [
      "Use Lume during wind-down before bed, or during brief nighttime wake-ups when a small amount of light is needed.",
      "Reduce bright overhead light and screen glow that can send the wrong signal at night.",
      "At bedtime, switch it off unless a little light is still needed.",
    ];
  }
  if (category === "Medium Match") {
    return [
      "Use Lume in your bedroom or relaxation zone when overhead or cool-white light feels too active.",
      "Watch for bathroom, desk, or phone light that keeps the room feeling awake.",
      "Replace harsh light with light specially tuned for nighttime.",
    ];
  }
  return [
    "Your bedroom may already be relatively low-risk.",
    "Try Lume where harsh overhead light breaks the mood: bath, shower wind-down, spa corner, or meditation space.",
    "It can also work beautifully in a guest room or bathroom night routine.",
  ];
}

function aiSummary(payload) {
  return (
    safeText(payload.ai_summary, 260) ||
    "Your room-light analysis points to a few visible light cues worth adjusting before bed."
  );
}

function aiTryItems(payload) {
  const summary = aiSummary(payload);
  const guidance = safeText(payload.ai_product_guidance, 260);
  const guidanceItems = splitSuggestionItems(guidance);
  if (guidanceItems.length && !isNearDuplicate(guidance, summary)) {
    return guidanceItems.slice(0, 3);
  }
  return [
    "Reduce bright overhead light at night.",
    "Keep screens from becoming the main light source.",
    "Use a night-friendly sleep spectrum where the room still feels too visually active.",
  ];
}

function splitSuggestionItems(value) {
  return safeText(value, 260)
    .split(/\n+|(?:^|\s)[•*-]\s+|;\s+|(?<=\.)\s+/u)
    .map((item) => safeText(item.replace(/^[•*-]\s*/u, ""), 120))
    .filter(Boolean)
    .slice(0, 3);
}

function resultCategoryLabel(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("strong") || normalized.includes("high")) {
    return "High Match";
  }
  if (normalized.includes("moderate") || normalized.includes("medium")) {
    return "Medium Match";
  }
  if (normalized.includes("low")) return "Low Match";
  return safeText(value, 80) || "Sleep-Ready Check";
}

function resultRowHtml(label, value) {
  return `<p style="margin:0 0 8px;color:#e8edf7;font-size:15px;line-height:1.55;"><strong style="color:#f0b04f;">${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

function bulletListHtml(items) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0;color:#e8edf7;font-size:15px;line-height:1.58;">${items.map((item) => `<tr><td valign="top" style="width:16px;padding:0 8px 7px 0;color:#f0b04f;font-size:16px;line-height:1.45;">•</td><td style="padding:0 0 7px;color:#e8edf7;font-size:15px;line-height:1.58;">${escapeHtml(item)}</td></tr>`).join("")}</table>`;
}

function numberText(value, fallback) {
  const number = Number.parseInt(String(value), 10);
  return Number.isFinite(number) ? String(number) : String(fallback);
}

function hasNumber(value) {
  return Number.isFinite(Number.parseInt(String(value), 10));
}

function lightRiskLabel(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "low") return "Low";
  if (normalized === "moderate") return "Moderate";
  if (normalized === "high") return "High";
  return "";
}

function isNearDuplicate(a, b) {
  const left = normalizeForCompare(a);
  const right = normalizeForCompare(b);
  if (!left || !right) return false;
  if (left === right) return true;
  const shorter = left.length < right.length ? left : right;
  const longer = left.length < right.length ? right : left;
  return shorter.length > 40 && longer.includes(shorter);
}

function normalizeForCompare(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function safeUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : "";
  } catch {
    return "";
  }
}

function safeText(value, maxLength) {
  return String(value || "")
    .trim()
    .replace(/\s+/gu, " ")
    .slice(0, maxLength);
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/gu, "&#96;");
}

async function handleContactRequest(request, response) {
  if (request.method !== "POST") {
    sendJson(
      response,
      405,
      { success: false, error: "method_not_allowed" },
      { Allow: "POST" },
    );
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
      sendJson(response, error.statusCode, {
        success: false,
        error: error.publicMessage,
      });
      return;
    }

    console.error("Contact request failed.", {
      statusCode: 500,
      summary: error?.name || "internal_error",
    });
    sendJson(response, 500, {
      success: false,
      error: "Unable to process request.",
    });
  }
}

async function handleUpdatesRequest(request, response) {
  if (request.method !== "POST") {
    sendJson(
      response,
      405,
      { success: false, error: "method_not_allowed" },
      { Allow: "POST" },
    );
    return;
  }

  try {
    const rawBody = await readBody(request);
    const fields = parseBody(request, rawBody);

    if (hasHoneypotValue(fields)) {
      sendJson(response, 200, { success: true });
      return;
    }

    const subscription = validateUpdateSubscription(fields);
    await subscribeToUpdates(subscription);
    sendJson(response, 200, { success: true });
  } catch (error) {
    if (error instanceof HttpError) {
      sendJson(response, error.statusCode, {
        success: false,
        error: error.publicMessage,
      });
      return;
    }

    console.error("Updates subscription request failed.", {
      statusCode: 500,
      summary: error?.name || "internal_error",
    });
    sendJson(response, 500, {
      success: false,
      error: "Unable to process request.",
    });
  }
}

async function handleSleepCheckResultRequest(request, response) {
  if (request.method !== "POST") {
    sendJson(
      response,
      405,
      { success: false, error: "method_not_allowed" },
      { Allow: "POST" },
    );
    return;
  }

  try {
    const rawBody = await readBody(request);
    const payload = parseBody(request, rawBody);

    if (hasHoneypotValue(payload)) {
      sendJson(response, 200, { success: true });
      return;
    }

    const email = normalizeEmail(payload.email);
    if (!isValidEmail(email)) {
      throw new HttpError(400, "Please provide a valid email address.");
    }

    await sendSleepCheckEmail(payload, email);
    sendJson(response, 200, { success: true });
  } catch (error) {
    if (error instanceof HttpError) {
      sendJson(response, error.statusCode, {
        success: false,
        error: error.publicMessage,
      });
      return;
    }

    console.error("Sleep-Ready result request failed.", {
      statusCode: 500,
      summary: error?.name || "internal_error",
    });
    sendJson(response, 500, {
      success: false,
      error: "Unable to process request.",
    });
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

  if (requestUrl.pathname === "/api/contact") {
    await handleContactRequest(request, response);
    return;
  }

  if (requestUrl.pathname === "/api/subscribe-updates") {
    await handleUpdatesRequest(request, response);
    return;
  }

  if (requestUrl.pathname === "/api/sleep-check-result") {
    await handleSleepCheckResultRequest(request, response);
    return;
  }

  sendJson(response, 404, { success: false, error: "not_found" });
}

const server = createServer((request, response) => {
  void handleRequest(request, response);
});

server.listen(PORT, HOST, () => {
  console.log(`Owlnest website API listening on ${HOST}:${PORT}.`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
