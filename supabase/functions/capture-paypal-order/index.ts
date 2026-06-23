import { corsHeaders, errorResponse, jsonResponse } from "../_shared/cors.ts";
import { capturePayPalOrder, getPayPalAccessToken } from "../_shared/paypal.ts";
import { createSupabaseAdmin } from "../_shared/referral.ts";

type CaptureOrderBody = {
  paypal_order_id?: unknown;
  token?: unknown;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse("METHOD_NOT_ALLOWED", "Only POST is supported.", 405);
  }

  let body: CaptureOrderBody;
  try {
    body = await request.json();
  } catch (_error) {
    return errorResponse("MALFORMED_JSON", "Request body must be valid JSON.", 400);
  }

  const paypalOrderId = normalizePayPalOrderId(body.paypal_order_id || body.token);
  if (!paypalOrderId) {
    return errorResponse("PAYPAL_ORDER_ID_REQUIRED", "paypal_order_id or token is required.", 400);
  }

  try {
    const accessToken = await getPayPalAccessToken();
    const capture = await capturePayPalOrder(accessToken, paypalOrderId);
    const supabaseAdmin = createSupabaseAdmin();

    const { data: existingOrder, error: lookupError } = await supabaseAdmin
      .from("creator_orders")
      .select("id,status,paypal_order_id")
      .eq("paypal_order_id", paypalOrderId)
      .maybeSingle();

    if (lookupError) {
      return errorResponse("SUPABASE_LOOKUP_ERROR", "Unable to look up creator order tracking.", 500);
    }

    if (!existingOrder) {
      return jsonResponse({
        paypal_order_id: capture.id,
        paypal_capture_id: capture.capture_id,
        paypal_status: capture.status,
        status: "captured",
        creator_order_tracking: false,
      });
    }

    if (existingOrder.status === "paid") {
      return jsonResponse({
        paypal_order_id: capture.id,
        paypal_capture_id: capture.capture_id,
        paypal_status: capture.status,
        status: "already_paid",
        creator_order_tracking: true,
      });
    }

    const { error: updateError } = await supabaseAdmin
      .from("creator_orders")
      .update({
        status: "paid",
        paypal_capture_id: capture.capture_id,
        payer_email: capture.payer_email,
        payer_name: capture.payer_name,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingOrder.id);

    if (updateError) {
      return errorResponse("SUPABASE_UPDATE_ERROR", "Unable to update creator order tracking.", 500);
    }

    return jsonResponse({
      paypal_order_id: capture.id,
      paypal_capture_id: capture.capture_id,
      paypal_status: capture.status,
      status: "paid",
      creator_order_tracking: true,
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN_ERROR";

    if (code === "PAYPAL_CONFIG_MISSING" || code === "SUPABASE_CONFIG_MISSING") {
      return errorResponse("SERVER_CONFIG_ERROR", "Capture is not configured.", 500);
    }

    if (code === "PAYPAL_TOKEN_ERROR") {
      return errorResponse("PAYPAL_TOKEN_ERROR", "Unable to initialize PayPal capture.", 502);
    }

    if (code.startsWith("PAYPAL_CAPTURE_ERROR:")) {
      const issue = code.split(":").slice(1).join(":") || "PAYPAL_CAPTURE_ERROR";
      return errorResponse("PAYPAL_CAPTURE_ERROR", issue, 502);
    }

    return errorResponse("SERVER_ERROR", "Unable to capture PayPal order.", 500);
  }
});

function normalizePayPalOrderId(value: unknown): string {
  const id = String(value || "").trim();
  return /^[A-Z0-9][A-Z0-9_-]{4,127}$/i.test(id) ? id : "";
}
