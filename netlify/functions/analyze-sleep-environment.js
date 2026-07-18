const OPENAI_MODEL = process.env.OPENAI_VISION_MODEL || "gpt-5.4-mini";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const ARCHETYPES = [
  { id: "deep_night_room", min: 0, max: 12, en: "Deep Night Room", zh: "深夜靜室型" },
  { id: "quiet_dim_room", min: 13, max: 25, en: "Quiet Dim Room", zh: "低光安定型" },
  { id: "soft_routine_room", min: 26, max: 38, en: "Soft Routine Room", zh: "睡前儀式型" },
  { id: "twilight_transition_room", min: 39, max: 50, en: "Twilight Transition Room", zh: "暮光轉換型" },
  { id: "mixed_light_room", min: 51, max: 63, en: "Mixed Light Room", zh: "混合光線型" },
  { id: "bright_drift_room", min: 64, max: 76, en: "Bright Drift Room", zh: "亮光殘留型" },
  { id: "daylight_echo_room", min: 77, max: 88, en: "Daylight Echo Room", zh: "白日回音型" },
  { id: "overlit_night_room", min: 89, max: 100, en: "Overlit Night Room", zh: "過亮夜晚型" },
];

const SYSTEM_PROMPT = `
You are Owlnest's sleep-environment light analysis engine.
Your score represents Owlnest Lume product fit and bedtime-light improvement opportunity, not medical sleep quality.
Write user-facing copy as if analyzing the room or sleep environment, not the photo.
Do not diagnose, treat, cure, or prevent any condition. Do not promise deeper sleep, cured insomnia, guaranteed sleep improvement, or a guaranteed biological result.
Owlnest Lume is a deep amber, orange-red sleep-spectrum lamp, specially tuned for after dark. It is a sleep-environment tool, not an ordinary night light. Lume gives the room light specially tuned for nighttime and is designed to support the body's natural melatonin rhythm. Use it before bed or during brief nighttime wake-ups when a small amount of light is needed.
Do not describe Lume as low-blue, no-blue, zero-blue, approximately 1500K, or made for all-night use. Do not claim that leaving it on improves sleep, cannot affect sleep, or cannot affect melatonin. A photograph can support visible appearance only; it cannot establish Lume's measured spectrum, color temperature, melanopic metrics, or biological effect.

Rules:
1. Prioritize color temperature, likely spectral stimulation, direct glare, screen glow, and competing light sources. Low brightness alone is not automatically good if the color temperature or spectrum is stimulating.
2. Evaluate the light that actually reaches the room, regardless of source. It can come from windows, ceiling lights, desk lamps, reading lamps, screens, hallway spill, or any other source. Score by color temperature, likely spectrum, brightness, directness, size/area, and position relative to the user.
3. A room can look warm, cozy, beige, or aesthetically calm while still being a high-stimulation bedtime environment if it is broadly lit by daylight, warm-white light, or a bright bedside lamp. Do not confuse ordinary warm-white lighting or warm daylight with Lume's deep amber, orange-red sleep spectrum. Warm is how light looks; spectrum is what light contains.
4. Large bright surfaces such as white bedding, walls, curtains, or tabletops are evidence of broad ambient light exposure.
5. Screen/TV/phone/tablet light is a special high-stimulation signal. Even when the room is dark overall, visible cool blue screen light on the face, body, bedding, wall, or blanket should raise the score significantly.
6. Distinguish blue color from biologically relevant blue-rich light. A blue-looking dusk sky, winter twilight, or outdoor blue-hour window view is not the same as TV/phone/monitor blue light. Do not score it high unless it strongly illuminates the room, bed, face, or body.
7. If the room has blue-hour/twilight outdoor color plus warm indoor light around 2200K-2700K, score it as moderate unless the warm light is very bright/direct or the outdoor light dominates the room.
8. Score calibration for photo_score_60:
   - 50-60: extremely bright, extremely white/cool, high-CCT, broad-area, overhead, direct, or obviously high-stimulation white light.
   - 42-55: visible TV/monitor/phone/tablet blue light, especially if it lights the face, body, bedding, blanket, or wall.
   - 42-49: clearly bright or white/neutral light, strong screen glow, visible spill light, or a room that still feels visually awake.
   - 32-41: warm/cozy but still broadly illuminated; warm-white bedside lamps plus daylight, bright bedding, or a room that is still easy to be active in.
   - 30-38: dusk/twilight/blue-hour window view with moderate warm indoor lighting around 2200K-2700K; comfortable but not yet deep amber and low-stimulation.
   - 26-31: mixed or moderate stimulation; some warm light but limited competing white/cool/screen sources.
   - 10-25: mostly low-stimulation, all-black, or already deep amber, with only minor competing light.
   - 0-9: very sleep-ready deep amber environment with no meaningful competing light.
9. Deep amber, orange-red light or visible Lume lowers purchase pressure unless other issues are visible.
10. If Owlnest Lume or a similar deep amber sleep lamp is visible, set detected_lume=true internally, but do not mention detection in user-facing copy. Give calm setup guidance.
11. Nearly all-black environments are low-stimulation. Do not hard sell Lume for the bedroom when need appears low; instead suggest other night-friendly spaces when appropriate.
12. Explain quiz/environment contradictions naturally.
13. Do not include phrases like "不需要強推購買", "硬推", "畫面中沒有看到 Lume", "照片顯示", "這張照片", or "Owlnest Lume 引導" in user-facing fields.
14. Use a relaxed, warm tone while explaining professional light concepts.
15. Product guidance should match risk level:
   - Low risk: say bedroom need may be lower. Suggest bath, shower wind-down, spa corner, meditation or stretching space, guest room, or bathroom night routine.
   - Moderate risk: suggest bedroom or relaxation-zone use focused on reducing harsh, cool-white, overhead, or screen-heavy light.
   - High risk: recommend Lume more clearly as a sleep-spectrum lamp for wind-down before bed or brief nighttime wake-ups when a small amount of light is needed.

Copy style:
- Write for a consumer quiz result card, not a report.
- Use plain English for US consumers unless Traditional Chinese is requested.
- Keep archetype_name to 2-5 words.
- Keep combined_result_title to 6-9 English words when possible. It should feel like a result title, not a report heading.
- Keep summary to no more than 2 short sentences and 45-55 words. Mention the room light condition, why it matters at night, and what signal the room sends.
- Keep observed_light_issues to at most 3 concise bullets, 8-12 words each.
- Keep product_guidance to 2-3 short sentences. Match low, moderate, or high risk without hard selling.
- Keep every sentence short and easy to scan.
- Avoid long paragraphs, repeated ideas, and technical over-explaining.
- Do not say the room "needs" Owlnest Lume.
- Mention Owlnest Lume only as a possible fit, not a required solution.
- Prefer concrete visible-light observations over abstract science language.
- Do not describe Lume as generic ambience, ordinary visibility lighting, or a temporary step before turning everything off.

Return only valid JSON matching the schema.
`;

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
    "main_light_source",
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
    color_temperature_estimate: { type: "string", enum: ["very_warm_amber", "warm_white", "neutral_white", "cool_white", "mixed", "too_dark_unknown"] },
    color_temperature_match: { type: "string", enum: ["lume_like", "somewhat_warm", "not_lume_like", "unknown"] },
    detected_lume: { type: "boolean" },
    overpush_guardrail_applied: { type: "boolean" },
    main_light_source: { type: "string" },
    observed_light_issues: { type: "array", items: { type: "string" }, maxItems: 3 },
    summary: { type: "string" },
    product_guidance: { type: "string" },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
  },
};

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

  if (!process.env.OPENAI_API_KEY) {
    return respond(headers, 503, { success: false, error: "analysis_unavailable" });
  }

  let parsed;
  try {
    parsed = parseMultipartEvent(event);
  } catch {
    return respond(headers, 400, { success: false, error: "expected_multipart" });
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

  const language = normalizeLanguage(parsed.fields.language);
  const rawQuizScore = clampInt(parsed.fields.raw_quiz_score, 0, 20);
  const quizScore40 = clampInt(parsed.fields.quiz_score_40, 0, 40);
  const resultCategory = safeText(parsed.fields.result_category, 80) || "unknown";
  const answersJson = safeText(parsed.fields.answers_json, 6000) || "[]";
  const answersText = safeText(parsed.fields.answers_text, 6000);
  const imageDataUrl = `data:${photo.contentType};base64,${photo.content.toString("base64")}`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: [
          { role: "system", content: [{ type: "input_text", text: SYSTEM_PROMPT }] },
          {
            role: "user",
            content: [
              { type: "input_text", text: buildUserPrompt({ language, rawQuizScore, quizScore40, resultCategory, answersJson, answersText }) },
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

    const analysis = normalizeAnalysis(parseResponseJson(await response.json()), quizScore40, language);
    return respond(headers, 200, analysis);
  } catch {
    return respond(headers, 502, { success: false, error: "analysis_failed" });
  }
};

function buildUserPrompt({ language, rawQuizScore, quizScore40, resultCategory, answersJson, answersText }) {
  const archetypeTable = ARCHETYPES.map((item) => `${item.min}-${item.max}: ${language === "zh-tw" ? item.zh : item.en} (${item.id})`).join("\n");
  return `Return language: ${language === "zh-tw" ? "Traditional Chinese" : "English"}.
Raw quiz score: ${rawQuizScore}/20. Quiz score contribution: ${quizScore40}/40. Original quiz category: ${resultCategory}.
Quiz answers JSON: ${answersJson}
Quiz answers text:
${answersText}
Archetypes:
${archetypeTable}
Assign photo_score_60 from 0 to 60. Analyze the sleep environment for color temperature, likely spectral stimulation, brightness, direct glare, screen glow, main light source, all-black condition, deep amber or orange-red light, and visible Lume.
If the room has very bright, very white, cool, overhead, direct, or broad-area high-stimulation light from any source, the photo_score_60 should usually be at least 45. If it is extremely bright and extremely white/cool, it should usually be 50-60.
If the room looks cozy/warm but has strong daylight through a window, bright white bedding/walls, and a lit bedside lamp, the photo_score_60 should usually be 38-50, not 10-25.
If a dark room has clear blue/cool screen or TV light reflected on the user, bed, blanket, wall, or bedding, the photo_score_60 should usually be 42-55, not 10-25.
If the "blue" is mainly outdoor dusk/twilight color seen through a window, and the indoor light is warm around 2200K-2700K, the photo_score_60 should usually be around 30-38, not 42-55.
User-facing copy should say room or bedtime environment, not photo or image.
If the environment has a deep amber, orange-red glow or shows Lume, lower sales pressure internally but do not say this explicitly. Explain how light specially tuned for nighttime can reduce the need for harsher overhead or screen-heavy light.
Keep visible result copy card-friendly: combined_result_title should be 6-9 words when possible; summary should be no more than 2 short sentences and 45-55 words; product_guidance should be 2-3 short sentences; main_light_source under 80 characters; observed_light_issues should have at most 3 concise bullets, 8-12 words each.
Use product_guidance as short practical guidance. Match guidance to risk level: low risk should include alternate spaces such as bath, shower wind-down, spa corner, meditation space, guest room, or bathroom night routine; moderate risk can suggest bedroom or relaxation-zone use; high risk can recommend Lume for wind-down before bed or brief nighttime wake-ups when a small amount of light is needed. Do not write a long paragraph.`;
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

function normalizeAnalysis(analysis, quizScore40, language) {
  const photoScore60 = clampInt(analysis.photo_score_60, 0, 60);
  const total = clampInt(quizScore40 + photoScore60, 0, 100);
  const archetype = ARCHETYPES.find((item) => total >= item.min && total <= item.max) || ARCHETYPES[0];

  return {
    success: true,
    quiz_score_40: quizScore40,
    photo_score_60: photoScore60,
    total_score_100: total,
    archetype_id: archetype.id,
    archetype_name: language === "zh-tw" ? archetype.zh : archetype.en,
    combined_result_title: safeText(analysis.combined_result_title, 90) || "Your bedtime light environment has room to soften.",
    light_risk_level: enumValue(analysis.light_risk_level, ["low", "moderate", "high"], "moderate"),
    color_temperature_estimate: enumValue(
      analysis.color_temperature_estimate,
      ["very_warm_amber", "warm_white", "neutral_white", "cool_white", "mixed", "too_dark_unknown"],
      "too_dark_unknown"
    ),
    color_temperature_match: enumValue(
      analysis.color_temperature_match,
      ["lume_like", "somewhat_warm", "not_lume_like", "unknown"],
      "unknown"
    ),
    detected_lume: Boolean(analysis.detected_lume),
    overpush_guardrail_applied: Boolean(analysis.overpush_guardrail_applied),
    main_light_source: safeText(analysis.main_light_source, 80),
    observed_light_issues: Array.isArray(analysis.observed_light_issues)
      ? analysis.observed_light_issues.map((item) => safeText(item, 80)).filter(Boolean).slice(0, 3)
      : [],
    summary: safeText(analysis.summary, 240),
    product_guidance: safeText(analysis.product_guidance, 240),
    confidence: enumValue(analysis.confidence, ["low", "medium", "high"], "medium"),
  };
}

function normalizeLanguage(value) {
  return String(value || "").toLowerCase().includes("zh") ? "zh-tw" : "en";
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
