const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const ARCHETYPES = [
  { id: "deep_night_room", min: 0, max: 12, name: "Deep Night Room" },
  { id: "quiet_dim_room", min: 13, max: 25, name: "Quiet Dim Room" },
  { id: "soft_routine_room", min: 26, max: 38, name: "Soft Routine Room" },
  { id: "twilight_transition_room", min: 39, max: 50, name: "Twilight Transition Room" },
  { id: "mixed_light_room", min: 51, max: 63, name: "Mixed Light Room" },
  { id: "bright_drift_room", min: 64, max: 76, name: "Bright Drift Room" },
  { id: "daylight_echo_room", min: 77, max: 88, name: "Daylight Echo Room" },
  { id: "overlit_night_room", min: 89, max: 100, name: "Overlit Night Room" },
];

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

  const apiUrl = safeUrl(process.env.LUME_AI_ANALYSIS_API_URL);
  const apiKey = String(process.env.LUME_AI_ANALYSIS_API_KEY || "").trim();

  if (!apiUrl) {
    return respond(headers, 503, { success: false, error: "analysis_unavailable" });
  }

  let parsed;
  try {
    parsed = parseMultipartEvent(event);
  } catch (error) {
    return respond(headers, 400, { success: false, error: "invalid_upload" });
  }

  const photoFiles = parsed.files.filter((file) => file.name === "photo");
  if (photoFiles.length !== 1) {
    return respond(headers, 400, { success: false, error: "missing_photo" });
  }

  const photo = photoFiles[0];
  if (!ALLOWED_IMAGE_TYPES.has(photo.contentType)) {
    return respond(headers, 400, { success: false, error: "unsupported_image_type" });
  }

  if (photo.content.length > MAX_IMAGE_BYTES) {
    return respond(headers, 400, { success: false, error: "image_too_large" });
  }

  const rawQuizScore = clampInt(parsed.fields.raw_quiz_score, 0, 20);
  const quizScore40 = clampInt(parsed.fields.quiz_score_40, 0, 40);
  const requestContext = {
    language: "en",
    raw_quiz_score: rawQuizScore,
    quiz_score_40: quizScore40,
    result_category: safeText(parsed.fields.result_category, 40) || "unknown",
    answers_json: safeText(parsed.fields.answers_json, 6000) || "[]",
    answers_text: safeText(parsed.fields.answers_text, 6000),
  };

  try {
    const externalAnalysis = await requestExternalAnalysis({
      apiUrl,
      apiKey,
      photo,
      requestContext,
    });
    const analysis = normalizeAnalysis(externalAnalysis, quizScore40);
    return respond(headers, 200, analysis);
  } catch (error) {
    return respond(headers, 502, { success: false, error: "analysis_failed" });
  }
};

async function requestExternalAnalysis({ apiUrl, apiKey, photo, requestContext }) {
  // TODO: Fill this adaptor after 老哥 provides the API contract:
  // endpoint URL, HTTP method, auth method, request format, expected image field name,
  // quiz payload requirements, response schema, image limit, and error shape.
  //
  // Keep the browser calling only this Netlify Function. Do not expose apiUrl/apiKey
  // in frontend JavaScript. Do not log photo content or user-provided answer text.
  //
  // A likely implementation may build FormData or JSON here, attach server-side auth,
  // call apiUrl with fetch(), then pass the returned JSON to normalizeAnalysis().
  // The exact shape is intentionally not guessed in this checkpoint.
  void apiUrl;
  void apiKey;
  void photo;
  void requestContext;
  throw new Error("external_api_contract_required");
}

