# Owlnest Positioning and Claim Inventory

Status: Round 2 inventory only. No public page, metadata, schema, runtime, checkout, tracking, or deployment file was changed in this round.

Audit baseline:

- Branch: `main`
- Local HEAD: `a23a1f9eec9f1c775bb03c1cd1148acff10440fa`
- Remote `origin/main`: `a23a1f9eec9f1c775bb03c1cd1148acff10440fa`
- Governing brand source: `docs/OWLNEST_BRAND_TRUTH.md`
- Governing product source: `docs/LUME_PRODUCT_TRUTH.md`
- Product-specific SPD, warm-lamp comparison, illuminance, distance, angle, and melanopic metrics remain pending.

## 1. Classification Rules

- **Keep**: approved product category, objective research context, factual hardware language, or conservative medical boundary.
- **Modify**: useful idea expressed with retired positioning, unsupported certainty, an outdated message role, or missing plain-language context.
- **Delete**: unsupported benefit or overnight conclusion that cannot be made compliant by a small wording adjustment.
- **Defer**: valid finding assigned to a later round; it is not permission to change the file during this inventory round.

The words `blue`, `blue-rich`, `blue-depleted`, and `low-blue` are not automatically prohibited in research summaries. The issue is using `low-blue`, `no-blue`, or related language as Lume's product name, primary consumer positioning, or a shortcut to an unmeasured product outcome.

## 2. Requested Search-Term Summary

| Search term | Current status | Classification | Required treatment |
| --- | --- | --- | --- |
| `low-blue` / `low blue` | Used as affirmative product positioning across public FAQ, campaign JSON, AI-readable files, generated manual copy, runtime prompts, and Traditional Chinese pages. | Retired primary positioning. | **Modify** product-facing uses to `sleep-spectrum lamp`, `specially tuned sleep spectrum`, and a plain-language nighttime explanation. **Keep** only objective research context where the wording accurately describes a study or design reference. |
| `no-blue` / `no blue` | No exact affirmative product claim found. A broad search can falsely match `No Bluetooth`. | No current product-positioning occurrence. | **Keep absent**. Do not introduce. |
| `zero-blue` | No occurrence outside the new source-of-truth documents' prohibited-term lists. | No current product-positioning occurrence. | **Keep absent**. |
| `blue-light-free` | No occurrence outside the new source-of-truth documents' prohibited-term lists. | No current product-positioning occurrence. | **Keep absent**. |
| `blue-light-minimized` | Present in `ai-brief.html`, `ai/evidence.*`, `evidence/index.html`, and `llms-full.txt`. | Retired product implementation label; product measurement is pending. | **Modify**. Research discussion about blue-light exposure may remain, but do not describe Lume itself with this as the main technical identity. |
| `sleep-spectrum` / `sleep spectrum` | Widespread across English and Traditional Chinese pages. | Approved category when used as `sleep-spectrum lamp`; often lacks the approved plain-language explanation. | **Keep and normalize**. Pair important appearances with `Light specially tuned for nighttime` or equivalent context. Avoid treating the term alone as self-explanatory. |
| `night-tuned` / `tuned for night` | Used on Home, Products, Science, Campaign, What Is Lume, and AI-readable content. | Superseded technical phrasing. | **Modify** to the approved hierarchy: `specially tuned sleep spectrum`, `specially tuned for nighttime`, or `specially tuned for after dark`, according to sentence task. |
| `after dark` | Only scattered generic uses in legacy internal marketing documents. None of the five new official lines appears on a tracked public page. | Missing new brand/product hierarchy. | **Add later by page role**, not by global replacement. |
| `melatonin` | Appears in research summaries, conservative support claims, stronger product outcome language, metadata, FAQ schema, and runtime output. | Mixed. | **Keep** objective research and `designed to support the body's natural melatonin rhythm`. **Modify/Delete** `helps promote secretion`, `supports natural melatonin and better sleep`, and any unmeasured all-night conclusion. |
| `1 to 2 hours` / `1–2 hours` | Used as fixed product timing in Science, FAQ, Manual, Disclaimer, Evidence, AI-readable files, and generated manual copy. | Conditional usage fact presented too uniformly as settled product evidence. | **Modify** after the usage boundary is approved. Do not retain as a universal scientific requirement without product-specific conditions. |
| `overnight` | Public English copy uses `all-night`; `overnight` is mainly in legacy internal claim documents. | Evidence-dependent use boundary. | **Do not promote** as a sleep benefit. Hardware capability and biological outcome must remain separate. |
| `all-night` | Affirmatively claimed in English FAQ/schema and legacy internal documents; Traditional Chinese Home and FAQ also promote `整晚`. | Direct conflict with the fixed `1–2 hours` language and pending product measurements. | **Modify/Delete** affirmative all-night claims until SPD, illuminance, distance, angle, and real-use conditions support a precise statement. |
| `stay on while you sleep` | Present in two Netlify function files and a legacy claim document. | Strongest unresolved overnight-use risk. | **Delete or replace** before those outputs are treated as approved brand copy. Protected runtime scope requires explicit authorization. |
| `better sleep` | Used as an affirmative product benefit in Products, FAQ/schema, AI/internal files, and Traditional Chinese FAQ. | Too broad when tied directly to product performance. | **Modify** to an approved environmental or rhythm-support claim. |
| `deep sleep` | Appears in the About social title (`The Art of Deep Sleep`) and primarily in prohibited-claim lists elsewhere. | Mixed. | **Modify** the About title later; **keep** occurrences that explicitly prohibit or disclaim the outcome. |
| `medical device` | Widespread in disclaimers, FAQ, Science, Campaign, What Is Lume, Manual, runtime disclaimers, and prohibited-claim lists. | Approved boundary language. | **Keep**, while reducing unnecessary repetition page by page. |
| `insomnia` | Mostly appears in explicit non-treatment boundaries; a few old documents use it in prohibited examples. | Approved boundary language. | **Keep** negative/non-treatment context. Never turn it into an acquisition promise. |

