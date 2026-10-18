# OWLNEST V2 — Release-candidate QA

2026-10-18 · baseline `557ae71277a7f359701bcd4f9e933d5782cf1b25`

[Before / after gallery](index.html) · [Design system and photography brief](../../OWLNEST_V2_DESIGN_SYSTEM.md)

## Scope and visual evidence

Home, About, Products and Lab, EN/ZH: eight documents plus one opt-in stylesheet. The original photography remains in place; 18 responsive derivatives are added without cropping or altering product appearance. No new runtime JavaScript.

- Before: actual production Chrome captures at 390 × 844 and 1440 × 900, before the release push.
- After: local Chrome 154.0.8037.100, using Playwright, at 320 × 740, 390 × 844, 430 × 932, 768 × 1024, 1440 × 900 and 1920 × 1080. All 48 page/viewport cases captured and checked. Final Home/Lab and narrow About retests replace the earlier cases in `browser-results.json`.
- The gallery preserves 64 first-screen/full-page captures: eight pages × two representative widths × two phases × two capture types. The four final Products full-page captures were refreshed on production at the identical release content, with all lazy images decoded before capture. Full-resolution PNG originals and the other test widths were retained in the local QA workspace; gallery copies are WebP quality 88.
- Full-page captures flatten the sticky Home Hero into one scroll position, leaving its scroll range as a dark band. Live scrolling and changing canvas frames were tested separately. This band is not a new empty content section.

### Art-direction review

| Page | Structural change | Visual review / remaining constraint |
|---|---|---|
| Home | Offset Hero text/actions; product moved ahead of principles; unequal two-photo spread; stepped states; compact research index | Clear brand and product paths. Mobile photo ordering/insets are independent of desktop. Original sky sequence remains; a commissioned environmental shoot would give the brand a more proprietary photographic voice. |
| About | Archive incorporated into two different story spreads; philosophy interlude; offset ambition | Both historical disclaimers remain. Actual Phu Quoc origin retained without invented documentary photographs. |
| Products | Image-first desktop opening; mobile title/photo/value/price/action; close-up/specs joined; separate scale/package compositions | Product silhouette and base remain intact. Size/package source images still have utilitarian documentation backgrounds; a new controlled shoot is needed for fully consistent campaign photography. |
| Lab | Journal masthead; unboxed questions with feedback margin; distinct Program feature | No photos, fake plots, data, results or identical card wall. Future directions remain explicitly future, not active Labs. |

Removed repeated folios, duplicate Home logo, equal-weight photo panels, numbered question containers and separate feedback blocks. New narrow-screen corrections address Home CTA wrapping, Chinese display type, Lab list scale and About's single-word heading line. No assertion that subjective aesthetics have been objectively certified as “luxury.”

## Functional and engineering checks

| Check | Result |
|---|---|
| 48 page/viewport loads | HTTP 200; no page/console errors, failed resources, broken content images or horizontal overflow |
| Visual inspection | First screens, complete pages and detail captures inspected for hierarchy, wrapping, image shape, spacing and overlap; no blocking defect found |
| Home / purchase path | Shop Lume reaches the existing localized Products page; Products CTA reaches `#buy`; US$119 and US$219 and both existing checkout entries retained |
| Navigation / language / footer | Existing hover, keyboard Enter/Tab/Escape, outside dismissal, mobile submenu, footer accordion and actual language-switch paths checked |
| Motion / focus | Reduced-motion keeps Hero frame static during scroll; new transitions become 0s; keyboard focus has a visible 2px outline |
| Program / form | Existing localized Program links and enabled Google Forms destination retained; destination resolves to Google's sign-in flow. No form or participant data submitted |
| Static checks | 2,579 assertions including 48 browser cases; HTML structure/duplicate IDs; JSON-LD and inline JavaScript parsing; case-sensitive resource/link existence; 36 responsive references |
| Hero | All 96 original frames exist; scripts unchanged; canvas changes on normal scroll and stays static under reduced motion |
| SEO | Canonical, hreflang and structured data preserved; one H1 per page |
| Build tools | Static HTML repository; package.json has no build/lint/typecheck scripts. HTML validation, JavaScript parsing, resource checks and browser tests used instead |

No actual payment, order creation, discount redemption, authentication or analytics-event delivery was claimed. Existing executable scripts, consent, tracking, Shopify integration and form configuration were compared against baseline, not rewritten.

## Protected baseline

Header/footer markup and all executable script blocks are unchanged. Science diagrams, campaign/application logic, original image assets, Hero engine, account/auth, payment, attribution, backend functions and infrastructure are outside the diff.

