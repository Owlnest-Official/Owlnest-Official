(function () {
  const STORAGE_KEY = "owlnest_creator_referral";
  const ATTRIBUTION_DAYS = 30;
  const SUPABASE_URL = "https://khoiplqugajmybmultzs.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_ic3b9TeYt7SuXxLIhLuyvA_FWHYVb0Z";
  const CREATE_ORDER_ENDPOINT = `${SUPABASE_URL}/functions/v1/create-paypal-order`;
  const CODE_FORM_ID = "creator-code-form";
  const CODE_INPUT_ID = "creator-code-input";
  const CODE_FEEDBACK_ID = "creator-code-feedback";
  const CHECKOUT_FEEDBACK_ID = "checkout-feedback";
  let activeDiscountReferral = null;

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

  function normalizeCode(value) {
    const code = String(value || "").trim().toUpperCase();
    if (!/^[A-Z0-9][A-Z0-9_-]{1,63}$/.test(code)) return "";
    return code;
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

  function saveReferral(creator, attributionSource) {
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
      expires_at: expiresAt.toISOString(),
      attribution_source: attributionSource
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(referral));
    return referral;
  }

  function renderCodeFeedback(message, isError) {
    const target = document.getElementById(CODE_FEEDBACK_ID);
    if (!target) return;

    target.textContent = message;
    target.classList.toggle("hidden", !message);
    target.classList.toggle("text-red-200", Boolean(isError));
    target.classList.toggle("text-amber/90", !isError);
  }

  function renderCheckoutFeedback(message, isError) {
    const target = document.getElementById(CHECKOUT_FEEDBACK_ID);
    if (!target) return;

    target.textContent = message;
    target.classList.toggle("hidden", !message);
    target.classList.toggle("text-red-200", Boolean(isError));
    target.classList.toggle("text-amber/90", !isError);
  }

  function applyCreatorReferral(referral) {
    if (!isValidFixedDiscount(referral)) {
      return;
    }

    activeDiscountReferral = referral;
    applyCreatorPriceDisplay(referral);
    renderCodeFeedback("", false);
  }

  function applyCreatorPriceDisplay(referral) {
    if (!isValidFixedDiscount(referral)) return;

    const discountAmount = Number(referral.discount_amount);
    const discountLabel = formatMoney(discountAmount, referral.discount_currency);

    document.querySelectorAll("[data-creator-price]").forEach((price) => {
      const originalPrice = Number(price.dataset.originalPrice);
      const discountedPrice = Math.max(originalPrice - discountAmount, 0);
      const current = price.querySelector("[data-price-current]");

      if (!Number.isFinite(originalPrice) || !Number.isFinite(discountedPrice) || !current) return;

      current.innerHTML = `<span class="mr-3 align-middle text-2xl text-white/35 line-through">${formatMoney(originalPrice, "USD")}</span><span>${formatMoney(discountedPrice, "USD")}</span>`;
    });

    document.querySelectorAll("[data-creator-price-note]").forEach((note) => {
      note.textContent = `${discountLabel} off with discount code`;
      note.classList.remove("hidden");
    });
  }

  function isValidFixedDiscount(referral) {
    if (!referral || !referral.discount_code) return false;

    const amount = Number(referral.discount_amount);
    return (
      referral.discount_type === "fixed_amount" &&
      referral.discount_currency === "USD" &&
      Number.isFinite(amount) &&
      amount > 0
    );
  }

  function formatMoney(amount, currency) {
    const rounded = Math.round((Number(amount) + Number.EPSILON) * 100) / 100;
    if (currency === "USD") return `$${Number.isInteger(rounded) ? rounded : rounded.toFixed(2)}`;
    return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(2)} ${currency}`;
  }

  async function fetchCreatorBySlug(slug) {
    const params = new URLSearchParams({
      select: "slug,display_name,discount_code,discount_type,discount_amount,discount_currency",
      slug: `eq.${slug}`,
      active: "eq.true",
      limit: "1"
    });

    return fetchCreator(params);
  }

  async function fetchCreatorByCode(code) {
    const params = new URLSearchParams({
      select: "slug,display_name,discount_code,discount_type,discount_amount,discount_currency",
      discount_code: `eq.${code}`,
      active: "eq.true",
      limit: "1"
    });

    return fetchCreator(params);
  }

  async function fetchCreator(params) {
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

  function pageLocale() {
    return window.location.pathname.startsWith("/zh-tw/") ? "zh-tw" : "en";
  }

  function checkoutLoadingLabel(button) {
    return button.dataset.checkoutLoadingLabel || "Redirecting...";
  }

  function checkoutErrorMessage() {
    return pageLocale() === "zh-tw"
      ? "目前無法前往 PayPal。請稍後再試，或聯絡我們協助處理。"
      : "Unable to start PayPal checkout. Please try again or contact support.";
  }

  function buildCreatorReferralHint() {
    if (
      activeDiscountReferral?.attribution_source === "discount_code" &&
      isValidFixedDiscount(activeDiscountReferral)
    ) {
      return {
        discount_code: activeDiscountReferral.discount_code,
        attribution_source: "discount_code"
      };
    }

    const storedReferral = readStoredReferral();
    if (storedReferral?.attribution_source === "referral_link" && normalizeSlug(storedReferral.slug)) {
      return {
        slug: normalizeSlug(storedReferral.slug),
        attribution_source: "referral_link"
      };
    }

    const urlReferralSlug = normalizeSlug(new URLSearchParams(window.location.search).get("ref"));
    if (urlReferralSlug) {
      return {
        slug: urlReferralSlug,
        attribution_source: "referral_link"
      };
    }

    return null;
  }

  function buildCheckoutRequest(packageKey) {
    const body = {
      package: packageKey,
      client_context: {
        page: "products",
        locale: pageLocale()
      }
    };
    const creatorReferral = buildCreatorReferralHint();
    if (creatorReferral) {
      body.creator_referral = creatorReferral;
    }
    return body;
  }

  function setCheckoutButtonsDisabled(isDisabled) {
    document.querySelectorAll("[data-checkout-package]").forEach((button) => {
      button.disabled = isDisabled;
    });
  }

  function initCheckoutButtons() {
    document.querySelectorAll("[data-checkout-package]").forEach((button) => {
      button.addEventListener("click", async () => {
        const packageKey = button.dataset.checkoutPackage;
        if (packageKey !== "single" && packageKey !== "duo") return;

        const originalText = button.dataset.checkoutLabel || button.textContent.trim();
        button.dataset.checkoutLabel = originalText;
        renderCheckoutFeedback("", false);
        setCheckoutButtonsDisabled(true);
        button.textContent = checkoutLoadingLabel(button);

        try {
          const response = await fetch(CREATE_ORDER_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(buildCheckoutRequest(packageKey))
          });
          const data = await response.json().catch(() => ({}));

          if (!response.ok || !data.approval_url) {
            throw new Error(data?.error?.code || "CREATE_ORDER_FAILED");
          }

          if (typeof window.owlnestTrack === "function") {
            window.owlnestTrack("preorder_checkout_redirect", {
              source_page: pageLocale() === "zh-tw" ? "zh_products" : "products",
              package: packageKey,
              destination: "paypal",
              payment_provider: "paypal",
              currency: data.currency || "USD",
              paid_amount: data.paid_amount,
              discount_amount: data.discount_amount || 0,
              creator_tracking: Boolean(data.creator)
            });
          }

          window.location.href = data.approval_url;
        } catch (error) {
          log("Create PayPal order failed.", error.message);
          renderCheckoutFeedback(checkoutErrorMessage(), true);
          setCheckoutButtonsDisabled(false);
          button.textContent = originalText;
        }
      });
    });
  }

  function initCreatorCodeForm() {
    const form = document.getElementById(CODE_FORM_ID);
    const input = document.getElementById(CODE_INPUT_ID);
    if (!form || !input) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const code = normalizeCode(input.value);

      if (!code) {
        renderCodeFeedback("Code not found. Please check and try again.", true);
        return;
      }

      input.value = code;
      renderCodeFeedback("", false);

      try {
        const creator = await fetchCreatorByCode(code);
        if (!isValidFixedDiscount(creator)) {
          renderCodeFeedback("Code not found. Please check and try again.", true);
          return;
        }

        const referral = saveReferral(creator, "discount_code");
        applyCreatorReferral(referral);
      } catch (error) {
        log("Discount code lookup skipped.", error.message);
        renderCodeFeedback("Code not found. Please check and try again.", true);
      }
    });
  }

  async function initReferral() {
    const storedReferral = readStoredReferral();
    const params = new URLSearchParams(window.location.search);
    const slug = normalizeSlug(params.get("ref"));

    if (!slug) {
      return;
    }

    try {
      const creator = await fetchCreatorBySlug(slug);
      if (!creator) {
        log("No active creator found for ref.");
        return;
      }

      const currentReferral = readStoredReferral();
      if (currentReferral?.attribution_source === "discount_code") {
        return;
      }

      saveReferral(creator, "referral_link");
    } catch (error) {
      log("Creator referral lookup skipped.", error.message);
    }
  }

  function init() {
    initCreatorCodeForm();
    initCheckoutButtons();
    initReferral();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
    return;
  }

  init();
})();