## 3. Official-Line Assignment Audit

Exact-match search covered English and Traditional Chinese variants.

| Official line | Current tracked public / SEO / structured / AI-readable presence | Finding | Recommended placement |
| --- | --- | --- | --- |
| `Made for life after dark.` | None. Present only in the two new internal source-of-truth documents. | Owlnest has no live official brand tagline yet. | Brand-level contexts; About is the primary narrative placement. Do not use as Lume's product tagline. |
| `Home begins after dark.` | None. Present only in `docs/OWLNEST_BRAND_TRUTH.md`. | Emotional line is not currently assigned. | About or an emotional brand-story section only; do not make it a repeated logo tagline. |
| `Night deserves its own light.` | None. Present only in the two new internal source-of-truth documents. | Lume's product point of view is absent from the public site. | A standalone Lume brand section on Home, Products, or Campaign; do not use as the Owlnest tagline. |
| `Your room knows it’s night. Your light doesn’t.` | None. Present only in the two new internal source-of-truth documents. | The new Hero hook is absent. Current Home uses `Turn the day off, not the room.` and `You were ready for bed. Your room wasn't.` | English Home Hero first; adapt naturally for Traditional Chinese in Round 8. |
| `After dark, ordinary light gets it wrong.` | None. Present only in the two new internal source-of-truth documents. | The approved advertising/comparison line is absent. | Product comparison, Campaign, advertising, or short-form creative; not a brand tagline. |

Traditional Chinese exact equivalents are also absent from all public pages and machine-readable files:

- `為天黑後的生活而生。`
- `天黑之後，家才真正開始。`
- `夜晚，值得有自己的光。`
- `房間知道夜深了，燈卻還不知道。`
- `天黑之後，普通的燈就用錯了。`

## 4. English Public-Page Inventory