Products `#buy` through the end of main, SHA-256 after line-ending normalization:

- EN: `5ecc5ae63066b5069a286fa5c390a675592ed746dce6bf9ec5f5e23c1d4f0afe`
- ZH: `630a6469e690aa485734cd58f12f83ff4bde7a8b917be3ff18156ef639006bd9`

The pre-existing, uncommitted `assets/css/typography.css` byte hash remains `353c76368f6dee1750daf45852ce15f718a76fbc5f6be448c1c275a9316ca053`; it is excluded from this release.

## Accessibility and performance — limits included

Axe WCAG 2/2.1/2.2 A/AA rule scan at 390px: Home/About/Lab EN/ZH have zero reported violations. Products EN/ZH retain one pre-existing `color-contrast` finding on decorative `.ah-folio` inside protected `#buy` (1.45:1). The same finding was reproduced on production baseline; it was not silently changed. This is not a claim of full WCAG 2.2 AA conformance.

Lighthouse lab sampling uses actual Chrome, local static HTTP with text compression, existing external fonts, and Lighthouse's simulated mobile slow-4G / desktop dense-4G profiles. Before measurements are production; after measurements are local, so origin latency and hostname-dependent tracking differ. These are diagnostic samples, not a controlled field experiment or real-user p75 data.

| Sample | Performance | LCP | CLS | TBT | Transfer |
|---|---:|---:|---:|---:|---:|
| Home before, mobile | 50 | 8.58s | 0 | 368ms | 22.81MB |
| Home after, mobile | 71 | 6.34s | 0.0110 | 0ms | 2.13MB |
| Products before, mobile | 37 | 60.60s | 0.1658 | 541ms | 18.87MB |
| Products after, mobile | 71 | 6.26s | 0.0007 | 0ms | 1.25MB |
| Home after, desktop | 96 | 1.22s | 0.0023 | 0ms | 2.19MB |
| Products after, desktop | 97 | 1.20s | 0.0009 | 0ms | 1.32MB |

**Mobile lab LCP is still above the 2.5s target.** The remaining critical path includes shared blocking CSS, external fonts/icons and the protected Hero loading architecture. The redesign removes oversized photo transfer and shows no major performance regression; it does not complete a broader shared-asset/engine optimization. INP cannot be inferred from zero TBT; field INP and p75 CWV remain unverified.

## Release decision

Visual/function/protected-system gates pass. No blocking regression was found. The recorded mobile performance target and pre-existing protected decorative-contrast issue remain follow-up work, not hidden passes. No asset, scientific claim or new feature was invented to meet the visual brief. Commit/push is permitted by the active request; production SHA, HTTP/content equality and visual smoke checks must be verified after the existing VPS synchronization.

## Evidence files

- `browser-results.json`: final 48-case browser matrix.
- `interaction.json`: keyboard, reduced-motion and purchase-entry checks.
- `accessibility.json` / `baseline-accessibility.json`: scoped findings and baseline comparison.
- `performance.json`: lab samples with desktop profile settings.
- `responsive-images.json`: original and derivative dimensions/bytes.
- `screenshots/`: actual before/after browser images, not design mockups.

## Production verification — 2026-10-19 (Taipei)

- Release code: `60228329081a4225f577591e444b825149b7aba0`; pushed to `origin/main`. VPS `/srv/owlnest/site` reported this exact SHA; existing `owlnest-update.service` returned `Result=success`, `ExecMainStatus=0`. No infrastructure configuration changed.
- Apex HTTPS: 200 with certificate validation. WWW HTTPS: 301 to canonical apex with certificate validation. All eight changed routes and six unchanged Science/Evidence/Program routes: 200, content hashes equal to the local release after line-ending normalization. New stylesheet matches too.
- All 18 responsive assets: 200, `image/webp`, exact binary hashes. Gallery: 200 with `noindex,nofollow`.
- Production Chrome: all eight pages at 390 × 844 and 1440 × 900 (16 cases), no horizontal overflow, console/page errors, failed resources or broken images. First screens and full-page compositions were inspected. Package images also checked at their actual scroll position, not only flattened full-page captures.
- Four production functional passes confirm About/research routes, EN/ZH switching, existing questionnaire destination and both purchase entries. The form resolves to Google's sign-in page (200); no submission or payment was performed.
- One initial Campaign check exceeded a `networkidle` wait. Repeating with DOM readiness and explicit element checks passed; HTTP content matched. No site code was changed to hide that test timeout.
- Production evidence: `production-browser-results.json`, `production-interaction.json`, `production-assets.json`. Performance and accessibility limitations above still apply; production smoke checks are not field CWV measurements.
