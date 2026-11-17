# Lume permanent Duo price release — 2026-11-16

## Scope and baseline

Duo normal price USD 219 → USD 89. Single stays USD 49. Two Singles cost USD 98; Duo saves USD 9 and averages USD 44.50 per lamp. No sale deadline or compare-at price introduced.

Production source: `Owlnest-Official-gap-20260903`, existing `main`. Baseline/rollback: `e89b1c21ab8a354c7176737421ad55426977e564`, confirmed on local main, origin/main and VPS before release. The other checkout was not used for edits.

## Shopify — PASS

- Exact Duo product `10426808435004`, sole default Variant `53218207236412`, verified against the website checkout configuration and Shopify's two-Lume bundle.
- Shopify Admin and public product data confirmed original normal price USD 219.00. Changed only the Duo regular-price field to USD 89.00, saved successfully. Fresh public product data returned USD 89.00, available, no list/compare-at price.
- Single Variant `53197831405884` was not modified and remains USD 49.00.
- Actual production **Buy Single** → Shopify checkout: one Owlnest Lume, item subtotal USD 49.00.
- Browser Back restored both purchase buttons. **Buy Duo** → Shopify checkout: Owlnest Lume Duo, contents 2 × Owlnest Lume, item subtotal USD 89.00.
- No contact/address/payment details entered, no payment or order submitted. Default checkout delivery region was Taiwan. Final shipping/tax remains determined by destination and existing checkout rules; no new shipping/tax promise added.
- No variant IDs, bundle contents, inventory, discounts, attribution, store settings or payment configuration changed.

## Source and build — PASS

- Clean new build directory: `C:/Users/s9714/AppData/Local/Temp/owlnest-price49-89-20261116`.
- 633 public source/dependency files, 213,494,809 bytes. Existing case-sensitive dependency validation passed.
- Published HTML/JS/JSON/TXT scanned: no remaining standalone 219 references, obsolete Single 119 price or USD 19 savings. Historical documentation/previews were intentionally preserved.
- AI/public pricing JSON: Single 49, Duo 89, two Singles 98, Duo per lamp 44.5, savings 9.
- `shopify-checkout.js` differs from baseline only in `duo.amount: 219 → 89`; Single amount, exact variant IDs, request/return/error/discount/attribution logic are unchanged.
- Price-sensitive script URLs updated to `20261116-price49-89` on Home and Lume detail pages to avoid stale price-display JavaScript.
- Checkout regression: 8/8 tests passed, including Single/Duo return restoration, stalled requests, late-response isolation, BFCache, discount-error handling and 49/89 analytics fallback.
- `git diff --check` passed.

## Local browser and visual QA — PASS

40 cases: EN/ZH-TW × 320/393/768/1440px × Home, Products, Lume, Evidence and order/shipping policy. Chromium viewport simulation on the clean build, third-party analytics/API requests blocked to avoid pollution. Actual external checkout verification above was separate.

- Single USD 49 throughout; Duo USD 89 on all affected purchase/product/policy pages.
- Home, Lume and policy savings text: USD 9 and USD 44.50 per lamp.
- Home Single/Duo selector status and corresponding purchase-button visibility correct.
- Lume JSON-LD and creator original-price attributes contain USD 49/89, no 119/219.
- Five-item navigation, Products desktop hover/mobile expansion, Escape and language switching passed.
- Hero forward/reverse/stationary scroll mapping and reduced-motion control passed. Its 96-frame assets/controller were not edited.
- No horizontal overflow or page JavaScript errors in the tested matrix.
- Original-size EN/ZH mobile/desktop purchase screenshots retained in `evidence/`; reviewed price hierarchy, savings wrapping and purchase controls. No CSS, photography, layout or typography edits were necessary.

## Protected files and systems

All protected hashes match the preceding release's captured working-tree hashes. Existing typography SHA-256 remains `353c76368f6dee1750daf45852ce15f718a76fbc5f6be448c1c275a9316ca053`. Governance edits, old review artifacts and unrelated untracked work remain untouched and unstaged. `_incoming/` is excluded.

No GA/GTM, consent, account/auth, research activation, navigation, image, server configuration or discount/creator logic changes.

## Backup and release checks

Restricted backup outside the web root: `/home/owlnest/release-backups/lume-duo-price-20261116/`. Contains rollback SHA, tracked site archive, service-settings archive and checksums; both archives verified readable.

Pre-release guest worktree clean; updater result success; existing web/proxy/API containers running. Docker/Caddy/Nginx/updater setting hashes unchanged. Use existing five-minute main synchronization; no new deployment mechanism or configuration changes.

If a major release issue appears, restore the recorded site baseline through the existing rollback procedure. Shopify price is a separate state: do not claim Git rollback changes it; maintain price consistency before serving a rollback that displays USD 219.

Post-push SHA/live-content/production-browser results are recorded separately in `evidence/`, not claimed as completed in this pre-release report.

## Limitations / non-blocking follow-ups

- Actual payment/order creation: NOT TESTED, intentionally excluded.
- Valid creator-code redemption: NOT TESTED; existing mechanism preserved and failure/attribution unit coverage passed.
- Real iPhone Safari/Firefox: NOT TESTED; Chromium viewport simulation only.
- Separate full VPS P0 security audit remains outstanding. Scoped healthy-service/configuration checks do not certify absence of compromise or close that audit.

## Changed files

- `index.html`, `zh-tw/index.html`
- `products.html`, `products/index.html`, `zh-tw/products/index.html`
- `products/lume/index.html`, `zh-tw/products/lume/index.html`
- `preorder-policy.html`, `zh-tw/preorder-policy/index.html`
- `ai-brief.html`, `ai/evidence.html`, `ai/product.json`, `ai/evidence.json`
- `llms.txt`, `llms-full.txt`
- `assets/v7/home-ui.js`, `assets/js/home-v3.js`, `assets/js/shopify-checkout.js`
- `scripts/test-checkout-state.cjs`
- This QA report. Local evidence/helper scripts remain separate review artifacts.