| File / page | Representative current text | Problem type | Recommendation | SEO / structured / AI-readable impact |
| --- | --- | --- | --- | --- |
| `index.html` — Home | `Turn the day off, not the room.` (895); `Night-tuned sleep-spectrum light` (963); `Supports natural melatonin timing` (1020); `Night-tuned glow` (1129). | Old Hero system and superseded technical term; approved product category is present but its plain-language explanation is missing. | **Modify in Round 3**. Keep visual sections, CTA, product photos, comparison concept, Shopify, form, and Room Check behavior. Assign the new Hero hook, product definition, Lume tagline, warm-light difference, and one science bridge without stacking all lines in one block. | Meta, Open Graph, Twitter, and JSON-LD repeat the old Home hook and `tuned for nights`; update only the necessary English Home metadata in Round 3. |
| `products.html` — Products | `sleep-spectrum lamp tuned for night` (84); `Supports natural melatonin and better sleep` (697); `Night-tuned glow` (794). | Correct category mixed with retired technical language and an over-broad sleep outcome. The current comparison does not yet make spectrum-vs-appearance the central answer. | **Modify in Round 4**. Keep product facts, photography, purchase flow, and simple-operation proof. Replace the stronger outcome claim and make ordinary warm light vs Lume the page's single comparison job. | Meta, Open Graph, Twitter, and Product structured data contain the old definition. |
| `science.html` — Science | Metadata says `designed to reduce nighttime blue-light exposure`; body says `made for the 1–2 hours before bed` (903), `night-tuned light` (1028), and `Low-blue nighttime light` (1040). Research titles objectively discuss blue wavelengths and melatonin. | Product positioning, usage certainty, and legitimate research language are mixed together. Product-specific measurement remains pending. | **Modify in Round 5**. Keep study titles, citations, objective blue-rich/blue-depleted discussion, conceptual-image labels, research boundary, and non-medical disclaimer. Rebuild the front half around spectrum, body time, and Lume before the research depth. | Meta, Open Graph, Twitter, and JSON-LD contain the old product claim. |
| `campaign/index.html` — Campaign | `Lume is a sleep-spectrum lamp tuned for night.` (874); `Night-tuned spectrum.` (877); old Campaign Hero is `You were ready for bed. Your room wasn’t.` plus `Turn the day off, not the room.` | Old product definition and fragmented message hierarchy. | **Modify in Round 6**. Keep Shopify purchase, policy links, forms, product-proof assets, Before/With Lume, and non-medical boundary. Reorder into one persuasion path and remove repeated product-definition variants. | Meta, Open Graph, Twitter, WebPage/Product/FAQ schema, image alt text, and footer use the old definition. |
| `about.html` — About | Metadata: `Owlnest creates science-informed sleep environment tools`; social title: `The Art of Deep Sleep`; body: `Owlnest builds simple physical tools for quieter nights.` | Brand is narrowed to sleep tools and Lume-adjacent language; no `Nighttime living` category or official Owlnest tagline. `Deep Sleep` can read as an outcome territory. | **Modify in Round 7**. Keep Taiwan, origin, physical-product craft, and honest-claims themes. Expand Owlnest beyond a lamp/sleep-tech company and assign brand vs product lines correctly. | Meta, Open Graph, and Twitter require brand-level synchronization later. |
| `faq/index.html` — FAQ | FAQ schema/body: `deep amber, low-blue sleep-spectrum lamp`; `How does Lume support natural melatonin and better sleep?`; `Use ... last 1–2 hours`; `Yes ... designed for all-night low-light use.` | Highest public contradiction: retired primary positioning, broad benefit, and mutually unresolved fixed timing vs all-night use. The answer also tells readers to adjust `brightness`, although brightness adjustment is not a confirmed feature. | **Modify after usage facts are approved**. Keep the night-light/warm-light questions and non-medical boundary, but rewrite both visible FAQ and duplicated FAQ schema together. Remove any implication of an adjustable brightness control unless confirmed. | High: FAQPage JSON-LD duplicates every risky answer. |
| `what-is-owlnest-lume/index.html` — What Is Lume | `sleep-spectrum lamp tuned for night`; `night-tuned spectrum`; `Help reduce nighttime blue-light exposure and support natural melatonin`. | Old technical label repeated across metadata, schema, cards, FAQ, and footer. | **Modify during later content synchronization**. Keep the definitional role, product category, ordinary-night-light distinction, and non-medical boundary. Use the exact product definition once, then avoid repetition. | Meta, Open Graph, Twitter, WebPage/Product/FAQ structured data are affected. |
| `evidence/index.html` — Evidence | `blue-light-minimized spectrum direction`; `Recommend use 1 to 2 hours before bed`; study summaries and explicit `This does not show measured melatonin changes from Lume.` | Strong boundary exists, but product implementation and timing are stated more firmly than the available product evidence supports. | **Modify evidence-to-product mapping**; **keep** study summaries, citations, and claim boundaries. Mark product-specific measurement as pending. | Meta, Open Graph, Twitter, WebPage/CollectionPage/ItemList structured data plus visible evidence tables. |
| `disclaimer.html` — Disclaimer | `not medical devices`; `designed for the final 1 to 2 hours before bed`. | Medical boundary is correct; fixed usage timing needs alignment with the final usage facts. | **Keep** non-medical and no-guarantee language. **Modify** timing only after the usage standard is approved. | Visible policy content; no requested AI-readable layer found. |
| `manual.html` — Manual | Metadata and instructions repeatedly say `last 1 to 2 hours before bed`; `not a medical device and not a treatment for insomnia`. | Setup/safety content is useful; timing is presented as a fixed instruction. | **Keep** hardware, charging, placement, care, safety, and non-medical text. **Modify** timing consistently with the source of truth. | Meta, Open Graph, and Twitter descriptions are affected. Generated PDF source is separately inventoried below. |
| `reviews.html` — Reviews | Metadata: `sleep-spectrum lamp tuned for nights that still need light`. | Old product definition in metadata only. | **Modify later** with global SEO synchronization; keep review functionality and content. | Meta, Open Graph, Twitter, and WebPage description. |
| `preorder-policy.html` — Preorder policy | Footer: `Sleep-spectrum lamp for calmer pre-sleep light and low-light nights.` | Shared old footer positioning; policy content itself is not implicated. | **Modify shared footer only when global content is synchronized**. Keep policy terms untouched. | No material structured-data issue from the requested terms. |
| `sleep-ready-room-check/index.html` — Room Check | Footer uses old sleep-spectrum line; result copy says `calmer sleep spectrum made for nighttime`. | Product phrasing is close but not governed by the new exact hierarchy; downstream runtime output contains stronger issues. | **Defer**. Keep the tool UX and analysis logic untouched in this round. Any runtime copy change needs explicit protected-scope authorization. | Dynamic user-facing result copy; related Netlify functions are separately inventoried below. |

