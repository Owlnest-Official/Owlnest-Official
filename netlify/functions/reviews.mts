import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const PRODUCT_NAME = "Owlnest Lume";
const DEFAULT_SUPABASE_URL = "https://khoiplqugajmybmultzs.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_ic3b9TeYt7SuXxLIhLuyvA_FWHYVb0Z";
let supabaseClient: SupabaseClient | null = null;

function env(name: string): string {
  const netlifyEnv = (globalThis as typeof globalThis & {
    Netlify?: { env?: { get?: (key: string) => string | undefined } };
  }).Netlify?.env?.get?.(name);

  return String(netlifyEnv ?? process.env[name] ?? "").trim();
}

function corsHeaders(request: Request): HeadersInit {
  const allowedOrigins = (env("ALLOWED_ORIGIN") || "https://owlnestofficial.com")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const origin = request.headers.get("origin") ?? "";
  const allowOrigin = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
  };
}

function json(
  request: Request,
  body: unknown,
  status = 200,
  extraHeaders: HeadersInit = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(request),
      ...extraHeaders,
    },
  });
}

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = env("SUPABASE_URL") || DEFAULT_SUPABASE_URL;
  const publishableKey = env("SUPABASE_PUBLISHABLE_KEY")
    || env("SUPABASE_ANON_KEY")
    || DEFAULT_SUPABASE_PUBLISHABLE_KEY;

  try {
    supabaseClient = createClient(url, publishableKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  } catch (error) {
    console.error("reviews client initialization error", error);
    return null;
  }

  return supabaseClient;
}

function safeText(value: unknown, maxLength: number): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

async function parseJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object"
      ? body as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
}

export default async (request: Request): Promise<Response> => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(request),
    });
  }

  if (request.method !== "GET" && request.method !== "POST") {
    return json(request, { success: false, error: "method_not_allowed" }, 405, {
      "Cache-Control": "no-store",
    });
  }

  const client = getSupabaseClient();
  if (!client) {
    return json(request, { success: false, error: "server_misconfig" }, 503, {
      "Cache-Control": "no-store",
    });
  }

  try {
    if (request.method === "GET") {
      const { data, error } = await client
        .from("reviews")
        .select("id,name,headline,review,rating,created_at,product")
        .eq("product", PRODUCT_NAME)
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) {
        console.error("reviews read error", error);
        return json(request, { success: false, error: "reviews_unavailable" }, 503, {
          "Cache-Control": "no-store",
        });
      }

      return json(request, { success: true, reviews: data ?? [] }, 200, {
        "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
      });
    }

    const body = await parseJson(request);
    if (!body) {
      return json(request, { success: false, error: "invalid_json" }, 400, {
        "Cache-Control": "no-store",
      });
    }

    if (safeText(body.bot_field, 200)) {
      return json(request, { success: false, error: "spam_detected" }, 400, {
        "Cache-Control": "no-store",
      });
    }

    const expected = safeText(body.verification_expected, 32);
    const answer = safeText(body.verification_answer, 32);
    if (!expected || !answer || expected !== answer) {
      return json(request, { success: false, error: "verification_failed" }, 400, {
        "Cache-Control": "no-store",
      });
    }

    const name = safeText(body.name, 80);
    const email = safeText(body.email, 160).toLowerCase();
    const headline = safeText(body.headline, 120);
    const review = String(body.review ?? "").trim().slice(0, 1600);
    const rating = Number(body.rating);

    if (!name || !email || !headline || !review) {
      return json(request, { success: false, error: "missing_fields" }, 400, {
        "Cache-Control": "no-store",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(request, { success: false, error: "invalid_email" }, 400, {
        "Cache-Control": "no-store",
      });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return json(request, { success: false, error: "invalid_rating" }, 400, {
        "Cache-Control": "no-store",
      });
    }

    const { error } = await client
      .from("reviews")
      .insert({
        name,
        email,
        headline,
        review,
        rating,
      });

    if (error) {
      if (error.code === "23505") {
        return json(request, { success: false, error: "daily_limit_reached" }, 429, {
          "Cache-Control": "no-store",
        });
      }

      console.error("reviews insert error", error);
      return json(request, { success: false, error: "review_not_saved" }, 503, {
        "Cache-Control": "no-store",
      });
    }

    return json(request, {
      success: true,
      status: "pending_moderation",
    }, 202, {
      "Cache-Control": "no-store",
    });
  } catch (error) {
    console.error("reviews function error", error);
    return json(request, { success: false, error: "reviews_unavailable" }, 503, {
      "Cache-Control": "no-store",
    });
  }
};

export const config = {
  method: ["GET", "POST", "OPTIONS"],
};
