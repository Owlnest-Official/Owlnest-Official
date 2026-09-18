# Actual page roles — Phase 2, 2026-09-18

Internal implementation record. Authority: the user's current Phase 2 instructions. Baseline: `05b6bd73cda5aa5dc08ac01af8f8a4cb87b29251` on main. Conceptual categories are not independent URLs or pages.

## Page map

| Family | EN / ZH actual URL | H1 EN / ZH | Responsibility and actual parent | Primary contextual destinations |
|---|---|---|---|---|
| Home | `/` · `/zh-tw/` | Made for life after dark. / 為夜晚的生活設計。 | OWLNEST brand entry; Lume is its first product | Products, Science, Sleep Lab, 21-Day, existing buy anchor |
| Products / Lume | `/products` · `/zh-tw/products/` | Lume / Lume | Actual Lume product and purchase page; no separate catalog | Existing #buy, What Is Lume |
| What Is Lume | `/what-is-owlnest-lume/` · `/zh-tw/what-is-owlnest-lume/` | What is Lume? / 什麼是 Lume？ | Product-category explainer; existing WebPage belongs to WebSite | Products, Science, Evidence |
| Sleep Lab | `/lab/` · `/zh-tw/lab/` | Owlnest Sleep Lab / Owlnest Sleep Lab | Current research field within conceptual OWLNEST Lab; actual parent is Home/site | Science, 21-Day |
| Science | `/science` · `/zh-tw/science/` | Your body uses light to tell time. / 身體會透過光線判斷時間。 | General science; actual parent Sleep Lab | Sleep Lab breadcrumb, Evidence |
| Evidence | `/evidence/` · `/zh-tw/evidence/` | What supports Lume’s design? / Lume 的設計依據是什麼？ | General references and Lume design rationale, not product measurements/outcomes; actual parent Science | Science and Sleep Lab breadcrumbs, Science CTA |
| 21-Day | `/campaign/` · `/zh-tw/campaign/` | 21-Day Sleep Program / 21 天睡眠計畫 | One Lume research method within Sleep Lab, not a Programs index | #program-details, Sleep Lab |
| About | `/about` · `/zh-tw/about/` | Made for life after dark. / 為夜晚的生活設計 | Brand origin; Lume as a product, not the whole brand | Products |

EN/ZH CTA destinations and language-switch links retain their corresponding language routes. Home, Products and About are read-only in this round. No routes are moved or invented.

## Confirmed contradictions and minimal corrections

| Finding | Action |
|---|---|
| Lab and Sleep Lab breadcrumb entries resolve to the same document | Remove the Lab fragment entry in both languages across Lab, Science, Evidence and 21-Day; renumber matching BreadcrumbList positions |
| `/lab/#lab` CollectionPage pretends to be a parent of `/lab/#webpage` | Remove that CollectionPage; Sleep Lab WebPage belongs to the existing WebSite and retains real Science/Program children |
| What Is Lume's blanket "ordinary warm light only looks warm" comparison | State that warm-looking lights can have different spectra; retain Lume's design intent, without a measured superiority claim |
| Products and Lume breadcrumb/schema tiers resolve to the same document | Record only: Products full files, `#buy`, canonical, identifiers and commerce are protected |
| Older reference blocks equate conceptual categories with fragment-based public page levels | Current actual-page correction takes precedence; no broad rewrite of Truth, Ledger or AI-readable files |

## Retained boundaries

- Visible/schema paths: Home → Sleep Lab; Home → Sleep Lab → Science; Home → Sleep Lab → Science → Evidence; Home → Sleep Lab → 21-Day Sleep Program. ZH uses the existing localized names and URLs.
- Science's two conceptual diagrams remain unchanged and explicitly educational. General research is not Lume-specific measured SPD, a warm-lamp comparison, or a sleep-outcome study.
- Evidence already separates established science from design rationale and says references are not Lume-specific clinical proof. No fabricated measurement/result or new evidence section is added.
- Sleep Lab's questions are research aims. Feedback categories describe a method, not participants or completed results.
- 21-Day remains tied to Lume and Sleep Lab. Day 0 / 7 / 14 / 21 / 30, images, informational CTAs and application code are unchanged.
- Header/footer URLs and language switches are aligned. Exact-page active states are correct; auxiliary pages have no false active-page marker. No navigation redesign or new dropdowns.
- Canonical, hreflang, H1, images, styles, scripts, Home, Products and protected systems remain unchanged.

## Expansion gates — not public promises

| Area | Only revisit when real content exists |
|---|---|
| Products | A second actual product warrants separately planning catalog, product URLs, redirects and breadcrumb/schema migration. Do not build `/products/lume` now. |
| Lab | A second real research field warrants an actual Lab overview and distinct field pages. Do not publish an empty overview or a fictional second Lab. |
| Programs | Additional substantive programs may warrant an index. 21-Day is one current program, not the permanent template or parent of all programs. |
| Findings / product evidence | Publish only verifiable measurements or real observations, with scope and conditions. No empty Findings page or expected results. |

## Scoped pre-release QA

- Local HTTP: all 16 audited EN/ZH routes returned 200 and matched working-tree HTML.
- Chrome: 12 research/explainer/product routes at 1440 / 768 / 390 / 320 px; 48 checks without horizontal overflow, out-of-bounds headings or detected broken images. Desktop, tablet and mobile screenshots reviewed; mobile menu, language switch and research navigation exercised.
- JSON-LD parsed; visible research breadcrumbs match list names, positions and URLs. Relative links/anchors, exact-case assets and inline JavaScript syntax passed.
- Baseline comparisons confirm Home and Products whole files unchanged; affected headers, footers, menus, runtime scripts, canonical/hreflang, diagrams, images and Program timeline unchanged. No CSS modification; pre-existing typography.css remains outside the change.
- Production verification is a separate release gate: before release, Chrome reported `ERR_CONNECTION_CLOSED` and independent HTTPS clients failed the TLS handshake. This is a verification limitation, not evidence of a successful deployment; no infrastructure changes are authorized by this task.
