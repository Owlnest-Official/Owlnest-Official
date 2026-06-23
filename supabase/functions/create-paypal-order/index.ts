import { corsHeaders, errorResponse, jsonResponse } from "../_shared/cors.ts";
import { createPayPalOrder, getPayPalAccessToken } from "../_shared/paypal.ts";
import {
  calculateCommission,
  createSupabaseAdmin,
  discountAmountForCreator,
  findValidCreator,
  getPaidCreatorUnits,
  isPackageKey,
  priceForPackage,
  type CreatorReferralHint,
} from "../_shared/referral.ts";

type CreateOrderBody = {
  package?: unknown;
  creator_referral?: CreatorReferralHint | null;
  client_context?: {
    page?: string;
    locale?: string;
  };
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse("METHOD_NOT_ALLOWED", "Only POST is supported.", 405);
  }

  let body: CreateOrderBody;
  try {
    body = await request.json();
  } catch (_error) {
    return errorResponse("MALFORMED_JSON", "Request body must be valid JSON.", 400);
  }

  if (!isPackageKey(body.package)) {
    return errorResponse("INVALID_PACKAGE", "Package must be single or duo.", 400);
  }

  try {
    const supabaseAdmin = createSupabaseAdmin();
    const referralHint = body.creator_referral || null;
    const creator = await findValidCreator(supabaseAdmin, referralHint);
    const hasDiscountCodeIntent = Boolean(
      referralHint?.attribution_source === "discount_code" && referralHint.discount_code,
    );
    const discountAmount = discountAmountForCreator(creator, referralHint);

    if (hasDiscountCodeIntent && discountAmount <= 0) {
      return errorResponse("INVALID_DISCOUNT_CODE", "Discount code was not found or is not active.", 400);
    }

    const price = priceForPackage(body.package, discountAmount);

    let creatorUnitsBefore = 0;
    if (creator) {
      creatorUnitsBefore = await getPaidCreatorUnits(supabaseAdmin, creator.id);
    }

    const creatorUnitsAfter = creatorUnitsBefore + price.quantity_units;
    const commission = creator
      ? calculateCommission(price.paid_amount, price.quantity_units, creatorUnitsBefore)
      : { percentEffective: 0, amount: 0, breakdown: [] };

    const accessToken = await getPayPalAccessToken();
    const paypalOrder = await createPayPalOrder(accessToken, {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: price.sku,
          description: `Owlnest Lume ${body.package} preorder`,
          amount: {
            currency_code: "USD",
            value: price.paid_amount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: price.original_amount.toFixed(2),
              },
              ...(price.discount_amount > 0
                ? {
                    discount: {
                      currency_code: "USD",
                      value: price.discount_amount.toFixed(2),
                    },
                  }
                : {}),
            },
          },
          items: [
            {
              name: body.package === "single" ? "Owlnest Lume Single" : "Owlnest Lume Duo",
              sku: price.sku,
              quantity: "1",
              unit_amount: {
                currency_code: "USD",
                value: price.original_amount.toFixed(2),
              },
            },
          ],
        },
      ],
    });

    if (creator) {
      const { error: insertError } = await supabaseAdmin.from("creator_orders").insert({
        paypal_order_id: paypalOrder.id,
        creator_partner_id: creator.id,
        creator_slug: creator.slug,
        creator_name: creator.display_name,
        discount_code: price.discount_amount > 0 ? creator.discount_code : null,
        sku: price.sku,
        quantity_purchased: price.quantity_purchased,
        quantity_units: price.quantity_units,
        original_amount: price.original_amount,
        discount_amount: price.discount_amount,
        paid_amount: price.paid_amount,
        commission_basis_amount: price.paid_amount,
        creator_units_before: creatorUnitsBefore,
        creator_units_after: creatorUnitsAfter,
        commission_percent_effective: commission.percentEffective,
        commission_amount: commission.amount,
        commission_breakdown: commission.breakdown,
        currency: "USD",
        status: "pending",
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        return errorResponse("SUPABASE_INSERT_ERROR", "Unable to create pending creator order.", 500);
      }
    }

    return jsonResponse({
      paypal_order_id: paypalOrder.id,
      status: "pending",
      package: body.package,
      currency: "USD",
      original_amount: price.original_amount,
      discount_amount: price.discount_amount,
      paid_amount: price.paid_amount,
      creator_order_tracking: Boolean(creator),
      creator: creator
        ? {
            slug: creator.slug,
            display_name: creator.display_name,
            discount_code: creator.discount_code,
          }
        : null,
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN_ERROR";

    if (code === "PAYPAL_CONFIG_MISSING" || code === "SUPABASE_CONFIG_MISSING") {
      return errorResponse("SERVER_CONFIG_ERROR", "Checkout is not configured.", 500);
    }

    if (code === "PAYPAL_TOKEN_ERROR") {
      return errorResponse("PAYPAL_TOKEN_ERROR", "Unable to initialize PayPal checkout.", 502);
    }

    if (code === "PAYPAL_CREATE_ORDER_ERROR") {
      return errorResponse("PAYPAL_CREATE_ORDER_ERROR", "Unable to create PayPal order.", 502);
    }

    if (code === "CREATOR_UNITS_LOOKUP_ERROR") {
      return errorResponse("CREATOR_LOOKUP_ERROR", "Unable to validate creator order history.", 500);
    }

    return errorResponse("SERVER_ERROR", "Unable to create checkout order.", 500);
  }
});
