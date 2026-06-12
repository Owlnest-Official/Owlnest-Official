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
  const replyTo = safeText(process.env.RESULT_EMAIL_REPLY_TO, 160) || "owlnestpq2025@gmail.com";
  const isAiPhoto = mode === "ai_photo";
  const heading = isAiPhoto ? "Your Sleep-Ready Room Check result" : "Your Sleep-Ready Check result";
  const intro = "Thanks for taking the Sleep-Ready Check. Here's a copy of your result.";
  const resultRows = isAiPhoto ? aiRows(payload) : quizRows(payload);
  const resultTextRows = resultRows.map((row) => `${row.label}: ${row.value}`).join("\n");
  const noticed = aiSummary(payload);
  const tryItems = isAiPhoto ? aiTryItems(payload) : quizTryItems(payload);
  const tryText = tryItems.map((item) => `- ${item}`).join("\n");
  const footerParts = [
    "This is not a medical assessment. Owlnest Lume is not a medical device. Individual experiences may vary.",
    `Reply to: ${replyTo}`,
  ];
  if (unsubscribeUrl) footerParts.push(`Unsubscribe: ${unsubscribeUrl}`);
  if (physicalAddress) footerParts.push(physicalAddress);

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your Sleep-Ready Check result from Owlnest</title>
</head>
<body style="margin:0;background:#111827;color:#132033;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(intro)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#111827;padding:22px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fbf4e8;border-radius:20px;overflow:hidden;">
          <tr>
            <td style="padding:26px 22px 16px;">
              <p style="margin:0 0 14px;color:#c9852a;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;font-weight:700;">Owlnest</p>
              <h1 style="margin:0;color:#111827;font-size:28px;line-height:1.18;font-weight:700;">${escapeHtml(heading)}</h1>
              <p style="margin:12px 0 0;color:#344256;font-size:15px;line-height:1.58;">${escapeHtml(intro)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 22px 14px;">
              <div style="border:1px solid #e0d2bd;border-radius:16px;padding:18px;background:#fffaf2;">
                <h2 style="margin:0 0 12px;color:#111827;font-size:21px;line-height:1.28;">Your result</h2>
                ${resultRows.map((row) => resultRowHtml(row.label, row.value)).join("")}
              </div>
            </td>
          </tr>
          ${isAiPhoto ? `
          <tr>
            <td style="padding:0 22px 14px;">
              <div style="border:1px solid #e0d2bd;border-radius:16px;padding:18px;background:#fffaf2;">
                <h2 style="margin:0 0 10px;color:#111827;font-size:21px;line-height:1.28;">What AI noticed</h2>
                <p style="margin:0;color:#344256;font-size:15px;line-height:1.58;">${escapeHtml(noticed)}</p>
              </div>
            </td>
          </tr>` : ""}
          <tr>
            <td style="padding:0 22px 14px;">
              <div style="border:1px solid #e0d2bd;border-radius:16px;padding:18px;background:#fffaf2;">
                <h2 style="margin:0 0 10px;color:#111827;font-size:21px;line-height:1.28;">${isAiPhoto ? "Try this" : "Try this tonight"}</h2>
                ${bulletListHtml(tryItems)}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 22px 20px;">
              <div style="border:1px solid #e0d2bd;border-radius:16px;padding:18px;background:#fffaf2;">
                <h2 style="margin:0 0 10px;color:#111827;font-size:21px;line-height:1.28;">The science</h2>
                <p style="margin:0 0 10px;color:#344256;font-size:15px;line-height:1.58;">Most lights are designed to help you see. During the 1-2 hours before bed, bright or blue-rich light can make a room feel more alert than your body may want at night.</p>
                <p style="margin:0;color:#344256;font-size:15px;line-height:1.58;">Owlnest Lume is a sleep-supporting spectrum lamp designed for this pre-sleep window, using a deep amber, low-blue spectrum to create a calmer, lower-stimulation light environment before bed.</p>
                <p style="margin:14px 0 0;"><a href="${escapeAttribute(scienceUrl)}" style="color:#9b621c;font-size:15px;font-weight:700;">Read the science</a></p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 22px 24px;background:#111827;color:#d8cdbb;">
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
    "The science",
    "Most lights are designed to help you see. During the 1-2 hours before bed, bright or blue-rich light can make a room feel more alert than your body may want at night.",
    "Owlnest Lume is a sleep-supporting spectrum lamp designed for this pre-sleep window, using a deep amber, low-blue spectrum to create a calmer, lower-stimulation light environment before bed.",
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
    { label: "Overall result", value: safeText(payload.ai_combined_result_title, 120) || safeText(payload.ai_archetype_name, 120) || "Your room-light result" },
    { label: "Total score", value: `${numberText(payload.ai_total_score_100, 0)} / 100` },
    { label: "Quiz score", value: `${numberText(payload.quiz_score_40, 0)} / 40` },
  ];
  if (hasNumber(payload.ai_photo_score_60)) rows.push({ label: "Photo score", value: `${numberText(payload.ai_photo_score_60, 0)} / 60` });
  if (mainLight) rows.push({ label: "Main light source", value: mainLight });
  if (riskLevel) rows.push({ label: "Light risk level", value: riskLevel });
  return rows;
}

