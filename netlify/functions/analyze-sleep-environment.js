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

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "quiz_score_40",
    "photo_score_60",
    "total_score_100",
    "archetype_id",
    "archetype_name",
    "combined_result_title",
    "light_risk_level",
    "color_temperature_estimate",
    "color_temperature_match",
    "detected_lume",
    "overpush_guardrail_applied",
    "observed_light_issues",
    "summary",
    "product_guidance",
    "confidence",
  ],
  properties: {
    quiz_score_40: { type: "integer", minimum: 0, maximum: 40 },
    photo_score_60: { type: "integer", minimum: 0, maximum: 60 },
    total_score_100: { type: "integer", minimum: 0, maximum: 100 },
    archetype_id: { type: "string", enum: ARCHETYPES.map((item) => item.id) },
    archetype_name: { type: "string" },
    combined_result_title: { type: "string" },
    light_risk_level: { type: "string", enum: ["low", "moderate", "high"] },
    color_temperature_estimate: {
      type: "string",
      enum: ["very_warm_amber", "warm_white", "neutral_white", "cool_white", "mixed", "too_dark_unknown"],
    },
    color_temperature_match: { type: "string", enum: ["lume_like", "somewhat_warm", "not_lume_like", "unknown"] },
    detected_lume: { type: "boolean" },
    overpush_guardrail_applied: { type: "boolean" },
    observed_light_issues: { type: "array", items: { type: "string" }, maxItems: 6 },
    summary: { type: "string" },
    product_guidance: { type: "string" },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
  },
};

const SYSTEM_PROMPT = `
You are Owlnest's bedtime room-light analysis engine.
Your score represents Owlnest Lume product fit and bedtime-light improvement opportunity, not medical sleep quality.
Write user-facing copy as if analyzing the room or bedtime light environment, not the photo.
Do not diagnose, treat, cure, or prevent any condition. Do not promise deeper sleep, cured insomnia, or guaranteed sleep improvement.
Owlnest Lume is a deep amber, low-blue sleep-supporting spectrum lamp for the 1-2 hours before bed.

Evaluate visible light, likely color temperature, broad room brightness, direct glare, screen glow, and whether the room still feels visually active before sleep.
Ordinary warm-white lamps, daylight, and cozy decor are not the same as a deep amber low-blue bedtime light.
If large bright surfaces are illuminated, treat that as broad ambient light exposure.
Screen, TV, phone, or monitor glow can be high-stimulation even when the room is otherwise dim.
Nearly all-dark or deep amber low-blue rooms should score lower unless other stimulating light is visible.

Return only valid JSON matching the schema.
`;

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

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_VISION_MODEL;

  if (!apiKey || !model) {
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
  const resultCategory = safeText(parsed.fields.result_category, 40) || "unknown";
  const answersJson = safeText(parsed.fields.answers_json, 6000) || "[]";
  const answersText = safeText(parsed.fields.answers_text, 6000);
  const imageDataUrl = `data:${photo.contentType};base64,${photo.content.toString("base64")}`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          { role: "system", content: [{ type: "input_text", text: SYSTEM_PROMPT }] },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: buildUserPrompt({ rawQuizScore, quizScore40, resultCategory, answersJson, answersText }),
              },
              { type: "input_image", image_url: imageDataUrl, detail: "high" },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "sleep_environment_analysis",
            strict: true,
            schema: RESPONSE_SCHEMA,
          },
        },
      }),
    });

    if (!response.ok) {
      return respond(headers, 502, { success: false, error: "analysis_failed" });
    }

    const data = await response.json();
    const analysis = normalizeAnalysis(parseResponseJson(data), quizScore40);
    return respond(headers, 200, analysis);
  } catch (error) {
    return respond(headers, 502, { success: false, error: "analysis_failed" });
  }
};

function buildUserPrompt({ rawQuizScore, quizScore40, resultCategory, answersJson, answersText }) {
  const archetypeTable = ARCHETYPES.map((item) => `${item.min}-${item.max}: ${item.name} (${item.id})`).join("\n");
  return `Return language: English.
Raw quiz score: ${rawQuizScore}/20.
Quiz score contribution: ${quizScore40}/40.
Original quiz category: ${resultCategory}.

Quiz answers JSON:
${answersJson}

Quiz answers text:
${answersText}

Archetypes:
${archetypeTable}

Assign photo_score_60 from 0 to 60, then combine it with quiz_score_40 for total_score_100.
Higher score means stronger Owlnest Lume fit or greater bedtime room-light improvement opportunity.
Use safe labels such as Sleep-Ready Room Score, Bedtime Light Environment Score, Owlnest Lume Fit, and room-light improvement opportunity.
Avoid medical claims, diagnosis, treatment, insomnia, disorders, guaranteed sleep outcomes, melatonin production claims, or clinical proof claims.
In summary and product_guidance, speak about the bedtime light environment, visible room-light stimulation, screen glow, and lower-stimulation light.`;
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

function parseResponseJson(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return JSON.parse(data.output_text);
  }

  const parts = [];
  for (const output of data.output || []) {
    for (const content of output.content || []) {
      if (content.type === "output_text" && content.text) parts.push(content.text);
    }
  }

  if (!parts.length) throw new Error("missing model output");
  return JSON.parse(parts.join("\n"));
}

function normalizeAnalysis(analysis, quizScore40) {
  const photoScore60 = clampInt(analysis.photo_score_60, 0, 60);
  const totalScore100 = clampInt(quizScore40 + photoScore60, 0, 100);
  const archetype = ARCHETYPES.find((item) => totalScore100 >= item.min && totalScore100 <= item.max) || ARCHETYPES[0];

  return {
    success: true,
    quiz_score_40: quizScore40,
    photo_score_60: photoScore60,
    total_score_100: totalScore100,
    archetype_id: archetype.id,
    archetype_name: archetype.name,
    combined_result_title: safeText(analysis.combined_result_title, 140) || "Your bedtime light environment has room to soften.",
    light_risk_level: enumValue(analysis.light_risk_level, ["low", "moderate", "high"], "moderate"),
    color_temperature_estimate: enumValue(
      analysis.color_temperature_estimate,
      ["very_warm_amber", "warm_white", "neutral_white", "cool_white", "mixed", "too_dark_unknown"],
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
