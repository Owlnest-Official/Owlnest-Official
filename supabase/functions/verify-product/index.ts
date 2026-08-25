import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const ALLOWED_ORIGINS = new Set([
  "https://owlnestofficial.com",
  "https://www.owlnestofficial.com",
  "https://staging.owlnestofficial.com",
]);

function corsHeaders(origin: string | null) {
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin)
    ? origin
    : "https://owlnestofficial.com";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Content-Type": "application/json",
    "Vary": "Origin",
  };
}

function json(headers: Record<string, string>, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers });
}

function normalizeToken(raw: unknown) {
  const input = String(raw ?? "").trim();
  if (!input) return { ok: false as const, reason: "missing_token" };

  const dot = input.lastIndexOf(".");
  const token = (dot >= 0 ? input.slice(dot + 1) : input).trim().toUpperCase();
  if (token.length !== 12) return { ok: false as const, reason: "invalid_length" };
  if (!/^[A-Z0-9]{12}$/.test(token)) return { ok: false as const, reason: "invalid_format" };
  return { ok: true as const, token };
}

Deno.serve(async (req: Request) => {
  const headers = corsHeaders(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response("", { status: 200, headers });
  if (req.method !== "POST") {
    return json(headers, { valid: false, reason: "method_not_allowed", message: "Method Not Allowed" }, 405);
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json(headers, { valid: false, reason: "server_misconfig", message: "Service unavailable" }, 500);
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = normalizeToken(body?.token ?? body?.key ?? "");
    if (!parsed.ok) {
      const message = parsed.reason === "missing_token"
        ? "Missing token"
        : parsed.reason === "invalid_length"
          ? "Token must be 12 characters"
          : "Token format invalid";
      return json(headers, { valid: false, reason: parsed.reason, message });
    }

    const tokenUpper = parsed.token;
    const tokenLower = tokenUpper.toLowerCase();

    let result = await admin
      .from("product_keys")
      .select("payload,status")
      .eq("token", tokenLower)
      .limit(2);

    if (result.error) {
      return json(headers, { valid: false, reason: "db_error", message: "Service unavailable" }, 500);
    }

    let rows = result.data ?? [];
    if (rows.length === 0) {
      result = await admin
        .from("product_keys")
        .select("payload,status")
        .like("payload", `%.${tokenLower}`)
        .limit(2);
      if (result.error) {
        return json(headers, { valid: false, reason: "db_error", message: "Service unavailable" }, 500);
      }
      rows = result.data ?? [];
    }

    if (rows.length === 0) {
      return json(headers, { valid: false, reason: "not_found", message: "Token not found" });
    }
    if (rows.length > 1) {
      return json(headers, { valid: false, reason: "ambiguous_token", message: "Token matches multiple records" });
    }

    const row = rows[0];
    if (row.status !== "active") {
      return json(headers, { valid: false, reason: "inactive", message: "Token is not active or has been revoked" });
    }

    const { data: activation, error: activationError } = await admin
      .from("activations")
      .select("id")
      .eq("payload", row.payload)
      .maybeSingle();

    if (activationError) {
      return json(headers, { valid: false, reason: "db_error", message: "Service unavailable" }, 500);
    }

    return json(headers, {
      valid: true,
      activated: Boolean(activation?.id),
      token: tokenUpper,
    });
  } catch (error) {
    console.error("verify-product error", error);
    return json(headers, { valid: false, reason: "exception", message: "Service unavailable" }, 500);
  }
});
