const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_SCIENCE_URL = "https://owlnestofficial.com/science/";

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "https://owlnestofficial.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return respond(headers, 405, { success: false, error: "method_not_allowed" });
  }

  const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return respond(headers, 400, { success: false, error: "expected_json" });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return respond(headers, 400, { success: false, error: "invalid_json" });
  }

  const email = normalizeEmail(payload.email);
  if (!email || !isValidEmail(email)) {
    return respond(headers, 400, { success: false, error: "invalid_email" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = safeText(process.env.RESULT_EMAIL_FROM, 160);
  if (!apiKey || !from) {
    return respond(headers, 503, { success: false, error: "email_unavailable" });
  }

  const emailContent = buildResultEmail(payload);
  const requestBody = {
    from,
    to: [email],
    subject: "Your Sleep-Ready Check result from Owlnest",
    html: emailContent.html,
    text: emailContent.text,
  };

  const replyTo = safeText(process.env.RESULT_EMAIL_REPLY_TO, 160);
  if (replyTo) requestBody.reply_to = replyTo;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return respond(headers, 502, { success: false, error: "email_unavailable" });
    }

    return respond(headers, 200, { success: true });
  } catch {
    return respond(headers, 502, { success: false, error: "email_unavailable" });
  }
};

function buildResultEmail(payload) {
  const mode = payload.analysis_mode === "ai_photo" ? "ai_photo" : "quiz_only";
  const scienceUrl = safeUrl(process.env.OWLNEST_SCIENCE_URL) || DEFAULT_SCIENCE_URL;
  const unsubscribeUrl = safeUrl(process.env.RESULT_EMAIL_UNSUBSCRIBE_URL);
  const physicalAddress = safeText(process.env.OWLNEST_PHYSICAL_ADDRESS, 240);
  const replyTo = safeText(process.env.RESULT_EMAIL_REPLY_TO, 160);
  const suggestion = mode === "ai_photo" ? aiSuggestion(payload) : quizSuggestion(payload);
  const resultRows = mode === "ai_photo" ? aiRows(payload) : quizRows(payload);
  const resultTextRows = resultRows.map((row) => `${row.label}: ${row.value}`).join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your Sleep-Ready Check result from Owlnest</title>
</head>
<body style="margin:0;background:#111827;color:#132033;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">Thanks for taking the Sleep-Ready Check. Your result is inside.</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#111827;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fbf4e8;border-radius:22px;overflow:hidden;">
          <tr>
            <td style="padding:34px 30px 20px;">
              <p style="margin:0 0 18px;color:#c9852a;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;">Owlnest</p>
              <h1 style="margin:0;color:#111827;font-size:32px;line-height:1.15;font-weight:700;">Your Sleep-Ready Check result</h1>
              <p style="margin:16px 0 0;color:#344256;font-size:16px;line-height:1.65;">Thanks for taking the Sleep-Ready Check.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 30px 22px;">
              <div style="border:1px solid #e0d2bd;border-radius:18px;padding:22px;background:#fffaf2;">
                <h2 style="margin:0 0 16px;color:#111827;font-size:20px;line-height:1.3;">Your result</h2>
                ${resultRows.map((row) => resultRowHtml(row.label, row.value)).join("")}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 30px 22px;">
              <div style="border:1px solid #e0d2bd;border-radius:18px;padding:22px;background:#fffaf2;">
                <h2 style="margin:0 0 12px;color:#111827;font-size:20px;line-height:1.3;">What we'd suggest</h2>
                <p style="margin:0;color:#344256;font-size:15px;line-height:1.7;">${escapeHtml(suggestion)}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 30px 26px;">
              <div style="border:1px solid #e0d2bd;border-radius:18px;padding:22px;background:#fffaf2;">
                <h2 style="margin:0 0 12px;color:#111827;font-size:20px;line-height:1.3;">The science</h2>
                <p style="margin:0 0 12px;color:#344256;font-size:15px;line-height:1.7;">Most lights are designed to help you see. During the 1-2 hours before bed, bright or blue-rich light can make a room feel more visually alert than your body may want at night.</p>
                <p style="margin:0;color:#344256;font-size:15px;line-height:1.7;">Owlnest Lume is a sleep-supporting spectrum lamp designed for this pre-sleep window. Its deep amber, low-blue spectrum is made to create a calmer, lower-stimulation light environment before bed.</p>
                <p style="margin:16px 0 0;"><a href="${escapeAttribute(scienceUrl)}" style="color:#9b621c;font-weight:700;">Read the science</a></p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 30px 34px;background:#111827;color:#d8cdbb;">
              <p style="margin:0 0 8px;font-size:12px;line-height:1.6;">This is not a medical assessment. Owlnest Lume is not a medical device. Individual experiences may vary.</p>
              <p style="margin:0 0 8px;font-size:12px;line-height:1.6;">You can unsubscribe at any time.${unsubscribeUrl ? ` <a href="${escapeAttribute(unsubscribeUrl)}" style="color:#f2c98a;">Unsubscribe</a>.` : ""}</p>
              ${replyTo ? `<p style="margin:0 0 8px;font-size:12px;line-height:1.6;">Reply to: ${escapeHtml(replyTo)}</p>` : ""}
              ${physicalAddress ? `<p style="margin:0;font-size:12px;line-height:1.6;">${escapeHtml(physicalAddress)}</p>` : ""}
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
    "Thanks for taking the Sleep-Ready Check.",
    "",
    "Your result",
    resultTextRows,
    "",
    "What we'd suggest",
    suggestion,
    "",
    "The science",
    "Most lights are designed to help you see. During the 1-2 hours before bed, bright or blue-rich light can make a room feel more visually alert than your body may want at night.",
    "Owlnest Lume is a sleep-supporting spectrum lamp designed for this pre-sleep window. Its deep amber, low-blue spectrum is made to create a calmer, lower-stimulation light environment before bed.",
    `Read the science: ${scienceUrl}`,
    "",
    "This is not a medical assessment. Owlnest Lume is not a medical device. Individual experiences may vary.",
    "You can unsubscribe at any time.",
  ];

  if (unsubscribeUrl) textParts.push(`Unsubscribe: ${unsubscribeUrl}`);
  if (replyTo) textParts.push(`Reply to: ${replyTo}`);
  if (physicalAddress) textParts.push(physicalAddress);

  return { html, text: textParts.filter((part) => part !== "").join("\n") };
}