## 5. Traditional Chinese Public-Page Inventory

Traditional Chinese was searched for the requested concepts plus the existing equivalents `低藍光`, `無藍光`, `睡眠光譜`, `褪黑激素`, `睡前 1–2 小時`, `整晚`, `睡得更好`, `醫療器材`, and `失眠`.

| File / page | Representative current text | Problem type | Recommendation | SEO / structured / AI-readable impact |
| --- | --- | --- | --- | --- |
| `zh-tw/index.html` — Home | `為夜晚特調的睡眠光譜燈`; `整晚留一點柔和的光`; comparison says `適合睡前、夜醒與整晚柔和光線`; `幫助減少夜間藍光刺激`. | Terminology is closer to the new direction than English, but the new brand/product/Hero hierarchy is absent and all-night use is promoted as settled. | **Defer to Round 8** after English is approved. Keep natural Taiwan phrasing and the existing English-layout parity; remove unsupported all-night certainty. | Meta, Open Graph, Twitter, and JSON-LD use current product definition. |
| `zh-tw/products/index.html` — Products | Product schema category: `低藍光睡眠光譜燈`; visible content mostly uses `為夜晚特調的睡眠光譜`; comparison mentions `整晚睡眠環境`. | Machine-readable category still uses retired positioning; visible page is closer but needs the approved hierarchy and evidence boundary. | **Defer to Round 8/9**. Keep the warm-light distinction, product facts, visual structure, and purchase flow. | High: Product structured data plus meta/OG/Twitter. |
| `zh-tw/science/index.html` — Science | Metadata connects Lume to reducing blue-light stimulation and promoting melatonin; body includes objective low-blue study discussion and a product card `低藍光夜間光`. | Legitimate study description and retired product positioning are mixed. | **Keep** objective research, references, conceptual-image labels, and non-medical boundary. **Modify** Lume-facing low-blue label and product-outcome metadata after English Science is approved. | Meta, Open Graph, Twitter, and structured data are affected. |
| `zh-tw/campaign/index.html` — Campaign | Visible copy: `為夜晚特調的睡眠光譜燈`; Product schema: `低藍光睡眠光譜燈`; medical/insomnia boundary is conservative. | Visible copy and schema disagree; new Lume product tagline/Hero system is absent. | **Defer to Round 8** after English Campaign. Keep purchase, policy, proof assets, and negative medical boundary. | Meta/OG/Twitter plus Product and FAQ schema. |
| `zh-tw/faq/index.html` — FAQ | `深琥珀、低藍光睡眠光譜燈`; `幫助促進自然褪黑激素分泌，讓人更好睡`; fixed `睡前 1–2 小時`; affirmative `為整晚留一點柔和的光而設計`; tells readers to adjust `亮度`. | Same highest-risk contradiction as English, plus retired Chinese positioning and an unconfirmed brightness-adjustment implication. | **Modify visible FAQ and FAQ schema together** after usage facts are approved. Keep non-medical/insomnia boundary. | High: FAQPage JSON-LD duplicates risky answers. |
| `zh-tw/what-is-owlnest-lume/index.html` — What Is Lume | `為夜晚特調的睡眠光譜燈`; `幫助減少夜間藍光暴露，幫助促進自然褪黑激素分泌`; non-medical/insomnia exclusions. | Product category is close; benefits need the approved conservative structure and less repetition. | **Modify in Round 8** following the approved English role. Keep the clear category and negative boundaries. | Meta/OG/Twitter and FAQ structured data. |
| `zh-tw/evidence/index.html` — Evidence | `低藍光光譜作為夜晚光線設計參考`; `以低藍光的琥珀光譜作為設計語境`; `定位為...睡眠光譜燈`. | Some low-blue uses are legitimate design/research context; others read as product implementation despite pending measurement. | **Keep** clearly attributed research/design references. **Modify** product implementation rows and add pending-measurement clarity. | Evidence page tables; no separate JSON file under `zh-tw` found. |
| `zh-tw/about/index.html` — About | `給夜晚用的睡眠光譜`; current brand story does not use `Nighttime living` or the official brand tagline. | Owlnest remains Lume-centered; new brand world is absent. | **Defer to Round 8 after English About**. Keep Taiwan and existing visual/layout system. | Page metadata requires later brand synchronization. |
| `zh-tw/manual/index.html` — Manual | `睡眠光譜燈`; `不是醫療器材，也不保證睡眠結果`. | Mostly aligned and conservative. | **Keep** setup, care, safety, and boundary language. Synchronize only changed usage facts later. | Visible manual content. |
| `zh-tw/disclaimer/index.html` — Disclaimer | `不是醫療器材`; `不提供...固定結果承諾`; product described as a nighttime sleep-spectrum lamp. | Conservative and generally aligned. | **Keep**, except for later terminology consistency if the product definition changes. | Meta/OG/Twitter include policy boundary. |
| `zh-tw/sleep-ready-room-check/index.html` — Room Check | Result copy says Lume is `為夜晚特調的睡眠光譜燈`. | Close to approved direction; missing final exact hierarchy. One result string has a punctuation/run-on issue unrelated to positioning. | **Defer**. Do not alter the tool or protected runtime during this content inventory. | Dynamic result copy. |

