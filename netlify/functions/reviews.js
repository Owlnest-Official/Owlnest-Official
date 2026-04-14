const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function corsHeaders(origin) {
  const allowed = (process.env.ALLOWED_ORIGIN || "https://owlnestofficial.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const allowOrigin = allowed.includes(origin) ? origin : (allowed[0] || "https://owlnestofficial.com");

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

function respond(headers, body, statusCode = 200) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

function safeText(value, maxLength) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function getUtcDayBounds() {
  const now = new Date();
  const start = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0, 0, 0, 0
  ));
  const end = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0
  ));

  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

exports.handler = async (event) => {
  const origin = event.headers.origin || "";
  const headers = corsHeaders(origin);

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return respond(headers, { success: false, error: "server_misconfig" }, 500);
  }

  try {
    if (event.httpMethod === "GET") {
      const { data, error } = await supabaseAdmin
        .from("reviews")
        .select("id,name,headline,review,rating,created_at,product")
        .eq("product", "Owlnest Lume")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) {
        return respond(headers, { success: false, error: error.message }, 500);
      }

      return respond(headers, { success: true, reviews: data || [] });
    }

    if (event.httpMethod !== "POST") {
      return respond(headers, { success: false, error: "method_not_allowed" }, 405);
    }

    const body = JSON.parse(event.body || "{}");

    if (String(body.bot_field || "").trim()) {
      return respond(headers, { success: false, error: "spam_detected" }, 400);
    }

    const expected = String(body.verification_expected || "").trim();
    const answer = String(body.verification_answer || "").trim();
    if (!expected || !answer || expected !== answer) {
      return respond(headers, { success: false, error: "verification_failed" }, 400);
    }

    const product = safeText(body.product || "Owlnest Lume", 100);
    const name = safeText(body.name, 80);
    const email = safeText(body.email, 160).toLowerCase();
    const headline = safeText(body.headline, 120);
    const review = String(body.review || "").trim().slice(0, 1600);
    const rating = Number(body.rating);

    if (!name || !email || !headline || !review) {
      return respond(headers, { success: false, error: "missing_fields" }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return respond(headers, { success: false, error: "invalid_email" }, 400);
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return respond(headers, { success: false, error: "invalid_rating" }, 400);
    }

    const { startIso, endIso } = getUtcDayBounds();
    const { data: existingReview, error: existingError } = await supabaseAdmin
      .from("reviews")
      .select("id")
      .eq("product", product)
      .eq("email", email)
      .gte("created_at", startIso)
      .lt("created_at", endIso)
      .limit(1)
      .maybeSingle();

    if (existingError) {
      return respond(headers, { success: false, error: existingError.message }, 500);
    }

    if (existingReview?.id) {
      return respond(headers, { success: false, error: "daily_limit_reached" }, 429);
    }

    const payload = {
      product,
      name,
      email,
      headline,
      review,
      rating,
      published: true,
    };

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .insert(payload)
      .select("id,name,headline,review,rating,created_at,product")
      .single();

    if (error) {
      if (error.code === "23505") {
        return respond(headers, { success: false, error: "daily_limit_reached" }, 429);
      }
      return respond(headers, { success: false, error: error.message }, 500);
    }

    return respond(headers, { success: true, review: data });
  } catch (error) {
    console.error("reviews function error", error);
    return respond(headers, { success: false, error: "exception" }, 500);
  }
};
