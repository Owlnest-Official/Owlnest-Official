# Lume permanent Single price release — 2026-11-16

## Approved scope

Single regular price: USD 119 → USD 49. Duo remains USD 219. This is not a sale; no compare-at price was introduced. All invalid Duo savings claims removed. Two separately purchased Singles now total USD 98; Duo costs USD 121 more, and its future price needs a separate brand decision.

Source: `Owlnest-Official-gap-20260903`, existing `main`. Baseline/rollback commit: `efba000774145885064d9c0c7c3d4daee0ba54cf`. No branch creation, design changes, new claims, routing changes, server configuration changes, or research activation.

## Shopify evidence — PASS

- Admin product `10424693686588` (Owlnest Lume), sole default Variant `53197831405884`, matched the exact website checkout Variant before editing.
- Admin regular price was USD 119.00, saved as USD 49.00. Public product tool returned USD 49.00, available, and no list/compare-at price.
- Clicked the actual production **Buy Single** button: Shopify checkout showed one Owlnest Lume, Variant `53197831405884`, subtotal USD 49.00.
- Checked Taiwan default and switched delivery country to United States, without entering any contact/address/payment data. US item subtotal remained USD 49.00; shipping requested an address. Final shipping/tax depends on destination and checkout rules.
- Browser Back → **Buy Duo** remained enabled and reached the real Shopify checkout with Owlnest Lume Duo / 2 × Lume, subtotal USD 219.00.
- No payment, order submission, inventory change, discounts, attribution, variant ID, or store configuration changes. Admin price field was the only Shopify mutation.

## Local QA — PASS

- Clean new output build: 633 public source/dependency files, 213,494,169 bytes. Case-sensitive dependency validation passed.
- All published HTML/JS/JSON/TXT scanned: no current standalone 119 price, invalid USD 19 Duo savings, or USD 238 two-Singles claim. Historical docs/previews were not rewritten.
- 40 browser cases: EN/ZH × 320/393/768/1440 × Home, Products, Lume, Evidence, order/shipping policy. USD 49 present, no obsolete savings, no horizontal overflow, no JavaScript page errors.
- Home Single/Duo toggles display USD 49/219 and correct purchase button. Product JSON-LD and original-price data are USD 49; Duo 219 retained.
- Navigation, desktop Products hover, mobile menu, Escape and language switching passed. Hero scroll mapping forward/reverse/stationary and reduced-motion control passed; its controller/assets are unchanged.
- Checkout state tests: 8/8 passed, including browser-return restoration, timeouts, late-response isolation, discount handling and USD 49/219 analytics fallback.
- First desktop automation assertion clicked an already hover-open menu, closing it. Corrected the test to exercise desktop hover; no navigation source change was needed. Re-run passed.
- Desktop/mobile purchase screenshots visually reviewed. No price-related layout regression. No CSS, photos, type system or page composition changed.
- `git diff --check` passed.

## Protected scope

`shopify-checkout.js` changes only `single.amount: 119 → 49`; the request, variant IDs, discount and attribution handling, redirects and return-state logic are identical. Price-sensitive JS URLs were versioned to avoid old browser caches.

Existing `typography.css` SHA-256 remains `353c76368f6dee1750daf45852ce15f718a76fbc5f6be448c1c275a9316ca053`. Existing governance edits and unrelated untracked work are excluded from this commit. `_incoming/` is not staged. No GA/GTM, consent, account, research, image or VPS settings changed.

## Backup and release checks

Guest baseline matched local/origin `efba000774145885064d9c0c7c3d4daee0ba54cf`, clean guest tree, updater Result=success, sufficient free disk, existing web/proxy/API containers running. Scoped checks do not claim completion of the separate VPS security audit.

Backup: `/home/owlnest/release-backups/lume-price-20261116/` (restricted, outside web root): current tracked site archive, service settings archive, rollback SHA, checksums; archives verified readable. Production follows existing five-minute `origin/main` synchronization, no configuration changes required.

## Limitations

- Actual payment/order completion: NOT TESTED, intentionally not performed.
- Valid creator discount redemption: NOT TESTED; mechanism preserved, automated failure/attribution regression passed.
- Real iPhone Safari: NOT TESTED; Chromium viewport simulations used.
- Separate VPS P0 full security audit remains outstanding; this price release does not close it.

## Modified files

- `index.html`, `zh-tw/index.html`
- `products.html`, `products/index.html`, `zh-tw/products/index.html`
- `products/lume/index.html`, `zh-tw/products/lume/index.html`
- `evidence/index.html`, `zh-tw/evidence/index.html`
- `lab/sleep/evidence/index.html`, `zh-tw/lab/sleep/evidence/index.html`
- `preorder-policy.html`, `zh-tw/preorder-policy/index.html`
- `ai-brief.html`, `ai/evidence.html`, `ai/product.json`, `ai/evidence.json`
- `llms.txt`, `llms-full.txt`
- `assets/v7/home-ui.js`, `assets/js/home-v3.js`, `assets/js/shopify-checkout.js`
- `scripts/test-checkout-state.cjs`
- This QA report; evidence and helper scripts remain separate local review artifacts.

Post-push guest SHA, protected-setting hashes and live-content results are recorded separately in `evidence/` so this pre-release QA does not claim an unperformed deployment.