## 6. SEO, Structured Data, AI-Readable, Runtime, and Generated-Artifact Inventory

| File / surface | Representative current text | Problem type | Recommendation | Surface type |
| --- | --- | --- | --- | --- |
| `ai-brief.html` | `night-tuned spectrum direction`; `blue-light-minimized amber spectrum direction`; `use 1 to 2 hours before bed`. | Machine-readable product identity and timing are outdated. | **Modify in Round 9** to the approved brand/product hierarchy and evidence boundary. Keep prohibited-claim list and non-medical caveat. | AI-readable HTML, metadata, JSON-LD. |
| `ai/product.json` | `use_timing: 1 to 2 hours before bed`; `deep amber, low-blue spectrum direction`; approved/prohibited claim arrays. | Old technical identity and fixed timing are encoded as facts. | **Modify in Round 9**. Preserve real hardware facts and explicit prohibited claims. | AI-readable JSON. |
| `ai/evidence.json` | `blue-light-minimized spectrum direction`; `Recommend use 1 to 2 hours before bed`; explicit boundary that studies do not prove measured Lume melatonin change. | Evidence boundary is good; product implementation mapping is too firm. | **Keep** sources and claim boundaries. **Modify** product-specific implementation/timing and mark measurement pending. | AI-readable JSON. |
| `ai/evidence.html` | HTML rendering of the same old implementation and timing; includes prohibited `improves deep sleep`. | Mixed product claim and prohibited-claim reference. | **Modify** implementation/timing; **keep** prohibited list and study boundaries. | AI-readable HTML and structured data. |
| `llms.txt` | `sleep-supporting spectrum lamp used 1 to 2 hours before bed`; `deep amber low-blue spectrum direction`. | Old product category variant and fixed timing. | **Modify in Round 9**. Keep hardware facts and prohibited claims. | AI-readable text. |
| `llms-full.txt` | `deep amber low-blue spectrum direction`; `blue-light-minimized`; repeated `1 to 2 hours before bed`. | Old identity and timing repeated as facts. | **Modify in Round 9**. Preserve research-source mapping and prohibited claims. | AI-readable text. |
| `campaign/campaign.json` | `A deep amber, low-blue sleep-spectrum lamp`; `sleep spectrum lamp tuned for night-friendly sleep`. | Retired primary positioning in machine-readable campaign summary. | **Modify when Campaign is synchronized**. Keep purchase and factual campaign data. | Machine-readable campaign JSON. |
| HTML metadata and JSON-LD on core pages | Home, Products, Science, Campaign, About, FAQ, What Is Lume, Evidence, Reviews, and Traditional Chinese counterparts repeat old definitions and claims. | Visible copy and machine-readable copy can diverge if edited separately. | Treat metadata/schema as a paired change with each page, then run final global synchronization in Round 9. | SEO, Open Graph, Twitter, structured data. |
| `netlify/functions/analyze-sleep-environment.js` | `low-blue, approximately 1500K sleep spectrum lamp made to stay on while you sleep`; `helps promote natural melatonin secretion`; repeated all-night guidance. | Retired positioning, unvalidated color-temperature range, strong overnight conclusion, and stronger melatonin wording in a live analysis prompt. | **High priority, but protected scope**. Requires explicit authorization before editing. Replace with approved product definition and conservative evidence boundary; do not assert a validated `1500K` range or all-night biological outcome. | Live serverless prompt / dynamic user output. |
| `netlify/functions/send-sleep-check-result.js` | `made to stay on while you sleep, helping promote natural melatonin secretion`; repeat recommendation to use it while sleeping. | Strong overnight and melatonin claims can be sent to users even if public pages are corrected. | **High priority, but protected scope**. Requires explicit authorization. Keep non-medical assessment disclaimer. | Live serverless email/text output. |
| `scripts/build_manual_pdf.py` | `LOW-BLUE SLEEP-SPECTRUM LAMP`; `1500K-1800K`; `1-2 hours`; low-blue PDF keywords. | Generated PDF can reintroduce retired positioning and an unvalidated range after HTML is fixed. | **Modify before regenerating the manual PDF**. Keep hardware/safety facts and non-medical boundary. | Generated-document source and PDF metadata. |

