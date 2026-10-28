# Approved V3 Home — integration QA

2026-10-28, Asia/Taipei. Baseline: `38a1826fdee8725b1e1d1421098a3dd696c8021b` on `main`.

## Scope and release authorization

Publish the final user-approved `art-direction-v3` Home, without a new design round. EN/ZH main content matches the approved preview exactly. Only Home HTML and homepage-specific CSS/JS are changed. Existing metadata, canonical/hreflang, JSON-LD, tracking initialization, consent, shared navigation, progressive sequence player, and Shopify checkout module are retained. Preview routes/labels and review tooling are excluded.

The user explicitly authorized releasing without waiting for the separate VPS security P0. **P0 is incomplete, not a security clearance.** Guest OS/PHP/runtime/patch/log verification still needs authenticated guest access; the existing SSH attempt was denied. Existing P0 evidence remains preserved. No server, DNS, TLS, proxy, container, account, or security settings are changed by this release.

## Protected files

- Products, About, Lab, Science, Evidence, Campaign, authentication, forms, tracking, consent and checkout code are unchanged.
- Original 96 PNGs and all 288 responsive WebPs are unchanged. No new media or encoding is introduced.
- `assets/css/typography.css` remains untouched and excluded. Working-copy SHA-256: `353c76368f6dee1750daf45852ce15f718a76fbc5f6be448c1c275a9316ca053`.
- The unrelated design-system diff and untracked historical imagery/previews are excluded.

## Pre-deployment checks

| Check | Observed result |
| --- | --- |
| Chromium EN/ZH 320, 393, 768, 1024, 1440, 1920 | All 12 cases pass. Actual navigation, touch disclosures, language switching, selection state, consent entry and layout checked. |
| WebKit EN/ZH 320 touch and 1440 | All four cases pass. Windows emulation, not physical Safari devices. |
| Firefox EN/ZH 320 and 1440 | All four cases pass after repairing the isolated browser installation. |
| Navigation | Products/Lab main links and disclosure controls work independently; hover, touch, keyboard ArrowDown/Escape and return navigation tested. Home, About, Program, Account, Buy Lume and all ten footer destinations additionally clicked in EN/ZH at 393/1440. |
| Animation | Full 1–96 playback, stable pause, resume and replay tested across Chromium/WebKit/Firefox; reduced-motion and no-JavaScript first-frame fallback verified. No original sequence PNG requests. |
| Commerce | EN/ZH mobile: Single → real Shopify checkout (US$119) → Back → Duo → real Shopify checkout (US$219) → Back. Buttons remain enabled. No payment, personal information or order submission. Existing seven checkout-state tests pass. |
| Policy | Live Shopify shipping/refund policies checked: US 7–10 business days after carrier dispatch, excluding processing/customs/holidays/other delays; shipping charge before payment; eligible return requests within 30 days, subject to terms. No free-shipping or guaranteed-arrival claim added. |
| Visual integrity | Actual full-page and viewport screenshots inspected, including mobile Hero and purchase, tablet Hero and desktop full Home. Approved five chapters retained; no observed clipping, overlap or horizontal overflow. |
| Errors | No homepage runtime exceptions. One Firefox image warning occurred during rapid Products → Back; the same unchanged product WebP decoded successfully at 960×1440 in a separate Firefox check. No evidence of an image-file defect; navigation cancellation is a possible cause, not a proven diagnosis. |
| Static checks | Approved main content, production tracking and JSON-LD parity; exact-case resource paths; no internal-preview labels; protected files unchanged; `git diff --check`. |

## Local performance (not production)

Lighthouse 13.5.0, Chrome 156 headless on Windows. 393×852, DPR 1, simulated RTT 150ms / throughput 1,638.4Kbps / CPU 4×. Fresh browser per run; three runs per language, not concurrent with browser QA. Production-only GTM hostname gating means localhost does not represent full live tracking/network overhead.

| Locale | Three LCP runs | Median LCP | Median CLS | Median TBT |
| --- | --- | ---: | ---: | ---: |
| EN | 2.139 / 2.230 / 2.167s | 2.167s | 0.000484 | 141ms |
| ZH | 1.963 / 2.114 / 1.965s | 1.965s | 0.000130 | 2ms |

These are laboratory results, not field p75 or live-site performance. Post-release HTTPS measurements must be reported separately.

## Loading strategy and release verification

Unchanged player: responsive 480/800/1280 WebP first-frame preload, HTML poster, delayed autoplay after load + 2.2s, maximum two image requests in flight, eight-frame look-ahead, released old decoded frames, offscreen/background pause and reduced-motion/save-data/low-memory fallback. Full selected sequence is approximately 1.21 / 2.59 / 4.61 MB, not the original ~77 MB PNG payload.

Evidence is retained locally under `C:/Users/s9714/AppData/Local/Temp/owlnest-v3-release-qa/`: static parity, browser regression, supplement, checkout, screenshots and raw Lighthouse reports. Existing final visual approval artifacts are preserved.

Release procedure: stage only the two Home HTML files, `assets/css/home-v3.css`, `assets/js/home-v3.js` and this report; commit on main and push origin/main. Existing VPS synchronization can deploy within five minutes. Verify served EN/ZH HTML and changed assets against the committed Git blobs, then live rendering, animation, navigation, checkout return and mobile performance. A push alone is not proof of deployment. Direct guest Git SHA cannot be asserted without guest access; distinguish served-file identity from guest-shell verification.

Rollback is a scoped revert of this release commit on main, followed by the existing synchronization and live verification, if a release regression requires it. No reset, infrastructure change or automatic rollback is performed here.
