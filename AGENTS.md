# Owlnest Website Agent Instructions

## Production and Deployment Architecture

The current production architecture is:

- The canonical production website is `https://owlnestofficial.com`.
- Production hosting is provided by a Hetzner VPS, not Netlify Hosting.
- GitHub `main` is the source branch for the production website.
- The VPS synchronizes from `origin/main` automatically every five minutes. A push to `main` can therefore update production within five minutes.
- `staging.owlnestofficial.com` and production currently use the same website files. Staging is not an isolated test environment and must not be treated as a safe preview environment.
- Netlify remains only for DNS management and legacy-site fallback. Do not use Netlify to deploy the production website.
- The production server is Linux. Treat every filename, directory name, URL path, import, and asset reference as case-sensitive.
- Supabase continues to provide member authentication and data services.
- Shopify continues to provide products and checkout.

Deployment restrictions:

- Never run `netlify deploy`.
- Do not create new Netlify Functions.
- Do not create new `/.netlify/images` asset paths. Reference the real repository asset path directly.
- Do not assume `_redirects` controls production routing. Production routing is currently handled by Nginx on the VPS.
- Do not modify DNS, Caddy, Nginx, Docker, Supabase configuration, or Shopify configuration unless the active user request explicitly authorizes that exact system.
- Existing Netlify files, functions, paths, or legacy integrations are historical or fallback implementation. Do not remove or rewrite them merely because Netlify no longer hosts production.
- Never write VPS passwords, SSH private keys, access tokens, server secrets, or other credentials into the repository.

## Required Reading Order

For any task involving Owlnest or Lume marketing, website copy, brand documents, ads, FAQ, creator materials, SEO, structured data, AI-readable content, or Traditional Chinese copy, read these files in order:

1. `docs/OWLNEST_BRAND_TRUTH.md`
2. `docs/LUME_PRODUCT_TRUTH.md`
3. `docs/OWLNEST_CROSS_CONVERSATION_DECISION_LEDGER.md`
4. `docs/brand/owlnest-lume-operating-brief.md`

For website structure, public-page content, navigation, SEO landing pages, Campaign, Homepage, Products, Science, Evidence, FAQ, Manual, policy presentation, AI-readable public content, or cross-page duplication work, also read:

5. `docs/OWLNEST_SITE_ARCHITECTURE.md`

The Site Architecture is a conditional website-governance reference. It does not override either Truth document, the Ledger, the Operating Brief, or the user's active explicit instruction.

The two root-level Truth documents are the primary authority. If any older brief, bank, draft, public page, runtime prompt, or generated artifact conflicts with them, the Truth documents win.

The Cross-Conversation Decision Ledger supplements repository context with history from cross-ChatGPT projects, unarchived conversations, and memory sources that the repository cannot directly access. It does not override either Truth document.

- If an older conversation conflicts with the Truth documents or a `CURRENT` decision in the Ledger, treat it as historical material.
- Do not restore retired positioning from an older conversation, Campaign, metadata version, or marketing bank.
- If the active user's explicit instruction conflicts with the Ledger or either Truth document, stop and report the conflict. Do not blend the versions or resolve the conflict silently.

Current derived references:

- `docs/brand/owlnest-lume-claim-ladder.md`
- `docs/brand/owlnest-lume-product-facts-block.md`
- `docs/brand/normal-warm-lamp-vs-lume-comparison.md`

Files explicitly marked as historical or superseded are idea archives only. Do not use their product answers or claims verbatim without reconciling them against the current Truth documents.

## Brand and Product Architecture

Owlnest is a nighttime-living home-lifestyle brand, not only a lamp or sleep-technology company.

- Brand category: `Nighttime living` / `夜晚生活`
- Owlnest brand tagline: `Made for life after dark.` / `為天黑後的生活而生。`
- Lume product tagline: `Night deserves its own light.` / `夜晚，值得有自己的光。`
- Lume Hero hook: `Your room knows it’s night. Your light doesn’t.`
- Product definition: `Lume is a sleep-spectrum lamp, specially tuned for after dark.`
- Technical term: `specially tuned sleep spectrum` / `特調睡眠光譜`
- Plain-language explanation: `Light specially tuned for nighttime.` / `為夜晚特別調製的光。`
- Science bridge: `Your body uses light to tell time.` / `身體會從光，判斷現在是什麼時候。`

Do not interchange the Owlnest brand tagline, Lume product tagline, Hero hook, or product definition. Give each section one job.

Retired as Lume's formal product positioning:

- low-blue / low blue / 低藍光
- no-blue / zero-blue / 無藍光
- blue-light-free / blue-light-minimized
- night-tuned spectrum

These terms may appear only in accurately attributed research context or, where the Truth documents allow it, as a validated technical characteristic after real product measurement. They must not become Lume's category, headline, metadata identity, or first-sentence product definition.