function quizMeaning(category) {
  if (category === "High Match") {
    return "Your answers suggest your room may still feel visually active when your body is trying to wind down.";
  }
  if (category === "Medium Match") {
    return "Your routine has some calmer signals, but a few light sources may still be keeping the room alert.";
  }
  return "Your answers suggest your current setup may already be relatively calm and sleep-aware.";
}

function quizTryItems(payload) {
  const category = resultCategoryLabel(payload.quiz_result_category);
  if (category === "High Match") {
    return [
      "Lower bright overhead lights 1-2 hours before bed.",
      "Reduce screen glow when your room is supposed to wind down.",
      "Use a lower-stimulation amber light if you still need visibility at night.",
    ];
  }
  if (category === "Medium Match") {
    return [
      "Start dimming your room earlier in the evening.",
      "Watch for bright bathroom, desk, or phone light before bed.",
      "Try keeping one softer light source for the pre-sleep window.",
    ];
  }
  return [
    "Your current routine already looks relatively sleep-aware.",
    "Keep bright or blue-rich light away from the final part of the night.",
    "Use soft, low-stimulation light only when you need it.",
  ];
}

function aiSummary(payload) {
  return safeText(payload.ai_summary, 260) || "Your room-light analysis points to a few visible light cues worth adjusting before bed.";
}

function aiTryItems(payload) {
  const summary = aiSummary(payload);
  const guidance = safeText(payload.ai_product_guidance, 260);
  const guidanceItems = splitSuggestionItems(guidance);
  if (guidanceItems.length && !isNearDuplicate(guidance, summary)) {
    return guidanceItems.slice(0, 3);
  }
  return [
    "Reduce bright overhead light before bed.",
    "Keep screens from becoming the main light source.",
    "Use a softer amber light for the 1-2 hours before sleep.",
  ];
}

function splitSuggestionItems(value) {
  return safeText(value, 260)
    .split(/\n+|(?:^|\s)[•*-]\s+|;\s+|(?<=\.)\s+/)
    .map((item) => safeText(item.replace(/^[•*-]\s*/, ""), 120))
    .filter(Boolean)
    .slice(0, 3);
}

function resultCategoryLabel(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("strong") || normalized.includes("high")) return "High Match";
  if (normalized.includes("moderate") || normalized.includes("medium")) return "Medium Match";
  if (normalized.includes("low")) return "Low Match";
  return safeText(value, 80) || "Sleep-Ready Check";
}

function resultRowHtml(label, value) {
  return `<p style="margin:0 0 8px;color:#344256;font-size:15px;line-height:1.55;"><strong style="color:#111827;">${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

function bulletListHtml(items) {
  return `<ul style="margin:0;padding:0 0 0 18px;color:#344256;font-size:15px;line-height:1.58;">${items.map((item) => `<li style="margin:0 0 7px;">${escapeHtml(item)}</li>`).join("")}</ul>`;
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
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