function quizRows(payload) {
  return [
    { label: "Quiz result", value: resultCategoryLabel(payload.quiz_result_category) },
    { label: "Quiz-only score", value: `${numberText(payload.quiz_score_40, 0)} / 40` },
    { label: "Summary", value: safeText(payload.quiz_summary, 360) || "Your answers show how your room light may affect the hours before bed." },
  ];
}

function aiRows(payload) {
  return [
    { label: "Quiz result", value: resultCategoryLabel(payload.quiz_result_category) },
    { label: "Quiz score", value: `${numberText(payload.quiz_score_40, 0)} / 40` },
    { label: "AI room-light result", value: safeText(payload.ai_archetype_name, 120) || "Room-light check" },
    { label: "Room-light score", value: `${numberText(payload.ai_photo_score_60, 0)} / 60` },
    { label: "Total Sleep-Ready Room Score", value: `${numberText(payload.ai_total_score_100, 0)} / 100` },
    { label: "Summary", value: safeText(payload.ai_summary, 360) || "Your room-light analysis is ready." },
  ];
}

function quizSuggestion(payload) {
  const provided = safeText(payload.quiz_recommendation, 420);
  if (provided) return provided;

  const category = String(payload.quiz_result_category || "").toLowerCase();
  if (category.includes("strong") || category.includes("high")) {
    return "Lower bright overhead light earlier, move screen light away from bed, and use lower-position soft light before bed.";
  }
  if (category.includes("moderate") || category.includes("medium")) {
    return "Keep the calm parts of your routine, then identify one or two light sources that still feel too bright.";
  }
  return "Your current setup may already be relatively calm; Owlnest Lume may still be useful as a softer evening cue.";
}

function aiSuggestion(payload) {
  const provided = safeText(payload.ai_product_guidance, 420);
  if (provided) return provided;
  return "Try reducing visible bright or screen-based light near the bed, then use a lower, deeper amber light during the final part of your evening.";
}

function resultCategoryLabel(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("strong") || normalized.includes("high")) return "High Match";
  if (normalized.includes("moderate") || normalized.includes("medium")) return "Medium Match";
  if (normalized.includes("low")) return "Low Match";
  return safeText(value, 80) || "Sleep-Ready Check";
}

function resultRowHtml(label, value) {
  return `<p style="margin:0 0 10px;color:#344256;font-size:15px;line-height:1.65;"><strong style="color:#111827;">${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function numberText(value, fallback) {
  const number = Number.parseInt(String(value), 10);
  return Number.isFinite(number) ? String(number) : String(fallback);
}

function safeUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : "";
  } catch {
    return "";
  }
}

function safeText(value, maxLength) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function respond(headers, statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

exports._test = {
  buildResultEmail,
};
