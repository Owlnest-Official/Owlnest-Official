import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export type PackageKey = "single" | "duo";

export type CreatorReferralHint = {
  slug?: string;
  discount_code?: string;
  attribution_source?: string;
};

export type CreatorPartner = {
  id: string;
  slug: string;
  display_name: string | null;
  discount_code: string | null;
  discount_type: string | null;
  discount_amount: number | string | null;
  discount_currency: string | null;
};

export type CommissionTier = {
  from_unit: number;
  to_unit: number;
  units: number;
  percent: number;
  basis_amount: number;
  commission_amount: number;
};

export type PriceResult = {
  sku: string;
  quantity_purchased: number;
  quantity_units: number;
  original_amount: number;
  discount_amount: number;
  paid_amount: number;
  currency: "USD";
};

export const PACKAGE_PRICES: Record<PackageKey, PriceResult> = {
  single: {
    sku: "lume-single",
    quantity_purchased: 1,
    quantity_units: 1,
    original_amount: 59,
    discount_amount: 0,
    paid_amount: 59,
    currency: "USD",
  },
  duo: {
    sku: "lume-duo",
    quantity_purchased: 1,
    quantity_units: 2,
    original_amount: 100,
    discount_amount: 0,
    paid_amount: 100,
    currency: "USD",
  },
};

export function createSupabaseAdmin() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("SUPABASE_CONFIG_MISSING");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function isPackageKey(value: unknown): value is PackageKey {
  return value === "single" || value === "duo";
}

export function priceForPackage(packageKey: PackageKey, discountAmount: number): PriceResult {
  const base = PACKAGE_PRICES[packageKey];
  const normalizedDiscount = Math.min(Math.max(roundMoney(discountAmount), 0), base.original_amount);
  return {
    ...base,
    discount_amount: normalizedDiscount,
    paid_amount: roundMoney(base.original_amount - normalizedDiscount),
  };
}

export async function findValidCreator(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  hint: CreatorReferralHint | null,
): Promise<CreatorPartner | null> {
  const slug = sanitizeSlug(hint?.slug);
  const code = sanitizeCode(hint?.discount_code);

  if (!slug && !code) return null;

  let query = supabaseAdmin
    .from("creator_partners")
    .select("id,slug,display_name,discount_code,discount_type,discount_amount,discount_currency")
    .eq("active", true)
    .limit(1);

  if (code) {
    query = query.eq("discount_code", code);
  } else if (slug) {
    query = query.eq("slug", slug);
  }

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;

  const creator = data as CreatorPartner;
  if (!isValidCreatorDiscount(creator)) return null;

  return creator;
}

export function discountAmountForCreator(
  creator: CreatorPartner | null,
  hint: CreatorReferralHint | null,
): number {
  if (hint?.attribution_source !== "discount_code") return 0;
  if (!creator || !isValidCreatorDiscount(creator)) return 0;
  return roundMoney(Number(creator.discount_amount));
}

export async function getPaidCreatorUnits(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  creatorId: string,
): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from("creator_orders")
    .select("quantity_units")
    .eq("creator_partner_id", creatorId)
    .eq("status", "paid");

  if (error || !Array.isArray(data)) {
    throw new Error("CREATOR_UNITS_LOOKUP_ERROR");
  }

  return data.reduce((sum, row) => sum + Number(row.quantity_units || 0), 0);
}

export function calculateCommission(
  paidAmount: number,
  quantityUnits: number,
  creatorUnitsBefore: number,
): { percentEffective: number; amount: number; breakdown: CommissionTier[] } {
  if (paidAmount <= 0 || quantityUnits <= 0) {
    return { percentEffective: 0, amount: 0, breakdown: [] };
  }

  const unitValue = paidAmount / quantityUnits;
  let remainingUnits = quantityUnits;
  let cursor = creatorUnitsBefore;
  const breakdown: CommissionTier[] = [];

  while (remainingUnits > 0) {
    const tierLimit = cursor < 100 ? 100 : Number.POSITIVE_INFINITY;
    const availableInTier = tierLimit === Number.POSITIVE_INFINITY ? remainingUnits : tierLimit - cursor;
    const units = Math.min(remainingUnits, availableInTier);
    const percent = cursor < 100 ? 0.1 : 0.15;
    const basisAmount = roundMoney(units * unitValue);
    const commissionAmount = roundMoney(basisAmount * percent);

    breakdown.push({
      from_unit: cursor + 1,
      to_unit: cursor + units,
      units,
      percent,
      basis_amount: basisAmount,
      commission_amount: commissionAmount,
    });

    cursor += units;
    remainingUnits -= units;
  }

  const amount = roundMoney(breakdown.reduce((sum, tier) => sum + tier.commission_amount, 0));
  const percentEffective = paidAmount > 0 ? roundRate(amount / paidAmount) : 0;

  return {
    percentEffective,
    amount,
    breakdown,
  };
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function roundRate(value: number): number {
  return Math.round((value + Number.EPSILON) * 10000) / 10000;
}

function isValidCreatorDiscount(creator: CreatorPartner): boolean {
  const amount = Number(creator.discount_amount);
  return (
    creator.discount_type === "fixed_amount" &&
    creator.discount_currency === "USD" &&
    Number.isFinite(amount) &&
    amount > 0
  );
}

function sanitizeSlug(value: unknown): string {
  const slug = String(value || "").trim().toLowerCase();
  return /^[a-z0-9][a-z0-9_-]{0,63}$/.test(slug) ? slug : "";
}

function sanitizeCode(value: unknown): string {
  const code = String(value || "").trim().toUpperCase();
  return /^[A-Z0-9][A-Z0-9_-]{1,63}$/.test(code) ? code : "";
}
