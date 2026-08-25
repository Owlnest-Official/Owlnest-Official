import { createClient } from "npm:@supabase/supabase-js@2";

const PRODUCT_NAME = "Owlnest Lume";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

const client = createClient(SUPABASE_URL, ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

const ALLOWED_ORIGINS = new Set([
  "https://owlnestofficial.com",
  "https://www.owlnestofficial.com",
  "https://staging.owlnestofficial.com",
]);

function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("origin") ?? "";
  const allowOrigin = ALLOWED_ORIGINS.has(origin)
    ? origin
    : "https://owlnestofficial.com";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
  };
}

function json(request: Request, body: unknown, status = 200, extraHeaders: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(request),
      ...extraHeaders,
    },
  });
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
    return body && typeof body === "object" ? body as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  if (request.method !== "GET" && request.method !== "POST") {
    return json(request, { success: false, error: "method_not_allowed" }, 405, {
      "Cache-Control": "no-store",
    });
  }

  if (!SUPABASE_URL || !ANON_KEY) {
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
      .insert({ name, email, headline, review, rating });

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

    return json(request, { success: true, status: "pending_moderation" }, 202, {
      "Cache-Control": "no-store",
    });
  } catch (error) {
    console.error("reviews function error", error);
    return json(request, { success: false, error: "reviews_unavailable" }, 503, {
      "Cache-Control": "no-store",
    });
  }
});
