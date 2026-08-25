import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

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

function normalizeInput12(raw: unknown) {
  const input = String(raw ?? "").trim();
  if (!input) return { ok: false as const, reason: "missing" };
  if (input.length !== 12) return { ok: false as const, reason: "length" };
  if (!/^[A-Za-z0-9]{12}$/.test(input)) return { ok: false as const, reason: "format" };
  return {
    ok: true as const,
    tokenLower: input.toLowerCase(),
    tokenUpper: input.toUpperCase(),
  };
}

function mask12(input: string) {
  return input.length === 12 ? "*".repeat(8) + input.slice(-4) : "";
}

Deno.serve(async (req: Request) => {
  const headers = corsHeaders(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response("", { status: 200, headers });
  if (req.method !== "POST") {
    return json(headers, { success: false, error: "method_not_allowed" }, 405);
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !ANON_KEY) {
    return json(headers, { success: false, error: "server_misconfig" }, 500);
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return json(headers, { success: false, error: "unauthorized" }, 401);
    }

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: userData, error: userError } = await userClient.auth.getUser();
    const userId = userData?.user?.id;
    if (userError || !userId) {
      return json(headers, { success: false, error: "unauthorized" }, 401);
    }

    const body = await req.json().catch(() => ({}));
    const parsed = normalizeInput12(body?.token ?? body?.key ?? "");
    if (!parsed.ok) {
      return json(headers, { success: false, error: "invalid_code" });
    }

    let result = await admin
      .from("product_keys")
      .select("payload,status,serial,token")
      .eq("token", parsed.tokenLower)
      .limit(2);

    if (result.error) {
      return json(headers, { success: false, error: "db_error", message: result.error.message }, 500);
    }

    let rows = result.data ?? [];
    if (rows.length === 0) {
      result = await admin
        .from("product_keys")
        .select("payload,status,serial,token")
        .like("payload", `%.${parsed.tokenLower}`)
        .limit(2);
      if (result.error) {
        return json(headers, { success: false, error: "db_error", message: result.error.message }, 500);
      }
      rows = result.data ?? [];
    }

    if (rows.length !== 1) {
      return json(headers, { success: false, error: "invalid_code" });
    }

    const row = rows[0];
    if (row.status !== "active") {
      return json(headers, { success: false, error: "revoked" });
    }

    const { data: existing, error: existingError } = await admin
      .from("activations")
      .select("id")
      .eq("payload", row.payload)
      .maybeSingle();

    if (existingError) {
      return json(headers, { success: false, error: "db_error", message: existingError.message }, 500);
    }
    if (existing?.id) {
      return json(headers, { success: false, error: "already_activated" });
    }

    const baseRow = {
      user_id: userId,
      payload: row.payload,
      activated_at: new Date().toISOString(),
    };

    const withDisplayToken = {
      ...baseRow,
      display_token: mask12(parsed.tokenUpper),
    };

    const firstInsert = await admin
      .from("activations")
      .insert(withDisplayToken)
      .select("id")
      .single();

    if (!firstInsert.error) {
      return json(headers, { success: true });
    }

    const secondInsert = await admin
      .from("activations")
      .insert(baseRow)
      .select("id")
      .single();

    if (secondInsert.error) {
      return json(headers, { success: false, error: "db_error", message: secondInsert.error.message }, 500);
    }

    return json(headers, { success: true });
  } catch (error) {
    console.error("activate-product error", error);
    return json(headers, { success: false, error: "exception" }, 500);
  }
});