## Claims and Compliance

Approved conservative language includes:

- Sleep-spectrum lamp
- Specially tuned sleep spectrum
- Light specially tuned for nighttime
- Designed to support the body's natural melatonin rhythm
- Research-informed design
- Helps create a calmer nighttime environment
- Helps the body move into a more sleep-ready state
- Supports a more sleep-ready nighttime environment

Claims requiring stronger product-specific evidence before affirmative use include:

- helps promote natural melatonin secretion
- helps people fall asleep faster
- helps people sleep longer
- improves sleep quality
- supports deeper or more stable sleep
- claims that leaving Lume on all night improves sleep or cannot affect melatonin

Do not claim or imply that Lume:

- cures insomnia or treats a sleep disorder
- guarantees faster, longer, deeper, or better sleep
- guarantees melatonin production
- is clinically proven without real product-specific clinical testing
- is a medical device or medical-grade treatment
- fixes or resets a circadian rhythm
- causes weight loss, burns fat, boosts metabolism, or controls appetite
- builds muscle or guarantees recovery
- repairs skin or provides anti-aging outcomes
- treats anxiety or another mental-health condition
- improves memory
- makes babies sleep better
- prevents falls

Lume is a sleep-environment tool, not a medical device.

## Usage and Evidence Boundaries

- Use Lume after dark, during the wind-down period before bed, or during brief nighttime wake-ups when a small amount of light is needed.
- The final `1 to 2 hours` before bed may be described as practical guidance, not a tested threshold or universal requirement.
- At bedtime, switch Lume off unless a small amount of light is still needed.
- Do not make all-night use a primary selling claim or infer a biological outcome from color, softness, or visual appearance.
- Do not publish a fixed distance, angle, illuminance, melanopic metric, CCT range, or spectral result until supported by product-specific records.

The current repository contains general research and real product/hardware photography, but no public product-specific SPD report, measured warm-lamp comparison, defined illuminance conditions, melanopic metrics, or clinical sleep-outcome study.

- Label conceptual diagrams as educational or conceptual.
- Never present AI-generated or conceptual curves as measured evidence.
- General research supports design principles only; it does not prove Lume-specific biological or clinical outcomes.

## Traditional Chinese Rules

- Write naturally for Taiwan readers; do not translate English sentence structure mechanically.
- Preserve contrast, imagery, brevity, and the assigned job of each line.
- Avoid mainland-style wording and generic wellness filler.
- Avoid generic uses of `支持` in consumer-facing prose. The exact approved statement `設計用來支持身體自然的褪黑激素節律` is an intentional exception and must not be strengthened into a measured outcome.
- Prefer concrete phrases such as `睡前光線`, `夜晚光線`, `讓房間保留剛剛好的光`, and `晚上需要一點光，但不需要把白天帶回房間` where they fit the section's job.
- Do not use `低藍光燈`, `無藍光燈`, `防藍光燈`, `藍光過濾燈`, or `助眠燈` as Lume's formal product identity.

## Core Engineering Rules

- Preserve the existing visual system, typography, colors, layout style, and brand tone.
- Prefer minimal, reversible changes.
- Do not expose supplier details, costs, private agreements, internal strategy, team details, or unpublished operations.
- Summarize files changed after every task.
- Before editing, identify the files that are allowed to change and the files or systems that must remain untouched.
- Keep each task within its approved scope. Do not expand the edit because an adjacent issue appears convenient to fix.
- For visual changes, validate both desktop and mobile layouts.
- For shared navigation, product, policy, or layout changes, validate both English and Traditional Chinese pages.
- After changes, run `git diff --check`.
- Validate every new or modified image, script, stylesheet, and resource path against the exact case-sensitive repository path.
- Confirm affected pages remain functional as static HTML without depending on Netlify Hosting behavior.
- Complete a QA report before committing or pushing.

Do not touch these areas unless explicitly requested:

- checkout
- referral
- PayPal
- Supabase
- discount code logic
- account / auth
- Netlify functions
- images
- `_incoming/`

Never stage `_incoming/`.

## Git Behavior

- The active user's explicit task instructions always control whether a task stops before commit or push.
- When a repository change is authorized through deployment and its QA passes, stage only the expected files, create an intentional commit, and push to `origin/main`.
- Never stage unrelated working-tree changes or `_incoming/`.
- Before committing, verify the staged file list and run `git diff --cached --check`.
- Before pushing, confirm the current branch, commit SHA, and ahead/behind state.
- Do not create or require a separate production branch.
- Do not use a Netlify preview as a release gate. Local static-page QA is the normal preview method unless the user explicitly provides another isolated environment.
- Remember that pushing `main` is a production-affecting action because the VPS may synchronize it within five minutes.
- After a successful push, report the exact commit SHA clearly.