function parseMultipartEvent(event) {
  const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) throw new Error("missing boundary");

  const boundary = Buffer.from(`--${boundaryMatch[1] || boundaryMatch[2]}`);
  const body = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64")
    : Buffer.from(event.body || "", "binary");

  const fields = {};
  const files = [];

  for (const rawPart of splitBuffer(body, boundary)) {
    let part = rawPart;
    if (!part.length) continue;
    if (part.slice(0, 2).toString() === "\r\n") part = part.slice(2);
    if (part.slice(0, 2).toString() === "--") continue;
    if (part.slice(-2).toString() === "\r\n") part = part.slice(0, -2);
    if (!part.length) continue;

    const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
    if (headerEnd < 0) continue;

    const headerText = part.slice(0, headerEnd).toString("utf8");
    const content = part.slice(headerEnd + 4);
    const disposition = headerText.match(/content-disposition:\s*form-data;([^\r\n]+)/i);
    if (!disposition) continue;

    const name = matchDispositionValue(disposition[1], "name");
    const filename = matchDispositionValue(disposition[1], "filename");
    if (!name) continue;

    const contentTypeMatch = headerText.match(/content-type:\s*([^\r\n]+)/i);
    const partContentType = contentTypeMatch ? contentTypeMatch[1].trim().toLowerCase() : "";

    if (filename) {
      files.push({ name, filename, contentType: partContentType, content });
    } else {
      fields[name] = content.toString("utf8");
    }
  }

  return { fields, files };
}

function splitBuffer(buffer, delimiter) {
  const parts = [];
  let start = 0;
  let index = buffer.indexOf(delimiter, start);
  while (index !== -1) {
    parts.push(buffer.slice(start, index));
    start = index + delimiter.length;
    index = buffer.indexOf(delimiter, start);
  }
  parts.push(buffer.slice(start));
  return parts;
}

function matchDispositionValue(text, key) {
  const match = text.match(new RegExp(`${key}="([^"]*)"`, "i"));
  return match ? match[1] : "";
}

function normalizeAnalysis(analysis, quizScore40) {
  const photoScore60 = clampInt(analysis.photo_score_60, 0, 60);
  const totalScore100 = clampInt(analysis.total_score_100, 0, 100) || clampInt(quizScore40 + photoScore60, 0, 100);
  const archetype = ARCHETYPES.find((item) => totalScore100 >= item.min && totalScore100 <= item.max) || ARCHETYPES[0];

  return {
    success: true,
    quiz_score_40: quizScore40,
    photo_score_60: photoScore60,
    total_score_100: totalScore100,
    archetype_id: safeKnownArchetype(analysis.archetype_id) || archetype.id,
    archetype_name: safeText(analysis.archetype_name, 80) || archetype.name,
    combined_result_title: safeText(analysis.combined_result_title, 140) || "Your bedtime light environment has room to soften.",
    light_risk_level: enumValue(analysis.light_risk_level, ["low", "moderate", "high"], "moderate"),
    color_temperature_estimate: enumValue(
      analysis.color_temperature_estimate,
      ["very_warm_amber", "warm_white", "neutral_white", "cool_white", "mixed", "too_dark_unknown", "unknown"],
      "unknown"
    ),
    color_temperature_match: enumValue(
      analysis.color_temperature_match,
      ["lume_like", "somewhat_warm", "not_lume_like", "unknown"],
      "unknown"
    ),
    detected_lume: Boolean(analysis.detected_lume),
    overpush_guardrail_applied: Boolean(analysis.overpush_guardrail_applied),
    observed_light_issues: Array.isArray(analysis.observed_light_issues)
      ? analysis.observed_light_issues.map((item) => safeText(item, 160)).filter(Boolean).slice(0, 6)
      : [],
    summary: safeText(analysis.summary, 520),
    product_guidance: safeText(analysis.product_guidance, 520),
    confidence: enumValue(analysis.confidence, ["low", "medium", "high"], "medium"),
  };
}

function safeKnownArchetype(value) {
  const id = String(value || "").trim();
  return ARCHETYPES.some((item) => item.id === id) ? id : "";
}

function safeUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" ? parsed.toString() : "";
  } catch {
    return "";
  }
}

function enumValue(value, allowed, fallback) {
  const normalized = String(value || "").trim();
  return allowed.includes(normalized) ? normalized : fallback;
}

function clampInt(value, min, max) {
  const number = Number.parseInt(String(value), 10);
  return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : min;
}

function safeText(value, maxLength) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function respond(headers, statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}