## 7. Legacy Internal Documents

These files are not public pages, but they currently instruct future writers and agents to use the retired positioning. They must not override `docs/OWLNEST_BRAND_TRUTH.md` or `docs/LUME_PRODUCT_TRUTH.md`.

| File | Representative conflict | Recommendation |
| --- | --- | --- |
| `AGENTS.md` | Declares `low-blue sleep-spectrum lamp designed to support natural melatonin and better sleep` as core positioning. | **High-priority governance update** in a separately authorized scope: point to the new source-of-truth documents and retire low-blue as primary positioning while preserving safety/engineering guardrails. |
| `docs/brand/owlnest-lume-operating-brief.md` | Repeats the old low-blue/better-sleep core. | Mark as superseded or update its routing role before relying on it for future copy. |
| `docs/brand/owlnest-lume-claim-ladder.md` | Promotes low-blue, better sleep, and all-night use; contains `Made to stay on while you sleep`. | Replace its approved/conditional/prohibited ladder with the new source-of-truth logic. Keep useful medical prohibitions only after reconciling them. |
| `docs/brand/owlnest-lume-product-facts-block.md` | Defines Lume as low-blue and fixes use to `1 to 2 hours before bed`. | Update product definition, technical term, timing/evidence status, and terminology. Preserve verified hardware facts. |
| `docs/brand/normal-warm-lamp-vs-lume-comparison.md` | Uses low-blue, better sleep, reading/baby-care scenarios, and all-night use as differentiators. | Rebuild around appearance vs spectrum, design purpose, simple operation, and evidence entry. Remove unsupported scenarios/outcomes. |
| `docs/brand/owlnest-lume-faq-customer-support-bank.md` | Repeats low-blue positioning and says `Yes, it is designed for all-night low-light use.` | Update before reusing for customer service. Keep factual hardware and non-medical answers. |
| `docs/brand/owlnest-lume-benefit-amplification-map.md` | Routes adjacent benefits back to low-blue and better-sleep positioning. | Treat as legacy strategy. Rework only after the new hierarchy is live and evidence boundaries are fixed. |
| `docs/marketing/owlnest-lume-adjacent-problem-angles.md` | Defines Lume as low-blue and better-sleep product. | Keep useful problem categories and prohibited claims, but rewrite product return lines later. |
| `docs/marketing/owlnest-lume-ad-hook-bank.md` | Many hooks resolve to low-blue/better-sleep positioning. | Keep only hooks that survive the new voice and message hierarchy; rewrite product answers later. |
| `docs/marketing/owlnest-lume-ad-test-shortlist-round-1.md` | Test cells and evaluation rule center low-blue positioning. | Archive as a historical test round or relabel as superseded; do not use as current campaign authority. |

