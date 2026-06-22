(function () {
  const STORAGE_KEY = "owlnest_creator_referral";
  const ATTRIBUTION_DAYS = 30;
  const SUPABASE_URL = "https://khoiplqugajmybmultzs.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_ic3b9TeYt7SuXxLIhLuyvA_FWHYVb0Z";
  const MESSAGE_ID = "creator-referral-message";

  function log(message, detail) {
    if (detail) {
      console.info("[Owlnest referral]", message, detail);
      return;
    }
    console.info("[Owlnest referral]", message);
  }

  function normalizeSlug(value) {
    const slug = String(value || "").trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(slug)) return "";
    return slug;
  }

  function readStoredReferral() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const referral = JSON.parse(raw);
      if (!referral || !referral.expires_at) return null;

      if (Date.now() >= Date.parse(referral.expires_at)) {
        localStorage.removeItem(STORAGE_KEY);
        log("Stored referral expired and was removed.");
        return null;
      }

      return referral;
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
      log("Stored referral was invalid and was removed.");
      return null;
    }
  }

  function saveReferral(creator) {
    const savedAt = new Date();
    const expiresAt = new Date(savedAt.getTime() + ATTRIBUTION_DAYS * 24 * 60 * 60 * 1000);
    const referral = {
      slug: creator.slug,
      display_name: creator.display_name || "",
      discount_code: creator.discount_code || "",
      discount_type: creator.discount_type || "",
      discount_amount: creator.discount_amount ?? null,
      discount_currency: creator.discount_currency || "",
      saved_at: savedAt.toISOString(),
      expires_at: expiresAt.toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(referral));
    return referral;
  }

  function formatDiscount(referral) {
    const amount = Number(referral.discount_amount);
    if (!Number.isFinite(amount) || amount <= 0) return "creator";

    if (referral.discount_type === "percent" || referral.discount_type === "percentage") {
      return `${amount}%`;
    }

    const currency = String(referral.discount_currency || "USD").toUpperCase();
    if (currency === "USD") return `$${amount}`;

    return `${amount} ${currency}`;
  }

  function renderReferralMessage(referral) {
    const target = document.getElementById(MESSAGE_ID);
    if (!target || !referral || !referral.discount_code) return;

    target.textContent = `${referral.discount_code} saved. Your ${formatDiscount(referral)} creator discount is ready for checkout.`;
    target.classList.remove("hidden");
  }

  async function fetchCreator(slug) {
    const params = new URLSearchParams({
      select: "slug,display_name,discount_code,discount_type,discount_amount,discount_currency",
      slug: `eq.${slug}`,
      active: "eq.true",
      limit: "1"
    });

    const response = await fetch(`${SUPABASE_URL}/rest/v1/creator_partners?${params.toString()}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Creator lookup failed with status ${response.status}`);
    }

    const creators = await response.json();
    return Array.isArray(creators) ? creators[0] : null;
  }

  async function initReferral() {
    const storedReferral = readStoredReferral();
    const params = new URLSearchParams(window.location.search);
    const slug = normalizeSlug(params.get("ref"));

    if (!slug) {
      renderReferralMessage(storedReferral);
      return;
    }

    try {
      const creator = await fetchCreator(slug);
      if (!creator) {
        log("No active creator found for ref.");
        renderReferralMessage(storedReferral);
        return;
      }

      const referral = saveReferral(creator);
      renderReferralMessage(referral);
    } catch (error) {
      log("Creator referral lookup skipped.", error.message);
      renderReferralMessage(storedReferral);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReferral, { once: true });
    return;
  }

  initReferral();
})();
