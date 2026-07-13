(function () {
  const STOREFRONT_ENDPOINT = "https://wfqwyu-ic.myshopify.com/api/2026-04/graphql.json";
  const STOREFRONT_ACCESS_TOKEN = "a5908ba677610f83178568fc8bf25de7";
  const REFERRAL_STORAGE_KEY = "owlnest_creator_referral";
  const CHECKOUT_FEEDBACK_ID = "checkout-feedback";

  const PACKAGES = {
    single: {
      merchandiseId: "gid://shopify/ProductVariant/53197831405884",
      amount: 59
    },
    duo: {
      merchandiseId: "gid://shopify/ProductVariant/53218207236412",
      amount: 100
    }
  };

  const CREATE_CART_MUTATION = `
    mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          checkoutUrl
          discountCodes {
            code
            applicable
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
        warnings {
          message
        }
      }
    }
  `;

  function pageLocale() {
    return window.location.pathname.startsWith("/zh-tw/") ? "zh-tw" : "en";
  }

  function normalizeSlug(value) {
    const slug = String(value || "").trim().toLowerCase();
    return /^[a-z0-9][a-z0-9_-]{0,63}$/.test(slug) ? slug : "";
  }

  function normalizeDiscountCode(value) {
    const code = String(value || "").trim().toUpperCase();
    return /^[A-Z0-9][A-Z0-9_-]{1,63}$/.test(code) ? code : "";
  }

  function readStoredReferral() {
    try {
      const raw = localStorage.getItem(REFERRAL_STORAGE_KEY);
      if (!raw) return null;

      const referral = JSON.parse(raw);
      if (!referral?.expires_at || Date.now() >= Date.parse(referral.expires_at)) {
        return null;
      }

      return referral;
    } catch (error) {
      return null;
    }
  }

  function readCheckoutReferral() {
    const storedReferral = readStoredReferral();
    if (storedReferral?.attribution_source === "discount_code") {
      const discountCode = normalizeDiscountCode(storedReferral.discount_code);
      const discountAmount = Number(storedReferral.discount_amount);
      if (
        discountCode &&
        storedReferral.discount_type === "fixed_amount" &&
        storedReferral.discount_currency === "USD" &&
        Number.isFinite(discountAmount) &&
        discountAmount > 0
      ) {
        return {
          attributionSource: "discount_code",
          discountCode,
          slug: String(storedReferral.slug || "")
        };
      }
    }

    const urlSlug = normalizeSlug(new URLSearchParams(window.location.search).get("ref"));
    if (urlSlug) {
      return { attributionSource: "referral_link", discountCode: "", slug: urlSlug };
    }

    const storedSlug = storedReferral?.attribution_source === "referral_link"
      ? normalizeSlug(storedReferral.slug)
      : "";
    return storedSlug
      ? { attributionSource: "referral_link", discountCode: "", slug: storedSlug }
      : null;
  }

  function checkoutAttributes(packageKey, referral) {
    const locale = pageLocale();
    const attributes = [
      { key: "owlnest_source", value: locale === "zh-tw" ? "zh-tw/products" : "products" },
      { key: "owlnest_package", value: packageKey },
      { key: "owlnest_locale", value: locale }
    ];
    if (referral?.slug) {
      attributes.push({ key: "creator_ref", value: referral.slug });
    }
    if (referral?.discountCode) {
      attributes.push({ key: "creator_discount_code", value: referral.discountCode });
    }

    return attributes;
  }

  function renderCheckoutFeedback(message, isError) {
    const target = document.getElementById(CHECKOUT_FEEDBACK_ID);
    if (!target) return;

    target.textContent = message;
    target.classList.toggle("hidden", !message);
    target.classList.toggle("text-red-200", Boolean(isError));
    target.classList.toggle("text-amber/90", !isError);
  }

  function checkoutErrorMessage() {
    return pageLocale() === "zh-tw"
      ? "目前無法開啟安全結帳。請稍後再試，或聯絡我們協助處理。"
      : "Unable to open secure checkout. Please try again or contact us for help.";
  }

  function discountErrorMessage() {
    return pageLocale() === "zh-tw"
      ? "這組折扣碼目前無法套用至結帳，請重新確認或聯絡我們協助處理。"
      : "This discount code cannot be applied at checkout. Please check it or contact us for help.";
  }

  function localizedCheckoutUrl(checkoutUrl) {
    if (pageLocale() !== "zh-tw") return checkoutUrl;

    const localizedUrl = new URL(checkoutUrl);
    localizedUrl.searchParams.set("locale", "zh-TW");
    return localizedUrl.toString();
  }

  function setCheckoutButtonsDisabled(isDisabled) {
    document.querySelectorAll("[data-shopify-checkout-package]").forEach((button) => {
      button.disabled = isDisabled;
    });
  }

  async function createCart(packageKey) {
    const selectedPackage = PACKAGES[packageKey];
    if (!selectedPackage) throw new Error("INVALID_PACKAGE");
    const referral = readCheckoutReferral();
    const input = {
      lines: [
        {
          merchandiseId: selectedPackage.merchandiseId,
          quantity: 1
        }
      ],
      attributes: checkoutAttributes(packageKey, referral)
    };

    if (referral?.discountCode) {
      input.discountCodes = [referral.discountCode];
    }

    const response = await fetch(STOREFRONT_ENDPOINT, {
      method: "POST",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN
      },
      body: JSON.stringify({
        query: CREATE_CART_MUTATION,
        variables: {
          input
        }
      })
    });

    const payload = await response.json().catch(() => ({}));
    const result = payload?.data?.cartCreate;

    if (
      !response.ok ||
      payload?.errors?.length ||
      result?.userErrors?.length ||
      !result?.cart?.checkoutUrl
    ) {
      throw new Error(result?.userErrors?.[0]?.message || payload?.errors?.[0]?.message || "CART_CREATE_FAILED");
    }

    if (
      referral?.discountCode &&
      !result.cart.discountCodes?.some((discount) =>
        discount.applicable && normalizeDiscountCode(discount.code) === referral.discountCode
      )
    ) {
      throw new Error("DISCOUNT_NOT_APPLICABLE");
    }

    return result.cart;
  }

  function trackCheckout(packageKey, cart) {
    if (typeof window.owlnestTrack !== "function") return;

    const selectedPackage = PACKAGES[packageKey];
    window.owlnestTrack("preorder_checkout_redirect", {
      source_page: pageLocale() === "zh-tw" ? "zh_products" : "products",
      package: packageKey,
      destination: "shopify_checkout",
      payment_provider: "shopify",
      currency: cart?.cost?.totalAmount?.currencyCode || "USD",
      product_amount: Number(cart?.cost?.totalAmount?.amount || selectedPackage.amount),
      creator_tracking: Boolean(readCheckoutReferral())
    });
  }

  function initCheckoutButtons() {
    document.querySelectorAll("[data-shopify-checkout-package]").forEach((button) => {
      button.addEventListener("click", async () => {
        const packageKey = button.dataset.shopifyCheckoutPackage;
        if (!PACKAGES[packageKey]) return;

        const originalText = button.dataset.checkoutLabel || button.textContent.trim();
        const loadingText = button.dataset.checkoutLoadingLabel || "Opening secure checkout...";
        renderCheckoutFeedback("", false);
        setCheckoutButtonsDisabled(true);
        button.textContent = loadingText;

        try {
          const cart = await createCart(packageKey);
          trackCheckout(packageKey, cart);
          window.location.assign(localizedCheckoutUrl(cart.checkoutUrl));
        } catch (error) {
          console.error("[Owlnest Shopify checkout]", error.message);
          renderCheckoutFeedback(
            error.message === "DISCOUNT_NOT_APPLICABLE" ? discountErrorMessage() : checkoutErrorMessage(),
            true
          );
          setCheckoutButtonsDisabled(false);
          button.textContent = originalText;
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCheckoutButtons, { once: true });
    return;
  }

  initCheckoutButtons();
})();
