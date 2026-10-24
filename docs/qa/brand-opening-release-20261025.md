# Approved Brand Opening — release QA

2026-10-25 (Asia/Taipei). Integration baseline: `00b14c34cfe4323c3963d876e1a752a0fc68e43d`.
Scope: publish the user-approved Brand Opening candidate, not a new design round.

## Selective integration

- Only EN/ZH Home HTML is merged. The approved five chapters, copy and composition are retained, with production asset URLs and existing canonical/hreflang/indexability.
- Homepage-only owl, wordmark, footer identity and favicon assets are copied from the approved candidate. Existing global logo assets remain available to other pages.
- Existing header/menu scripts, touch navigation fix, footer links, consent, tracking and checkout scripts are unchanged. Products EN/ZH and the checkout return fix are byte-equivalent to the baseline after newline normalization.
- Internal review routes, noindex markers, experiment query parameters, review hub, scripts and source-reference JPEGs are not published.
- Original 96 PNGs remain untouched. All 288 responsive WebPs are byte-identical copies of the approved candidate; no re-encoding or frame sampling.
- `assets/css/typography.css` is untouched and excluded from the commit. SHA-256: `353c76368f6dee1750daf45852ce15f718a76fbc5f6be448c1c275a9316ca053`. The unrelated design-system diff and imagery-review directory also remain unstaged.

## Loading and maintenance

- First frame is an HTML picture with responsive preload/high priority and reserved 16:9 space. Only one selected first frame is fetched initially.
- Autoplay begins after load + 2.2 seconds. Two image requests maximum in flight; eight-frame look-ahead; older decoded frames released. The canvas is allocated at the first animated draw.
- Full 96-frame sequence: 480px **1,207,970 bytes**, 800px **2,591,004 bytes**, 1280px **4,614,110 bytes**. First frames: 11,054 / 20,742 / 35,750 bytes. No 77MB PNG download.
- Pause, replay, offscreen/background pause, reduced-motion/save-data/low-memory static fallback and failed-frame retry are retained. Canvas cannot intercept pointer events.
- Homepage CSS bundles preserve the exact approved EN/ZH cascade. Rebuild with `node scripts/build-home-opening-styles.cjs` when a bundled source changes. Other pages still use their original stylesheets.
- Chinese font subsets retain the approved family and weight coverage; OFL licenses accompany the files. Future copy changes require checking glyph coverage, not silently substituting a different font.

## Pre-release regression

| Check | Result |
| --- | --- |
| EN/ZH visuals, 320 / 393 / 768 / 1024 / 1440 / 1920 | 12 full-page/hero/product screenshot sets; manually inspected key views; no overflow, broken image or visible clipping. Primary mobile copy is 16px. |
| Approved-candidate comparison | Main HTML matches exactly after asset-path relocation. Full screenshots have identical dimensions; all EN/ZH 393px and 1440px full screenshots match pixel-for-pixel. |
| Chromium navigation | EN/ZH at all six widths, 12 cases × 25 steps pass; real destination navigation, not HTTP-only checks. |
| WebKit navigation | EN/ZH at 320 / 768 / 1024, six cases × 25 steps pass. Touch, disclosures, main links, keyboard, language, Account, purchase and footer destinations verified. |
| Animation | Chromium ZH 393 / EN 1440 and WebKit EN 320 / ZH 1024: all frames 1–96, pause, resume, offscreen pause, end and replay pass. Chromium static/failure fallbacks pass. |
| Navigation during playback | Chromium/WebKit EN 320 and ZH 1024: while frames advance, Products/Lab disclosures and Lab → Back → Products remain touch-operable. No original PNG requests or runtime errors. |
| Commerce | Chromium 393 and WebKit 1024, EN/ZH: Home → Products #buy → Single → Shopify → Back → Duo → Shopify. Chrome reports BFCache restoration. No payment, login or form submission. |
| Checkout state tests | Existing seven automated tests pass, including failure, cancellation, timeout, BFCache and discount-error recovery. |
| Console / accessibility | No page runtime errors in the final local visual/navigation/commerce runs. Four scoped Axe scans at 393/1440 EN/ZH: zero violations; not a WCAG certification. |
| Integrity | Exact-case resource references checked; existing inline tracking/consent/navigation scripts and SEO fields preserved; JSON-LD parses; public logo reference updated only on Home. |

One initial WebKit animation run failed an immediate frame-equality assertion following a mouse click. Three isolated click/tap event traces successfully paused; the final touch test waits for the actual paused state before recording its frame and passes. No forced clicks, website navigation changes or hidden retries were used. This is not a claim that every historical intermittent WebKit timeout has been uniquely explained. All Safari/WebKit results are Windows simulation, not real iPhone/iPad hardware.

## Mobile performance

Lighthouse 13.5.0, Chrome 154 headless; 393×852, DPR 1; fresh profile per run; simulated RTT 150ms, 1,638.4Kbps, CPU 4×. Three runs per language, median reported. Performance runs were not concurrent with browser QA.

| Measurement | EN LCP | ZH LCP | EN/ZH median CLS | EN/ZH TBT |
| --- | ---: | ---: | ---: | ---: |
| Approved isolated candidate, earlier local evidence | 2.116s | 2.565s | 0 / 0 | 0 / 74ms |
| Integrated Home on local server, this release | **2.113s** | **2.540s** | **0 / 0** | 0 / 57ms |
| Existing production before release, same test configuration | 6.276s | 7.074s | 0 / 0 | 280 / 350ms |

Local runs: EN 1.964 / 2.115 / 2.113s; ZH 2.528 / 2.563 / 2.540s. The small ZH target overage is recorded and falls within the user's explicitly accepted candidate boundary. No design changes were made to chase it.

The production baseline is a separate HTTPS/network measurement, not interchangeable with localhost or the historical ~4.9s result. Its EN representative trace shows roughly 3.02s navigation-to-first-byte including connection setup, then a stylesheet/font critical path. No DNS, TLS, proxy, server or tracking configuration has been changed. Post-push measurements must be reported separately and cannot be inferred from these local values.

## Evidence and release gate

Full screenshots, videos, interaction traces, raw Lighthouse reports and content hashes are retained locally in `C:/Users/s9714/AppData/Local/Temp/owlnest-browser-qa/release-brand-opening-20261025/`. The original approved preview and review ZIP are preserved.

Before push, review and stage only the named Home sources, new approved assets, bundle builder and this QA record. After the existing VPS synchronization, compare HTTPS-served HTML, new assets, navigation and checkout scripts against the release, then verify actual EN/ZH rendering, playback, navigation and checkout-return flow. A successful push alone is not deployment evidence.

Sequence rights were confirmed by the brand; there is no repeated authorization gate. The supplied logo is used under the user's approval, not presented as an independently verified trademark registration. Missing original lifestyle/operation/macro photography remains a future production task, not fabricated evidence or a blocker for this approved design.
