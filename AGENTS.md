# Owlnest Website Agent Instructions

## Required Reading Order

For any task involving Owlnest or Lume marketing, website copy, brand documents, ads, FAQ, creator materials, SEO, structured data, AI-readable content, or Traditional Chinese copy, read these files in order:

1. `docs/OWLNEST_BRAND_TRUTH.md`
2. `docs/LUME_PRODUCT_TRUTH.md`
3. `docs/brand/owlnest-lume-operating-brief.md`

The two root-level Truth documents are the primary authority. If any older brief, bank, draft, public page, runtime prompt, or generated artifact conflicts with them, the Truth documents win.

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

Unless the user explicitly asks:

- do not commit
- do not push

When committing, stage only the expected files.
