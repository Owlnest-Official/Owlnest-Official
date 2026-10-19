# OWLNEST V2.1 — targeted repair QA

2026-10-19 · baseline `6d30df142650470f8e5e6aa90c484666c1c73b95`

[Before / after screenshots](index.html)

## Scope and result

- **Checkout return fixed:** the production baseline reproduced Single → Shopify → Back with both buttons disabled and the Single loading label retained, in EN and ZH. The repaired page completed Single → real Shopify → BFCache Back → Duo → real Shopify at 390px and 1440px in both languages. `pageshow.persisted` was true. No payment, customer details, order or discount redemption was submitted.
- **State recovery:** pagehide/persisted pageshow restore both labels and enabled states. Cart requests have a 20-second bound; cancelled/failed navigation has a 10-second recovery bound. Stale responses cannot redirect a new attempt. There is no automatic checkout retry. Seven dependency-free tests cover return, request/GraphQL failure, timeout, interruption, duplicate clicks, stale responses and discount-error preservation.
- **Purchase presentation:** removed the redundant Sheet 08 / End of issue / oversized folio; aligned the purchase surface, type, buttons and spacing with V2. Increased spec readability and removed the baseline decorative contrast violation. Discount entry stays visible, with unchanged form markup and handlers. Existing shipping/returns policy destinations remain; localized Contact is added alongside them.
- **Delivery optimization only:** Home, About and Lab content/layout are unchanged. English uses the same Manrope and Playfair Display fonts served locally; Chinese keeps its existing families with nonblocking font CSS and a noscript fallback. The existing six navigation glyphs replace the full Font Awesome download on these eight pages. No product photo recompression, new crop, Hero redesign or frame/engine change.

## Mobile performance: improved, not fully resolved

Chrome 154.0.8037.100, Lighthouse simulated mobile throttling, 390 × 844, fresh Chrome profiles, compressed local static HTTP. Three runs per page and phase; medians below. External resource conditions can still vary. These are **lab results, not real-user p75 Core Web Vitals**. TBT is not INP.

| English page | LCP before → after | Change | FCP before → after | Performance score | CLS after |
|---|---:|---:|---:|---:|---:|
| Home | 6.349s → 4.913s | 22.6% lower | 3.419s → 1.536s | 70 → 82 | 0 |
| Products | 5.293s → 4.918s | 7.1% lower | 3.352s → 1.532s | 73 → 82 | 0 |

Final TBT was 0ms in all six runs. Transfer fell from approximately 2.13MB to 1.96MB on Home and 1.25MB to 1.08MB on Products. The full icon font (~150KB) becomes a 1,080-byte subset plus a small local stylesheet. The LCP element was the Home heading / Products Hero image, not a missing or distorted photograph; the external blocking font/icon chain delayed first paint.

**The 2.5s mobile lab LCP target remains unmet.** The preserved Hero initial frames, shared assets/CSS and network scheduling remain follow-up opportunities. A frame-scheduling experiment worsened performance and was reverted before release. Do not describe this patch as a completed performance optimization or field-CWV pass. Chinese font/network field performance and real-user INP have not been quantified by these English-page lab samples.

## QA gates

| Check | Evidence / result |
|---|---|
| Browser matrix | Home/About/Products/Lab EN/ZH at 390 × 844 and 1440 × 900: 16 cases, HTTP 200, no page/console errors, failed resources, broken content images or horizontal overflow |
| Purchase widths | EN/ZH at 320, 390, 768 and 1440px: 8 cases; visible prices/options, usable form, invalid-code feedback, keyboard focus, no overflow or axe findings in buy area |
| Navigation / language | Tab/Enter/Escape, desktop hover/outside dismissal, mobile expansion, footer accordion, language and purchase routes checked |
| Motion | Normal Hero frame changes and reduced-motion static behavior verified; all 96 original frames retained |
| Visual review | Before/after first screens and full pages inspected: no new clipping, image distortion, overlap or blocking layout issue. About/Lab are regression checks, not a redesign |
| Accessibility | Axe WCAG A/AA rule scan on all eight pages at 390px: zero reported violations; not a certification of complete WCAG conformance |
| Static | Eight HTML documents, JSON-LD, inline JS, 422 exact-case local references and 36 responsive asset references pass |
| Checkout tests | `node --test scripts/test-checkout-state.cjs`: 7/7; `node --check assets/js/shopify-checkout.js` passes |
| Build | Static repository has no package.json build/lint/typecheck commands; relevant parsers and browser checks used instead |

64 screenshot copies preserve EN/ZH before/after first screens and full pages at 390/1440px. Originals are actual Chrome PNGs; gallery WebPs are quality 88. Full-page Home captures flatten a sticky scroll range; the animation was separately exercised. Element-only tall purchase captures can contain the fixed header at the capture scroll position, so viewport/full-page evidence was used for overlap review.

## Protected-system review

Compared against baseline: prices US$119/US$219, variant IDs, cart mutation/input attributes, quantity, discount/referral functions and tracking calls unchanged. Only the authorized checkout frontend lifecycle changes. Product discount form and commerce data hooks are byte-equivalent after line-ending normalization. Header/footer markup, other executable scripts, consent, tracking, SEO/canonical/hreflang/JSON-LD, campaign/application settings, account/auth, backend functions and infrastructure are unchanged. Home/About/Lab main content and Hero inline code are unchanged.

The pre-existing `assets/css/typography.css` remains unstaged and byte-identical to its starting hash: `353c76368f6dee1750daf45852ce15f718a76fbc5f6be448c1c275a9316ca053`.

## Photography / information still needed

- Controlled macro pair of the actual soft silicone and wood base: neutral backdrop, soft side light, consistent scale/color, detail without retouching product shape.
- Actual bottom-button and USB-C detail shoot with the same lighting; current Manual photos stay in their assigned family rather than being duplicated into Products.
- Accurate height/footprint scale image and a clean flat lay of the actual package contents. Verify dimensions and contents before placing measurements or labels.
- No invented battery runtime, charge time, shipping rate, delivery date, warranty promise or scientific measurement was added. Existing verified usage, size references and policy links remain authoritative.

## Font provenance / reproduction

Existing font designs are retained. Local Latin WOFF2 files came from Google Fonts Manrope v20 and Playfair Display v40; full SIL OFL notices are in `assets/fonts/`. Navigation icons are the existing Font Awesome Free 6.4.0 Solid glyphs U+F007, F00D, F078, F0AC, F0C9, F35D. FontTools subset generation preserves those glyphs and renames family/PostScript names to **Owlnest Navigation Icons** / **OwlnestNavigationIcons-Solid**, respecting the reserved upstream name. The full Font Awesome license is included. No production dependency was added.

References: [Manrope license](https://github.com/google/fonts/blob/main/ofl/manrope/OFL.txt), [Playfair Display license](https://github.com/google/fonts/blob/main/ofl/playfairdisplay/OFL.txt), [Font Awesome 6.4 license](https://github.com/FortAwesome/Font-Awesome/blob/6.4.0/LICENSE.txt), [BFCache lifecycle](https://web.dev/articles/bfcache), [pageshow](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event).

## Release gate

Local functionality/visual/protected-system gates pass; the remaining mobile performance target is explicitly recorded above. Production deployment is not inferred from these results: after pushing main, verify the existing VPS synchronization SHA/service result, exact production HTML/assets and real-browser checkout-return flow. No infrastructure change is part of this release.
