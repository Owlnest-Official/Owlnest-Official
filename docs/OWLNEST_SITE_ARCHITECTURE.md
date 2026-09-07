# Owlnest Site Architecture

Current public architecture • Updated 2026-09-06 (Batch D)

This replaces the July 2026 page-role snapshot after the approved Rounds 1–6 and Batches A–D. It records the existing site, not a redesign or new strategy.

Authority: active user decisions → verified protected product/commerce facts → Brand and Product Truth → current Operating Brief → historical reference material. This document cannot create specifications, measurements, legal terms, or operational promises.

## Existing page owners

EN and ZH are one family. English is the structural template; Chinese uses natural Taiwan phrasing.

| Page | English route | Traditional Chinese route | Responsibility |
|---|---|---|---|
| Home | / | /zh-tw/ | Problem, category, difference, science bridge, experience and purchase entry |
| Products | /products | /zh-tw/products/ | Product display, buying facts, size, package, protected #buy |
| What Is Lume | /what-is-owlnest-lume/ | /zh-tw/what-is-owlnest-lume/ | What it is and how spectrum design differs from warm appearance |
| Science | /science | /zh-tw/science/ | General light, spectrum, exposure, and biological timing |
| Evidence | /evidence/ | /zh-tw/evidence/ | Established references and design rationale; no duplicate science lesson |
| Owlnest Sleep Lab | /lab/ | /zh-tw/lab/ | Long-term real-life research and product–user fit |
| 21-Day Sleep Program | /campaign/ | /zh-tw/campaign/ | One Lab method: purpose, timeline, participation, honest feedback |
| About | /about | /zh-tw/about/ | Brand origin and historical design story |
| Manual | /manual | /zh-tw/manual/ | Bottom button, USB-C, after-dark use, essential care |
| FAQ | /faq/ | /zh-tw/faq/ | Direct answers and contextual links |
| Reviews | /reviews | /zh-tw/reviews/ | Actual product feedback, distinct from research |
| Contact | /contact | /zh-tw/contact/ | Working contact methods and form |
| Policy | /disclaimer; /preorder-policy | /zh-tw/disclaimer/; /zh-tw/preorder-policy/ | Legal, commercial, safety, and support terms |
| Room Check | /sleep-ready-room-check/ | /zh-tw/sleep-ready-room-check/ | Existing optional room-light tool; protected logic |
| Account / commerce | Existing routes | Existing localized routes | Protected login, orders, attribution, checkout, and customer tasks |

Do not remove legitimate public routes because they are optional. Do not create other Labs, Results placeholders, speculative studies, or a second product-information architecture.

## Research ownership

Owlnest Sleep Lab is the only public Lab. It asks who finds value, in which nighttime situations, where value is limited, and who may not fit. Positive, neutral, no meaningful change, and negative feedback belong in the method.

The 21-Day Sleep Program is one Lab method, not a sales campaign or clinical trial. Its five checkpoints are Day 0, 7, 14, 21, and 30. Use informational CTAs, not application-status UI or recruitment promises.

Science explains principles. Evidence provides established sources and design rationale. Do not present conceptual spectrum visuals as measured product data or general research as Lume-specific outcomes.

## Navigation and user journey

Preserve the existing simplified navigation and footer from Batch B. Labels describe destinations, not slogans; EN/ZH expose equivalent destinations. Existing account and purchase utilities remain intact.

Visitors can enter any relevant page. Science and Evidence are optional paths, not mandatory purchase gates. Products owns purchase decisions; Manual owns operation; Policy owns terms. Room Check must not compete as a required purchase step.

A supporting page answers its own question, then links to the owner. Do not recreate a full product pitch, science lesson, FAQ, or Lab explanation at each destination.

## Permanent content rules

- Delete before adding; one section, one idea.
- Headline carries the message; supporting copy is usually 1–2 short sentences.
- If an image, headline, or earlier section already explains it, remove the repetition.
- Keep deep content on the appropriate deeper page; never pad visible copy for SEO.
- Preserve buying facts, actual instructions, real reviews, and necessary policy substance.
- Present what is real and ready today. Omit nonexistent content; do not publish absence notices or future promises.
- Do not confuse honest research methods with claims that participant results exist.
- Keep operational errors and legally necessary disclosures accurate.
- Do not add sections, cards, icons, photos, dashboards, or decoration to fill whitespace.

## AI and SEO synchronization

Existing mirrors: `ai-brief.html`, `ai/evidence.html`, `ai/product.json`, `ai/evidence.json`, `llms.txt`, `llms-full.txt`, `campaign/campaign.json`.

After an approved fact or page-role change, the implementing agent must sync these mirrors, relevant metadata/JSON-LD, and sitemap entries in the same scoped change. Do not infer automatic synchronization.

Keep titles in the `Page | Owlnest Official` convention, correct canonical URLs, reciprocal EN/zh-Hant alternates and English x-default. AI-only briefs retain their existing noindex/canonical treatment.

Sitemap lists real public URLs. Lastmod reflects actual content changes, not an invented freshness date. Preserve existing legitimate URLs and avoid duplicate search intent.

## Images and protected release

Use `docs/OWLNEST_IMAGE_PLACEMENT_2026-09.md` as the unchanged authoritative placement reference. Keep the 96-frame Home animation, two educational Science diagrams, exact photo paths, zero-photo families, and About historical disclaimers.

Content cleanup cannot change prices, Products #buy, Shopify/PayPal/discounts, Supabase/account/orders, Referral, Room Check, Netlify Functions, application/Form/data logic, DNS, Nginx, Docker, or VPS configuration.

When authorized, release directly from main after scoped static and Chrome desktop/mobile QA. Stage only expected files, push origin/main, allow the existing five-minute VPS auto-sync, and verify production. No feature branch, Netlify deployment, or staging-as-preview.
