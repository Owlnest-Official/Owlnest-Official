# Owlnest Website Agent Instructions

## Owlnest Lume Brand and Marketing Instructions

### Required First Step

For any task involving Owlnest Lume marketing, website copy, brand documents, ads, FAQ, creator materials, or Traditional Chinese copy, first read:

- `docs/brand/owlnest-lume-operating-brief.md`

Then read any relevant source docs listed inside that operating brief.

### Source-of-Truth Docs

- `docs/brand/owlnest-lume-claim-ladder.md`
- `docs/brand/owlnest-lume-product-facts-block.md`
- `docs/brand/normal-warm-lamp-vs-lume-comparison.md`
- `docs/marketing/owlnest-lume-adjacent-problem-angles.md`
- `docs/marketing/owlnest-lume-ad-hook-bank.md`
- `docs/marketing/owlnest-lume-ad-test-shortlist-round-1.md`

## Core Rules

- Preserve the existing visual system, typography, colors, layout style, and brand tone.
- Do not change checkout, payment, Snipcart, Supabase, login, account pages, or Netlify functions without explicit instruction.
- Do not expose supplier details, costs, private agreements, internal strategy, team details, or unpublished operations.
- Prefer minimal, reversible changes.
- Summarize files changed after every task.

## Claims and Compliance

Owlnest Lume should be described as a sleep-spectrum lamp / sleep-supporting spectrum lamp tuned to help people sleep, not just see.

Core product positioning:

- English: Owlnest Lume is a low-blue sleep-spectrum lamp designed to support natural melatonin and better sleep.
- Traditional Chinese: Owlnest Lume 是低藍光睡眠光譜燈，幫助促進自然褪黑激素分泌，讓身體進入更好睡的夜晚狀態。

Use conservative general-wellness language:
- supports a more natural evening wind-down
- supports natural melatonin rhythm
- helps create a calmer nighttime environment
- helps the body move into a more sleep-ready state
- research-informed design
- evidence-informed circadian lighting

Avoid medical claims:
- cures insomnia
- treats sleep disorders
- clinically proven
- guarantees deeper sleep
- guarantees melatonin production
- medically validated

Also do not claim:

- causes weight loss
- burns fat
- boosts metabolism
- controls appetite
- builds muscle
- repairs skin
- treats anxiety
- improves memory
- makes babies sleep better
- prevents falls
- medical-grade treatment

### Traditional Chinese Rules

English may use "support."

Traditional Chinese consumer-facing copy must not use:

- 支持
- 低光環境
- 光環境產品
- 健康光線產品
- 維持
- 用戶
- 質量
- 解決方案
- 科學助眠
- 助眠燈

Use Taiwan-natural wording:

- 睡前光線
- 夜晚光線
- 夜晚柔和光線
- 幫助促進自然褪黑激素分泌
- 幫助身體進入夜晚模式
- 幫助睡得更好
- 讓房間保留剛剛好的光
- 不用全黑，也不會亮得像白天
- 晚上需要一點光，但不需要把白天帶回房間

Research references from the Science page support design principles only. They do not prove product-specific clinical outcomes unless actual product-specific clinical testing is present.

## Evidence Handling

Use the existing Science page as the source of truth for research references.
Do not invent papers, lab reports, measured values, certifications, or clinical trials.
If product-specific spectrum validation is not available, label it as pending.

## Engineering Guardrails

Do not touch these areas unless explicitly requested:

- checkout
- referral
- PayPal
- Supabase
- discount code logic
- account / auth
- images
- `_incoming/`

Never stage `_incoming/`.

## Git Behavior

Unless the user explicitly asks:

- do not commit
- do not push

When committing, stage only the expected files.