## 8. Priority Findings

1. **Usage contradiction:** English and Traditional Chinese FAQ content says both `1–2 hours before bed` and affirmative all-night use. The Home comparison, legacy claim docs, and live serverless output reinforce the all-night side without the pending measurement conditions.
2. **Runtime claim risk:** two Netlify function files can generate stronger claims than the public site, including `made to stay on while you sleep`, `approximately 1500K`, and `helping promote natural melatonin secretion`.
3. **Machine-readable drift:** FAQ schema, Product schema, Campaign JSON, AI brief/JSON, and LLM files still define Lume through low-blue or blue-light-minimized language. Fixing visible HTML alone would leave search engines and AI systems with the old positioning.
4. **Governance conflict:** `AGENTS.md` and the older brand/marketing documents explicitly instruct future work to use the retired positioning. The user's latest instructions and the two new source-of-truth documents govern this project, but the legacy files remain an operational trap.
5. **Official hierarchy absent:** none of the five official English lines or their Traditional Chinese equivalents is currently live. They must be assigned by message role, not inserted everywhere.
6. **Research content can be preserved:** Science and Evidence already contain useful citations and explicit product-evidence boundaries. Objective discussion of blue-rich or spectrally tuned study conditions should remain; only the leap from background research to unmeasured Lume performance needs correction.
7. **No exact `no-blue`, `zero-blue`, or `blue-light-free` product claim was found:** the dominant legacy issue is `low-blue` / `blue-light-minimized`, not an existing zero-blue promise.

## 9. Deferred Work by Round

- Round 3: English Home front section and necessary Home metadata only.
- Round 4: Products comparison, claim cleanup, usage consistency, and evidence placeholder.
- Round 5: Science front half and product-vs-research evidence boundary.
- Round 6: Campaign persuasion sequence and Campaign machine-readable summary/schema.
- Round 7: Owlnest brand page/About and official brand tagline assignment.
- Round 8: Natural Traditional Chinese synchronization after English approval.
- Round 9: SEO, structured data, FAQ schema, AI brief, JSON, and LLM files.
- Round 10: Full-site verification, including dynamic outputs if the protected runtime scope has been explicitly authorized.

No item in this inventory authorizes a global replacement. Each later round must use the exact page role, approved evidence status, and protected-system boundaries defined in the current source of truth.
