# Owlnest Site Architecture

Status: Current website information architecture governance

Freeze state: FROZEN as the current IA baseline; items listed under Open and Blocked Decisions are explicitly excluded from the freeze.

Version: 1.1

Effective date: 2026-07-22

Scope: Public website mission, visitor journeys, page responsibilities, content ownership, navigation, SEO, traffic routing, conversion flow, and change boundaries

Intended users: Owlnest operators, writers, designers, developers, SEO owners, AI-content maintainers, and any agent changing public-page structure or cross-page content ownership

Update triggers: A confirmed change to page responsibilities, navigation philosophy, visitor journeys, content ownership, campaign lifecycle governance, or the long-term website portfolio. A page-level copy or layout edit is not by itself an update trigger.

Authority:

1. Active user instruction
2. `AGENTS.md`
3. `docs/OWLNEST_BRAND_TRUTH.md`
4. `docs/LUME_PRODUCT_TRUTH.md`
5. `docs/OWLNEST_CROSS_CONVERSATION_DECISION_LEDGER.md`
6. `docs/brand/owlnest-lume-operating-brief.md`
7. This document

Authority relationship: This document governs website information architecture and consumer-facing content ownership. It does not replace the Brand Truth, Product Truth, Decision Ledger, or Operating Brief, and it cannot create a new brand position, product category, product specification, science conclusion, evidence status, or operational promise. If this document conflicts with either Truth document, the Truth document wins. If it conflicts with the user's latest explicit operational instruction, stop and report the conflict rather than blending versions. Existing website implementation is an auditable implementation, not a governance authority.

Non-goals: This document is not a wireframe, UI specification, copy deck, SEO keyword bank, Campaign brief, product specification, science claim authority, checkout specification, CSS or implementation plan, or replacement for the Truth documents.

English and Taiwan Traditional Chinese pages share one information architecture. Localization may change phrasing and rhythm, but not page responsibility, product facts, evidence boundaries, or conversion role.

## Executive Summary

The current Owlnest website exists to move an appropriate visitor through four decisions:

1. Understand the nighttime-light problem.
2. Recognize what Lume is and why it differs from ordinary warm light.
3. Find enough product, evidence, policy, or social proof to trust the purchase.
4. Complete the purchase and use Lume safely.

No visitor should need to read every page. Products is the canonical product-decision page. Science is an optional confidence branch, not a required lesson. Evidence is the traceability and validation record, not a second consumer Science page. Campaign is a time-bound conversion surface, not a permanent duplicate of Products. What-is-Lume is an informational search landing page, not another Homepage. FAQ, Manual, Contact, Policy, Reviews, Room Check, Checkout, and post-purchase surfaces support a specific task and must not become general sales pages.

The current Lume-focused site has enough pages. The architectural problem is overlapping ownership: Homepage has 12 sections, Campaign has 13, and What-is-Lume has 8, while all three repeat content that Products, Science, FAQ, Manual, or Policy should own. The next structural work should remove duplicated responsibility, not add more sections or more pages. This current commercial focus does not limit Owlnest's future website to Lume.

---

# 1. Website Mission

## Current commercial mission

The current Owlnest website exists to help an unfamiliar but relevant visitor understand Owlnest, understand Lume, build sufficient trust, purchase Lume through the currently available protected Shopify flow, and find the information needed to use the product safely and obtain support afterward.

## Long-term brand architecture

Owlnest is a nighttime-living home-lifestyle brand. The current website is commercially centered on Lume because Lume is the first hero product, not because Owlnest is permanently a one-product lamp or sleep-technology company.

The architecture must be able to accommodate future nighttime lighting, scent, bedding, bedtime rituals, home recovery spaces, hotel and wellness experiences, and other products or experiences made for life after dark. Future additions require their own confirmed page responsibilities; they must not be forced into Lume's Products, Science, FAQ, or Manual ownership.

The website does not exist primarily to:

- display every brand thought;
- publish every available fact on every page;
- force every visitor through a complete science curriculum;
- repeat the same product definition for SEO;
- turn Campaign, FAQ, Manual, or Policy into additional sales pages;
- keep visitors browsing for its own sake.

## Mission test

A page belongs on the site only if it helps a defined visitor complete at least one of these jobs:

- orient: understand the brand, problem, or product category;
- evaluate: assess product difference, proof, use, or fit;
- verify: inspect research, evidence, policies, reviews, or claim boundaries;
- act: buy, contact, complete Room Check, or join a current campaign action;
- use: set up, operate, maintain, or obtain support after purchase;
- machine-read: provide a controlled, current representation of Truth to search engines and AI systems.

If a page cannot name its job, it should not gain more content.

## Website-level success condition

The site succeeds when visitors can reach the next appropriate decision without being forced to consume content owned by another page. More page views are not automatically better. A visitor who enters Products from search and purchases without visiting Homepage or Science has completed a valid journey.

---

# 2. Visitor Journey

## Canonical journey

```text
Cold Visitor
    ↓
Homepage — orientation and first understanding
    ↓
Products — product evaluation and purchase decision
    ├── needs evidence → Science → Evidence when source-level detail is needed
    ├── needs an answer → FAQ / Policy / Reviews
    └── ready to buy
            ↓
        Shopify Checkout
            ↓
        Confirmation / Account / Manual / Support
            ↓
        Post-purchase use
```

Science is a confidence branch, not a compulsory gate between Products and Checkout.

## Valid entry paths

```text
Brand or broad problem traffic
    → Homepage → Products

Brand query
    → Homepage or About → Products when product evaluation is relevant

Commercial product traffic
    → Products → Checkout

Ad traffic
    → Products, or the page that fulfills the specific ad promise

Definition or category query
    → What-is-Lume → Products or Science

Research or credibility query
    → Science → Evidence or Products

Room-light curiosity
    → AI Room Check → Products or Science

Campaign traffic
    → Campaign → current campaign action or Products

Referral / creator traffic
    → attributed Products or purchase route → Checkout

Question or objection traffic
    → FAQ / Policy / Reviews → owning page or Products

Existing customer traffic
    → Manual / FAQ / Account / Contact / Policy

Direct Shopify return visit
    → Products or protected Checkout
```

## Pages a visitor may skip

- Homepage may be skipped by high-intent search, referral, or returning visitors.
- Science may be skipped by visitors already satisfied with product proof and claim boundaries.
- Campaign may be skipped unless the visitor arrived through that campaign or needs current campaign information.
- What-is-Lume may be skipped by visitors who already understand the category.
- About may be skipped unless brand origin or trust matters to the visitor.
- Evidence may be skipped by most consumers; it exists for source-level verification.
- Room Check is optional and must never block product understanding or purchase.

## Pages required only for a specific task

- Products is required for a complete, canonical product evaluation, but not necessarily for a direct attributed checkout link.
- Checkout is required to complete a purchase.
- Policy is required when a visitor needs legal, shipping, return, tax, warranty, or order clarification.
- Manual is required for safe product use and support after purchase.
- AI and llms files are required for machine-readable accuracy, not for the human browsing journey.

## Supporting-page rule

A supporting page should resolve one uncertainty and return the visitor to the appropriate owner. It must not recreate the entire journey inside itself.

Homepage and Science are both valid entry or trust surfaces, but neither is a mandatory gate. The shortest legitimate path is the one that gives the specific visitor enough accurate understanding and confidence to take the next action.

---

# 3. Page Responsibility Matrix

EN and ZH versions are one page family and have the same responsibility.

## Homepage

- **Purpose:** Establish Owlnest's nighttime-living world and make Lume desirable, understandable, and credible enough for product evaluation or purchase.
- **Must Do:** Establish the nighttime-light problem, give Lume a real product-led introduction, provide a concise product definition and core difference, offer sufficient trust entry points, and maintain a clear purchase path.
- **Must NOT Do:** Become Products, teach the full Science page, reproduce FAQ, restate Campaign, list complete specifications, or carry policy detail.
- **Primary CTA:** Continue to the Lume product decision or the protected purchase entry appropriate to the page state.
- **Secondary CTA:** Follow the relevant evidence or supporting-tool path.
- **Exit Goal:** The visitor can explain what Lume is and knows whether to evaluate the product, inspect evidence, or leave.
- **Required Content:** Brand context, problem orientation, real Lume introduction, concise product definition, concise product difference, selected real product proof, clear purchase path, link to Products, link to Science.
- **Forbidden Content:** Full research library, detailed FAQ set, full manual, complete policy text, campaign progress archive, unverified product evidence.

## Products

- **Purpose:** Serve as the canonical product-information and purchase-decision page for Lume.
- **Must Do:** Own the product definition, product difference, verified facts, proof, use contexts, evidence boundary, package choice, and protected purchase entry.
- **Must NOT Do:** Retell the full About story, duplicate the research library, become Campaign, or promise unsupported outcomes. Necessary brand context is allowed when it helps a product decision.
- **Primary CTA:** Begin the protected Lume purchase flow.
- **Secondary CTA:** Inspect Science, FAQ, Reviews, or Policy when a specific uncertainty remains.
- **Exit Goal:** The visitor either purchases, names the exact unresolved objection, or decides the product is not a fit.
- **Required Content:** Definition, category, differentiation, verified hardware, dimensions, real product proof, use contexts, evidence status, purchase options, shipping/policy links.
- **Forbidden Content:** Full founder story, unrelated nighttime-living manifesto, full paper summaries, invented specifications, duplicated mini-FAQ sections that belong to FAQ.

## Science

- **Purpose:** Explain the consumer-relevant science of nighttime light and establish credible evidence boundaries.
- **Must Do:** Explain spectrum, timing, exposure, general research, Lume's design translation, what is measured, and what remains pending; build trust through accurate boundaries and provide contextual routes back to Products or purchase.
- **Must NOT Do:** Become a second Products page, repeat the full Homepage persuasion sequence, create Lume-specific measurements, or present general research as product validation.
- **Primary CTA:** Continue to source-level Evidence when deeper verification is needed.
- **Secondary CTA:** Return to Products for product evaluation.
- **Exit Goal:** The visitor understands why light composition matters and the exact limit of current Lume evidence.
- **Required Content:** Consumer science bridge, research explanation, evidence status, limitations, non-medical boundary, source links.
- **Forbidden Content:** Full product sales narrative, package comparison, founder story, campaign mechanics, unconditioned product-specific claims.

## Campaign

- **Purpose:** Serve a confirmed, time-bound campaign, launch, offer, update, progress story, or its honest paused, ended, or archived state.
- **Must Do:** State the confirmed campaign lifecycle state, the specific reason the page exists now, the valid current action if one exists, and any verified time-sensitive operational information.
- **Must NOT Do:** Become a second Products page, permanent brand introduction, duplicate Science, host a general FAQ, or preserve expired campaign status.
- **Primary CTA:** Complete the single valid action defined by the confirmed campaign state; an ended or archived state may route to Products without urgency.
- **Secondary CTA:** Continue to Products or current operational details.
- **Exit Goal:** The visitor completes or declines the campaign-specific action without needing to interpret old campaign history.
- **Required Content:** Confirmed lifecycle state, campaign premise when applicable, campaign-specific proof, verified operational terms, and clear links to canonical product or policy owners.
- **Forbidden Content:** Expired fulfillment promises, historical Indiegogo assumptions, full product specification library, full FAQ, full Science narrative.

Campaign lifecycle vocabulary is **ACTIVE**, **PAUSED**, **ENDED**, **ARCHIVED**, or **NO ACTIVE CAMPAIGN**. This document does not decide the current state. When no active campaign is confirmed, the page must not invent urgency, countdowns, shipping dates, early-access status, or campaign promises.

## What-is-Lume

- **Purpose:** Answer the informational and SEO question “What is Owlnest Lume?” in the shortest complete form.
- **Must Do:** Define the product, distinguish it from common alternatives, state the evidence boundary, and route the reader to Products or Science.
- **Must NOT Do:** Become Homepage, Products, Science, FAQ, or a long persuasion sequence.
- **Primary CTA:** Continue to Products.
- **Secondary CTA:** Continue to Science.
- **Exit Goal:** The visitor has a correct category-level answer and chooses a deeper owner.
- **Required Content:** One definition, one plain-language explanation, one concise difference, essential facts only, links to owning pages.
- **Forbidden Content:** Complete specifications, multiple use-scene sections, general FAQ library, brand manifesto, purchase packages, research database.

## About

- **Purpose:** Own the Owlnest brand story, origin, people, values, credibility, and future nighttime-living territory.
- **Must Do:** Explain why Owlnest exists, how the team approaches design and engineering, and how Lume begins the brand rather than defines its limit.
- **Must NOT Do:** Become a product feature page, imply an active Phu Quoc store, use medical founder drama, or expose private operational details.
- **Primary CTA:** Continue to the current hero product.
- **Secondary CTA:** Contact Owlnest when the visitor has a brand or partnership reason.
- **Exit Goal:** The visitor understands and trusts the company behind Lume.
- **Required Content:** Nighttime-living category, brand purpose, origin, founder/team roles where approved, Phu Quoc inspiration, future territory, Lume as first product.
- **Forbidden Content:** Full product comparison, detailed Science, checkout details, active-store claims, private ownership or supplier data.

## FAQ

- **Purpose:** Resolve discrete product, evidence, use, safety, purchase, and policy questions.
- **Must Do:** Give direct answers from current Truth and link to the page that owns the full subject.
- **Must NOT Do:** Rebuild the full sales narrative, introduce new claims, or become a product page. FAQ resolves objections through accurate answers, but does not recreate the full sales narrative.
- **Primary CTA:** Follow the contextual link to the owning page after the question is resolved.
- **Secondary CTA:** Contact support when the question is not covered.
- **Exit Goal:** The visitor no longer has the specific question or knows where to escalate it.
- **Required Content:** Concise answers, evidence and medical boundaries, use guidance, feature facts, purchase/policy routing.
- **Forbidden Content:** New campaign claims, long brand story, duplicated product galleries, independent specifications not sourced from Truth.

## Contact

- **Purpose:** Provide a credible route for product, order, support, partnership, press, or other direct inquiries.
- **Must Do:** Set contact expectations, collect enough context, and route urgent operational questions appropriately.
- **Must NOT Do:** Become FAQ, About, a store-location page, or a general sales page.
- **Primary CTA:** Submit or send the inquiry.
- **Secondary CTA:** Use the relevant self-service owner before contacting when appropriate.
- **Exit Goal:** The inquiry reaches the right support path with enough context.
- **Required Content:** Contact methods, inquiry categories, response expectations, privacy/consent context when data is collected.
- **Forbidden Content:** Obsolete physical-store information, full product definition, campaign offers, private team information.

## Manual

- **Purpose:** Own setup, charging, operation, placement, care, safety, limitations, troubleshooting, and support routing.
- **Must Do:** State only verified controls and usage, explain safe operation, and route warranty or service issues.
- **Must NOT Do:** Retell the full brand story, persuade a purchase, introduce unverified features, or use general research as operating instruction. Minimal brand and product identification is allowed when needed for safe, unambiguous use.
- **Primary CTA:** Complete the safe-use or support task.
- **Secondary CTA:** Contact support or consult the relevant policy.
- **Exit Goal:** The owner can use and care for Lume safely or knows how to get help.
- **Required Content:** Setup, USB-C, physical button, placement, bedtime boundary, care, safety, warranty/returns/support links.
- **Forbidden Content:** Founder story, campaign status, product-comparison narrative, unverified distance/angle/mode claims.

## Policy

Policy includes the Owlnest disclaimer, order and shipping policy, and linked Shopify policies.

- **Purpose:** Own legal, commercial, shipping, return, tax, warranty, privacy, claim, and order boundaries.
- **Must Do:** Be current, consistent with actual operations, clearly dated where needed, and link to the authoritative policy owner.
- **Must NOT Do:** Market the brand, create urgency, retain expired promises, or introduce product claims.
- **Primary CTA:** None as marketing; the task is policy comprehension or support escalation.
- **Secondary CTA:** Return to Products, Checkout, or Contact after the policy question is resolved.
- **Exit Goal:** The visitor understands the applicable term before acting.
- **Required Content:** Scope, current order state, fulfillment language, shipping/tax/duty terms, cancellations, returns, warranty, non-medical boundary, contact route.
- **Forbidden Content:** Promotional copy, unconfirmed dates, old crowdfunding terms presented as current, hidden contradictions between EN and ZH.

## Evidence

- **Purpose:** Serve as the source, traceability, validation-status, and claim-boundary record behind Science and product claims.
- **Must Do:** Separate published research, design translation, and product-specific validation; maintain source links and pending evidence status.
- **Must NOT Do:** Duplicate the consumer Science lesson, become a sales page, or elevate a concept illustration into measurement.
- **Primary CTA:** Inspect the cited source or validation record.
- **Secondary CTA:** Return to Science for interpretation or Products for product context.
- **Exit Goal:** A skeptical reader, reviewer, creator, or AI system can trace what supports each statement and what remains unverified.
- **Required Content:** Source list, traceability matrix, approved/avoided wording, validation roadmap, methods and limitations when data exists.
- **Forbidden Content:** Unsupported superiority claims, duplicate campaign content, unconditioned product outcomes, invented SPD.

## AI Pages and llms Files

This family includes `ai-brief.html`, `ai/product.json`, `ai/evidence.html`, `ai/evidence.json`, `llms.txt`, and `llms-full.txt`.

- **Purpose:** Provide controlled, machine-readable mirrors of current brand, product, evidence, use, and claim Truth.
- **Must Do:** Identify source-of-truth ownership, preserve claim boundaries, expose important canonical links, and update after approved source changes.
- **Must NOT Do:** Become an independent authority, preserve retired wording, compete with human pages for content ownership, or invent missing facts.
- **Primary CTA:** Machine retrieval of canonical human and structured sources.
- **Secondary CTA:** Follow canonical Product, Science, Evidence, Policy, or Campaign links.
- **Exit Goal:** An AI system produces a current, attributable, non-medical summary without resurrecting old positioning.
- **Required Content:** Current terminology, verified facts, usage boundaries, evidence status, prohibited claims, canonical links, update date.
- **Forbidden Content:** Unverified measurements, obsolete store/campaign state, independent marketing language, unsupported feature or outcome claims.

## Reviews

- **Purpose:** Own public, attributable product feedback and explain the boundary between experience and verified fact.
- **Must Do:** Present feedback accurately, identify moderation or verification rules, and link product questions to Products or FAQ.
- **Must NOT Do:** Turn testimonials into scientific proof, guarantee outcomes, or become a general product page.
- **Primary CTA:** Read or submit a product experience under the current review rules.
- **Secondary CTA:** Continue to Products or FAQ.
- **Exit Goal:** The visitor gains appropriate social proof without confusing experience with evidence.
- **Required Content:** Public feedback, submission rules, disclosure/boundary language, product link.
- **Forbidden Content:** Medical testimonials used as claims, fabricated reviews, product specifications owned elsewhere.

## AI Room Check

- **Purpose:** Help a visitor examine the current room-light environment as an optional supporting tool.
- **Must Do:** Complete the assessment, state its limits, protect submitted data, and route results to relevant educational or product owners.
- **Must NOT Do:** Replace Homepage, define Lume, diagnose a sleep condition, become a mandatory purchase gate, or compete as the primary product journey.
- **Primary CTA:** Complete the room-light assessment.
- **Secondary CTA:** Continue to Products, Science, or relevant guidance.
- **Exit Goal:** The visitor understands a room-light issue and knows the appropriate next page.
- **Required Content:** Assessment scope, result meaning, AI limitation, privacy/data context, relevant next links.
- **Forbidden Content:** Diagnosis, guaranteed sleep outcome, product-specific measurement inference from a photograph.

## Checkout

- **Purpose:** Complete the selected Shopify purchase securely while preserving attribution and current commercial terms.
- **Must Do:** Maintain selected package, price, creator attribution, discount behavior, policy access, and clear payment state.
- **Must NOT Do:** Teach the brand, introduce new product claims, or alter protected commerce logic through content cleanup.
- **Primary CTA:** Complete payment.
- **Secondary CTA:** Return to Products or consult current policy.
- **Exit Goal:** Successful purchase or an explicit, recoverable cancellation/failure state.
- **Required Content:** Accurate cart, price, attribution, policy access, secure state, confirmation path.
- **Forbidden Content:** Old PayPal/Indiegogo positioning presented as current, hidden price changes, unsupported urgency.

## Post-purchase

Post-purchase includes confirmation, account/orders, Manual, support, warranty, and contact surfaces.

- **Purpose:** Confirm ownership, reduce setup uncertainty, support safe use, and resolve service needs.
- **Must Do:** Confirm status, provide product access and instructions, and route order/support issues.
- **Must NOT Do:** Restart acquisition persuasion, upsell unsupported products, or hide operational information.
- **Primary CTA:** Complete the next ownership task.
- **Secondary CTA:** Access Manual, order status, policy, or support.
- **Exit Goal:** The customer can use Lume safely and knows how to obtain service.
- **Required Content:** Confirmation, order status, Manual, support and policy links, device/account information where applicable.
- **Forbidden Content:** New claims, unrelated campaign content, unverified product features.

---

# 4. Content Ownership Matrix

## Status definitions

- **P — PRIMARY:** Canonical consumer-facing owner. This page provides the most complete current version.
- **S — SECONDARY:** A short contextual summary is allowed. It must not compete with the owner.
- **L — LINK ONLY:** Mention only when necessary and route to the owner. A short label is allowed, not a teaching section.
- **F — FORBIDDEN AS A STANDALONE TOPIC:** Do not create a section or alternate complete version here. A legally necessary boundary or minimal identification may still appear.

Every content topic should have one primary human-page owner. AI files mirror owners; they do not become owners.

**PRIMARY does not mean exclusive.** It identifies the canonical consumer-facing owner and prevents a second complete version from growing elsewhere. Other pages may use a concise definition, short summary, contextual answer, or owner link when that information is necessary for the page's own visitor job. In particular, Homepage must define Lume briefly, Campaign must identify what it promotes, What-is-Lume must give a complete but concise definitional answer, FAQ may restate necessary facts inside accurate answers, and Science may explain Lume's relationship to general research and current evidence status.

## Acquisition and decision pages

| Content topic | Home | Products | Science | Campaign | What-is | About |
|---|---:|---:|---:|---:|---:|---:|
| Brand architecture | S | L | F | S | L | P |
| Product definition | S | P | L | S | S | L |
| Product difference | S | P | L | S | S | F |
| Product proof | S | P | L | S | L | L |
| Product-specific SPD | L | S | S | L | L | F |
| General research | L | L | P | L | L | F |
| Use cases | S | P | F | S | L | L |
| Hardware | S | P | F | S | L | L |
| Specifications | L | P | F | L | L | F |
| Founder story | S | L | F | L | F | P |
| FAQ content | F | F | L | L | L | F |
| Policies | L | L | F | L | F | F |
| Shipping | L | L | F | L | F | F |
| Checkout | L | S | F | S | L | F |
| Creator program | F | L | F | L | F | F |
| AI Room Check | L | L | F | S | L | F |

## Support, evidence, operational, and machine surfaces

| Content topic | FAQ | Manual | Policy | Evidence | Reviews | Room Check | Checkout | AI/llms | Creator/referral |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Brand architecture | F | F | F | F | F | L | F | S | L |
| Product definition | L | L | F | L | L | S | S | S | S |
| Product difference | L | F | F | L | F | L | F | S | S |
| Product proof | L | L | F | L | S | L | S | S | S |
| Product-specific SPD | L | F | F | P | F | F | F | S | L |
| General research | L | F | F | S | F | L | F | S | L |
| Use cases | S | P | L | L | L | S | F | S | S |
| Hardware | S | S | L | F | L | L | S | S | S |
| Specifications | L | S | L | F | F | F | S | S | S |
| Founder story | F | F | F | F | F | F | F | L | L |
| FAQ content | P | L | L | L | F | L | L | L | L |
| Policies | L | L | P | L | L | L | S | L | L |
| Shipping | L | L | P | F | F | F | S | L | S |
| Checkout | L | F | L | F | F | F | P | L | S |
| Creator program | L | F | L | F | F | F | S | F | P |
| AI Room Check | L | F | L | L | F | P | F | S | L |

## Ownership rules

1. Primary ownership controls where the complete version lives; it does not remove the minimum understanding needed on another legitimate entry page.
2. A secondary summary should normally be no more than one short section or approximately 30 words before linking to the owner.
3. Link-only content cannot introduce a new claim, new fact, new specification, or alternate definition.
4. Policy and operational facts must come from the operational owner even when summarized on Products or Campaign.
5. Product-specific SPD becomes primary Evidence content when real records exist; Science interprets it for consumers.
6. General research remains primary Science content; Evidence preserves citation and traceability detail.
7. Creator/referral logic remains a protected operational owner. Public pages may explain only user-visible terms confirmed by that system.

---

# 5. Current Duplication Audit

## Current page scale

| Page family | Current major sections | IA assessment |
|---|---:|---|
| Homepage EN/ZH | 12 | Too many owners combined into one journey |
| Products EN/ZH | 8 | Role is substantially correct and should become the canonical product owner |
| Science EN/ZH | 9 | Role is substantially correct; relationship with Evidence needs explicit governance |
| Campaign EN/ZH | 13 | Duplicates Homepage, Products, Science, FAQ, Room Check, purchase, and updates |
| What-is-Lume EN/ZH | 8 | Too broad for a short informational SEO landing page |
| About EN/ZH | 7 | Role is clear and substantially aligned |
| FAQ EN/ZH | 7 | Role is clear; duplication outside FAQ is the larger issue |
| Contact EN/ZH | 2 | Role is clear and minimal |
| Manual EN/ZH | 7 | Role is clear; factual usage parity is a separate content QA issue |
| Policy EN/ZH | 12–13 | Role is clear; current operational accuracy is a separate P0 issue |
| Evidence EN/ZH | 7 | Role is useful but overlaps Science in explanation and wording guidance |
| Reviews EN/ZH | 3 | Role is clear |
| Room Check EN/ZH | 4 | Role is clear as an optional supporting tool |
| AI/llms | Multiple mirrors | Role is clear, but source synchronization needs one governance path |

## Duplicate-content decisions

| Repeated subject | Current locations | Canonical owner | Other-page rule |
|---|---|---|---|
| Sleep-spectrum lamp definition | Homepage, Products, Campaign, What-is, FAQ, AI | Products | Homepage/Campaign use a short summary; What-is gives a concise definitional answer; FAQ restates facts when needed; AI mirrors the owner |
| Ordinary warm light difference | Homepage, Products, Campaign, What-is, Science | Products | Homepage and Campaign get a short summary; What-is gets one answer; Science explains spectrum without repeating sales comparison |
| Science bridge | Homepage, Products, Campaign, Science, What-is | Science | Homepage and Products may use one sentence; Campaign and What-is should link after minimal context |
| Research sources | Science, Evidence, AI Evidence, llms-full | Science for interpretation; Evidence for traceability | Human pages link to the appropriate owner; AI files mirror rather than independently curate |
| Product-specific evidence status | Products, Science, Campaign, Evidence, FAQ, AI | Evidence | Science interprets; Products summarizes; Campaign/FAQ link only when needed |
| Product proof and hardware | Homepage, Products, Campaign, What-is, FAQ, Manual, AI | Products for buying facts; Manual for operation | Homepage/Campaign select proof only; other pages link or answer a specific question |
| Use cases | Homepage, Products, Campaign, What-is, FAQ, Manual | Products for product fit; Manual for safe use | Homepage/Campaign summarize; FAQ answers questions; What-is links |
| FAQ modules | FAQ, Campaign, What-is | FAQ | Campaign and What-is keep only campaign-specific or definitional exceptions, otherwise link |
| Shipping and fulfillment | Homepage, Products, Campaign, FAQ, Manual, Policy, Checkout | Policy and current commerce system | Other pages show only a current summary and authoritative link |
| Brand and founder story | Homepage, About, Campaign | About | Homepage may orient; Campaign links unless the origin is directly relevant to the current campaign |
| Room Check | Homepage, Campaign, Science, What-is | Room Check | Supporting pages link only when the tool answers the visitor's current question |
| Purchase packages and checkout | Homepage, Products, Campaign, creator flows | Products and protected Checkout | Homepage links; Campaign may transact only when the campaign's current action requires it |

## Reduction rule

When duplicate content is removed, the non-owner should become either:

- **Link only**, when the visitor does not need the fact to understand the current page; or
- **A short summary of roughly 30 words**, when the fact is necessary to understand the current page before following the link.

No page should keep a full duplicate merely to avoid an extra click.

---

# 6. Navigation Philosophy

Navigation represents stable page responsibilities, not every available URL.

## Permanent primary navigation

- Home through the Owlnest brand mark
- Products
- Science
- About

Account, language, and purchase utilities may remain globally available without becoming content categories.

## Conditional primary navigation

Campaign belongs in primary navigation only when its lifecycle state and permanent-navigation role have been explicitly confirmed. This document does not decide either question. An ACTIVE campaign may be prominent; a PAUSED, ENDED, ARCHIVED, or NO ACTIVE CAMPAIGN state requires an intentional routing decision and must not retain an active label by inertia.

## Utility or footer navigation

- FAQ
- Contact
- Manual
- Evidence
- Reviews
- Order and Shipping Policy
- Disclaimer and other policies
- Account/support routes where appropriate

Contact may remain visible as a utility, but it does not need to compete with the core orientation/evaluation pages as a content category.

## In-content navigation only

- What-is-Lume, reached from informational search or contextual explanatory links
- AI Room Check, reached when room assessment is relevant
- Evidence, reached from Science or a verification claim
- Reviews, reached from product evaluation
- Manual, reached from product support and post-purchase paths
- Creator/referral surfaces, reached from attributed links or creator context

## Machine-discovery only

- `ai-brief.html`
- `ai/product.json`
- `ai/evidence.html`
- `ai/evidence.json`
- `llms.txt`
- `llms-full.txt`

These files need canonical links but do not belong in human primary navigation.

## Navigation rules

1. Navigation labels describe visitor tasks, not slogans.
2. EN and ZH must expose the same responsibility structure.
3. A page should not appear in primary navigation merely because it exists.
4. Support pages should return visitors to content owners rather than cross-linking every page to every other page.
5. Checkout and post-purchase routes prioritize task completion over site exploration.
6. A current campaign may be prominent; historical campaigns may not occupy permanent navigation under an active label.

---

# 7. SEO Strategy

SEO follows content ownership. No two pages should target the same search intent with equally complete content.

| Search intent / topic | Primary page | Supporting page | Pages that must not compete |
|---|---|---|---|
| Owlnest brand | Homepage | About | Products, Science, Campaign |
| Owlnest brand story | About | Homepage | Products, Science, FAQ |
| Nighttime living | Homepage | About | Products as a category owner |
| Sleep-spectrum lamp — commercial | Products | Homepage | Campaign, Science, FAQ |
| What is a sleep-spectrum lamp / What is Owlnest Lume | What-is-Lume | Products | Homepage and Campaign as full explainers |
| Nighttime lighting — informational | What-is-Lume | Science | Campaign and FAQ |
| Ordinary warm light vs sleep-spectrum lamp | Products | What-is-Lume | Homepage and Campaign as full comparison pages |
| Light spectrum and sleep / light at night research | Science | Evidence | Products and Campaign |
| Owlnest Lume evidence / citations / validation status | Evidence | Science | Homepage, Campaign, Reviews |
| Sleep environment / room-light assessment | AI Room Check | Science | Homepage as a full diagnostic page |
| Lume use, setup, charging, care | Manual | FAQ | Homepage, Campaign, About |
| Lume questions | FAQ | Products, Manual, Policy | Homepage and Campaign as FAQ collections |
| Lume shipping, returns, fulfillment | Policy | FAQ, Products | Homepage, Science, About |
| Lume reviews | Reviews | Products | Science and Evidence |
| Current campaign name or offer | Campaign | Products | Evergreen pages |

## SEO ownership rules

1. Products owns commercial category intent.
2. What-is-Lume owns definitional long-tail intent, not the full commercial category.
3. Science owns consumer research interpretation.
4. Evidence owns source and validation-status intent.
5. FAQ owns question-shaped long tails only when the answer is not better served by Manual or Policy.
6. Campaign targets only current campaign intent; it does not accumulate evergreen category content.
7. AI and llms files support machine understanding and must point to canonical human owners rather than compete with them.
8. Duplicate content must not be retained solely to repeat a keyword.

---

# 8. Traffic Strategy

Traffic should enter the page that owns the visitor's current intent.

| Channel | Best default landing | Alternate landing | Routing principle |
|---|---|---|---|
| Meta | Campaign for a current campaign; Products for product-specific creative | Homepage for broad brand/problem creative | Match the promise in the creative; do not force all paid traffic through Homepage |
| Instagram | Products for product demonstrations; About for founder/brand content | Campaign for launch content | Route image/video intent to the page that completes that story |
| Threads | What-is-Lume or Science | About for brand discussion | Conversational explanation should land on informational ownership, not a hard-sell duplicate |
| Google paid | Products for commercial terms; What-is for definitions; Science for research terms | FAQ or Policy for specific objections | One keyword intent, one landing owner |
| Google organic | Query-owning page from the SEO matrix | Supporting owner only when intent is mixed | Avoid Homepage as the universal organic answer |
| Reddit | Science, Evidence, What-is-Lume, or FAQ depending the question | Products only for explicit purchase intent | Lead with verifiable context and disclose product relevance |
| Referral | Attributed Products route | Current Campaign when the referral is campaign-specific | Preserve referral and discount attribution; avoid unnecessary intermediate pages |
| Influencer | Products for evergreen product endorsement | Campaign for a time-bound activation; About for founder content | Landing page must match what the creator actually discussed |
| Organic social | Products, About, Science, What-is, or Campaign | Homepage for broad brand introduction | Use the smallest page that completes the social post's promise |

## Traffic-routing rules

1. Homepage is a valid landing page, not the mandatory landing page.
2. Referral and influencer traffic must preserve protected attribution.
3. Evidence-seeking communities should not land on Campaign unless the discussion is specifically about that campaign.
4. Support and post-purchase traffic must not be routed back through acquisition content.
5. A campaign link must stop being the default when its operational state is no longer current.

---

# 9. Conversion Funnel

## Funnel model

```text
Entry
  ├── Homepage
  ├── Products
  ├── Campaign
  ├── What-is-Lume
  ├── Science / Evidence
  ├── FAQ / Policy / Reviews
  └── Referral / Creator route
          ↓
Product understanding
          ↓
Products — canonical evaluation
  ├── confidence branch → Science / Evidence / FAQ / Reviews / Policy
  └── purchase intent
          ↓
Protected Shopify Checkout
          ↓
Confirmation / Account / Manual / Support
```

## Core purchase path

```text
Relevant landing page
    → Product understanding
    → Product decision
    → Protected Shopify Checkout
    → Post-purchase support
```

The relevant landing page may be Homepage, Products, What-is-Lume, an attributed creator route, or a confirmed active Campaign. No single acquisition page is mandatory.

## Optional trust paths

- Science
- Evidence
- FAQ
- Reviews
- About
- AI Room Check

These paths may increase confidence or resolve an uncertainty, but they are not mandatory purchase stages. AI Room Check is an optional supporting tool; it must not block purchase or compete at equal weight with the main Buy action.

## Funnel responsibility and loss risks

| Transition | Required visitor decision | Largest likely loss reason | Page responsible for improvement |
|---|---|---|---|
| Entry → Homepage understanding | “This problem is relevant and Lume is a distinct product.” | Lume looks like an ordinary night light or the page asks the visitor to learn too much | Homepage |
| Homepage/What-is → Products | “I want to evaluate this product.” | The visitor already received a duplicate product page and sees no reason to continue | Homepage or What-is-Lume |
| Products → confidence or purchase | “The difference, product reality, and use fit are credible.” | Ordinary warm-light alternative remains unresolved; proof, specs, or fit are unclear | Products |
| Products → Science/Evidence | “I know what evidence exists and what is pending.” | Science looks compulsory, overlong, or contradicts product visuals | Products, Science, Evidence |
| Science/Evidence → Products | “The boundaries increase trust rather than end the journey.” | Research becomes a dead end or pending evidence is mistaken for deception | Science and Evidence |
| Products/Campaign → Checkout | “Commercial and operational terms are acceptable.” | Shipping, fulfillment, policy, price, or campaign status is inconsistent | Products, Campaign, Policy, protected commerce owner |
| Checkout → completed purchase | “I can pay securely without losing package or attribution.” | Checkout friction, discount/referral loss, unclear payment state | Protected Shopify/referral systems |
| Purchase → successful use | “I know what happens next and how to use Lume safely.” | Missing confirmation, unclear setup, outdated use guidance, weak support path | Post-purchase, Manual, Account, Contact |

## Funnel rules

- Science can strengthen a purchase but must never be a mandatory prerequisite.
- FAQ, Reviews, and Policy are objection-resolution branches, not sequential funnel steps for every visitor.
- Campaign may shorten the path to Checkout only when campaign status and commercial facts are current.
- A visitor should return from a supporting page to the page that owns the next decision.

---

# 10. Freeze Boundary

## Governance tiers

| Tier | Assets | Change frequency | Change rule |
|---|---|---|---|
| Locked foundation | Brand Truth, Product Truth | Rare; only when an approved brand/product fact changes | Update both Truth files coherently before public content |
| Historical governance | Decision Ledger | Append or revise only when a cross-conversation decision changes status | Never rewrite history to make an old decision look current |
| Site governance | This IA document | Infrequent; only when page roles, navigation philosophy, or business journey changes | Do not change it to justify an isolated page edit |
| Stable evergreen | Homepage, Products, About, What-is-Lume | Deliberate optimization, not continuous rewriting | Preserve page ownership and Truth; evaluate changes against conversion evidence |
| Evidence-growing | Science, Evidence | Add when real research, measurement, method, or limitation changes | Add evidence without redefining product Truth or overstating results |
| Operational support | FAQ, Manual, Contact, Reviews | Update when verified questions, use instructions, support routes, or review operations change | Keep factual parity and link to owners |
| Policy-controlled | Disclaimer, order/shipping, Shopify policies | Only when legal or operational facts change | Require current operational confirmation; avoid promotional edits |
| Fast-moving | Campaign | May update frequently while active | Every update must state current status and must not become evergreen product ownership |
| Machine mirrors | AI pages, JSON, llms | Immediately after an approved source change | Mirror owners; never lead them |
| Protected commerce | Shopify, referral, discount, PayPal legacy, checkout | Only by explicit authorized commerce work | Do not change during content or IA cleanup |
| Post-purchase systems | Account, order, confirmation, support | Only when ownership/support workflow changes | Prioritize continuity and customer access |

## Freeze rules

1. Brand Truth should almost never change for page-level optimization.
2. Products may improve gradually but remains the product owner.
3. Campaign may move quickly but cannot redefine Owlnest or Lume.
4. Policy changes are operational/legal changes, not copy experiments.
5. Science may gain evidence; it cannot convert general research into Lume validation.
6. Evidence may gain reports and methods; pending status remains until records exist.
7. AI/llms files update after human and governance owners, never before them.
8. Protected systems remain outside normal content work.

---

# 11. Architecture Principles

1. Every page has one primary visitor job.
2. Every content topic has one canonical human-page owner.
3. Primary ownership is canonical, not exclusive; supporting pages retain the concise context required for their own job.
4. Homepage establishes brand, problem, real product, definition, difference, trust, and a purchase path without becoming complete copies of Products, Science, FAQ, Campaign, Manual, or Policy.
5. Products owns Lume definition, difference, verified product facts, fit, proof, and purchase decision.
6. Science explains why nighttime light matters, builds trust, and routes contextually without becoming a second Products page or inventing product evidence.
7. Evidence owns traceability, source integrity, validation status, methods, and limitations.
8. Campaign owns one current campaign action; it does not become a permanent duplicate of Products.
9. What-is-Lume answers a definitional search intent and then routes onward.
10. FAQ resolves objections through accurate answers without rebuilding the full sales narrative.
11. Manual owns operation and safety; minimal identification is allowed, but it does not carry the full brand or acquisition narrative.
12. About owns brand origin, people, credibility, and future territory; it does not own product specifications.
13. Contact owns inquiry routing; it does not become FAQ or a store-location page.
14. Policy owns commercial and legal terms; it never carries promotional urgency.
15. Reviews are experience evidence, not scientific or clinical evidence.
16. AI Room Check is optional support, not a diagnostic or required funnel gate.
17. Checkout and creator attribution are protected operational systems, not content-cleanup targets.
18. EN and ZH share architecture, facts, and boundaries even when wording is localized naturally.
19. SEO intent follows content ownership; keywords never justify duplicate pages.
20. No page or machine-readable file may violate Truth or restore a Ledger decision marked RETIRED.

---

# Appendix A. Current IA Problems — Top Ten

1. Homepage is an everything-page: 12 sections cover product definition, comparison, Science, product proof, use, audience, Room Check, purchase, and final persuasion.
2. Campaign duplicates Homepage and Products while also carrying Science, Room Check, multiple update forms, purchase, shipping, and FAQ responsibilities.
3. What-is-Lume is too broad for a short SEO explainer and repeats product facts, comparison, fit, routing, and FAQ.
4. The sleep-spectrum lamp definition appears across too many pages without Products functioning visibly as the canonical owner of the complete consumer version.
5. Science and Evidence both explain research, evidence levels, validation status, wording, and sources without an explicit consumer-interpretation versus traceability boundary.
6. FAQ content is repeated as mini-FAQ modules on Campaign and What-is-Lume.
7. Shipping and fulfillment information is distributed across Homepage, Products, Campaign, Manual, Policy, Checkout, and machine-readable material, increasing drift risk.
8. AI Room Check appears in multiple persuasion paths and can behave like a parallel primary funnel instead of an optional supporting tool.
9. Primary navigation is inconsistent: newer page families include Campaign while What-is, FAQ, Manual, Policy, and Evidence templates omit it.
10. AI Brief, AI Evidence, Product JSON, Evidence JSON, llms, and llms-full repeat Truth in separately maintained forms without a documented single synchronization workflow.

# Appendix B. Recommended Modification Order

This is an ownership order, not authorization to edit.

1. Confirm and freeze this IA as the page-responsibility baseline.
2. Resolve current P0 operational contradictions such as stale fulfillment information through the Policy/Campaign owners.
3. Focus Homepage on brand impression, the nighttime-light problem, real Lume introduction, concise definition and difference, trust entry points, and a clear purchase path; move owner-level detail to Products, Science, FAQ, Manual, or Policy.
4. Confirm Products as the canonical product-decision owner without reopening its brand or science scope.
5. Redefine Campaign around one current campaign state and remove evergreen duplication.
6. Compress What-is-Lume into a true definitional SEO landing page.
7. Formalize the Science/Evidence boundary and correct source routing.
8. Replace embedded FAQ, shipping, use, and policy duplicates with owner links or short summaries.
9. Align global navigation and EN/ZH route parity with this architecture.
10. Align SEO metadata and machine-readable files to the final ownership map, then run cross-page QA.

# Appendix C. Pages That Do Not Need IA Redefinition

The following page families already have a clear architectural purpose and can remain structurally unchanged from an IA perspective:

- Products EN/ZH — canonical product owner is already visible in its content structure.
- Science EN/ZH — consumer science role is substantially correct.
- About EN/ZH — brand role is substantially correct.
- FAQ EN/ZH — question-resolution role is substantially correct.
- Contact EN/ZH — contact role is clear and minimal.
- Manual EN/ZH — operation and safety role is clear.
- Reviews EN/ZH — social-proof role is clear.
- AI Room Check EN/ZH — optional assessment role is clear.
- Checkout and post-purchase surfaces — operational role is clear and protected.
- AI and llms surfaces — machine-mirror role is clear, although synchronization governance must improve.

“No IA redefinition” does not mean “no factual correction.” Policy dates, source URLs, usage parity, and other previously identified content defects still require separate authorized work.

# Appendix D. Pages Most in Need of Responsibility Redefinition

1. **Homepage:** Highest priority. It currently owns too many stages of the journey.
2. **Campaign:** Highest duplication risk and highest operational-drift risk.
3. **What-is-Lume:** Must become a concise definitional landing page rather than another product journey.
4. **Evidence relationship:** Evidence itself can remain, but its boundary with Science must become explicit in links, summaries, and SEO ownership.
5. **Global navigation system:** Page visibility is inconsistent across templates and does not yet reflect one shared IA.

# Appendix E. Audited Source Families

This version was created after reviewing:

- Homepage EN/ZH
- Products EN/ZH
- Science EN/ZH
- Campaign EN/ZH
- What-is-Lume EN/ZH
- About EN/ZH
- FAQ EN/ZH
- Contact EN/ZH
- Manual EN/ZH
- Disclaimer and order/shipping policy EN/ZH
- Evidence EN/ZH
- Reviews EN/ZH
- AI Room Check EN/ZH
- Checkout success/cancel and post-purchase account/support surfaces
- `ai-brief.html`
- `ai/product.json`
- `ai/evidence.html`
- `ai/evidence.json`
- `llms.txt`
- `llms-full.txt`
- sitemap and current header/footer route patterns

## Open and Blocked Decisions

These items record unresolved operational or implementation choices. They are not permission to infer or publish an answer.

### Current real fulfillment status

- **Decision needed:** Confirm the current order-processing, inventory, and fulfillment state.
- **Current known facts:** Shopify is the current protected checkout; the historical `2026-07-20` fulfillment date has passed and has not been reconfirmed here.
- **Why it matters:** Fulfillment wording affects Campaign, Products, Policy, FAQ, checkout confidence, and customer expectations.
- **Required owner:** Owlnest operations / commerce owner.
- **Status:** BLOCKED pending current operational confirmation.
- **Prohibited assumption:** Do not carry forward an old fulfillment date or infer readiness from the presence of a checkout button.

### Current Campaign lifecycle state

- **Decision needed:** Confirm whether Campaign is ACTIVE, PAUSED, ENDED, ARCHIVED, or NO ACTIVE CAMPAIGN.
- **Current known facts:** A Campaign page exists and prior implementation has used `Available Now`; historical preorder and Indiegogo states are retired.
- **Why it matters:** The state controls valid urgency, CTA, operational detail, routing, and whether the page should behave as an active acquisition surface.
- **Required owner:** Owlnest campaign and operations owner.
- **Status:** BLOCKED pending an explicit current state.
- **Prohibited assumption:** Do not infer ACTIVE from the page's existence, navigation placement, old copy, or a prior campaign decision.

### `Available Now` accuracy

- **Decision needed:** Confirm whether `Available Now` matches actual inventory and fulfillment capability.
- **Current known facts:** The phrase appears in current implementation history, but inventory and fulfillment have not been verified by this governance review.
- **Why it matters:** An inaccurate availability claim creates purchase, policy, trust, and consumer-protection risk.
- **Required owner:** Owlnest inventory / fulfillment owner.
- **Status:** BLOCKED pending inventory and fulfillment confirmation.
- **Prohibited assumption:** Do not equate an enabled Shopify checkout with immediately available inventory.

### Product-specific SPD publication timing

- **Decision needed:** Decide when qualified Lume-specific SPD and same-condition warm-lamp comparison records are ready for publication.
- **Current known facts:** Product-specific SPD, comparison data, conditions, and related metrics remain pending.
- **Why it matters:** Publication affects Products, Science, Evidence, FAQ, SEO, and claim boundaries.
- **Required owner:** Product / engineering evidence owner with compliance review.
- **Status:** OPEN.
- **Prohibited assumption:** Do not create a date, chart, metric, or positive result before complete traceable records exist.

### Homepage editorial implementation method

- **Decision needed:** Choose a maintainable implementation method for the approved Homepage responsibility and editorial hierarchy.
- **Current known facts:** The current page has overlapping responsibilities; prior PR #5 principles may be useful, but its large override implementation is not approved for direct adoption.
- **Why it matters:** The method affects maintainability, responsive behavior, bilingual parity, and regression risk.
- **Required owner:** Website design and engineering owner.
- **Status:** OPEN.
- **Prohibited assumption:** Do not treat this IA as a wireframe or authorization for a large CSS override layer.

### Science versus Evidence indexing and navigation

- **Decision needed:** Confirm final indexing, canonical-link, and navigation treatment for consumer Science versus source-level Evidence.
- **Current known facts:** Science owns consumer interpretation; Evidence owns traceability, citations, validation status, methods, and limitations. Both pages currently exist and may link to each other.
- **Why it matters:** The decision affects discoverability, duplicate search intent, source access, and machine-readable routing.
- **Required owner:** Website / SEO owner with science-content review.
- **Status:** OPEN.
- **Prohibited assumption:** Do not merge the pages, hide Evidence, or make both pages compete for identical intent without an explicit decision.

### Campaign in permanent primary navigation

- **Decision needed:** Decide whether Campaign belongs in permanent primary navigation for each lifecycle state.
- **Current known facts:** Campaign currently exists, but its present lifecycle state has not been confirmed by this document.
- **Why it matters:** Permanent navigation implies an evergreen responsibility that may conflict with a time-bound campaign lifecycle.
- **Required owner:** Brand / growth owner with website governance approval.
- **Status:** OPEN.
- **Prohibited assumption:** Do not preserve or remove Campaign from primary navigation merely because of the current implementation or historical placement.

### AI and llms synchronization workflow owner

- **Decision needed:** Assign the owner and trigger workflow for keeping AI pages, JSON, `llms.txt`, and `llms-full.txt` synchronized after approved source changes.
- **Current known facts:** These files are machine-readable mirrors, not independent authorities, and currently require a documented synchronization path.
- **Why it matters:** Unsynchronized mirrors can restore retired positioning, stale operational facts, or unsupported claims.
- **Required owner:** Named website content-governance or AI-readable-content owner.
- **Status:** OPEN.
- **Prohibited assumption:** Do not assume each mirror updates automatically or allow a machine-readable file to lead a Truth or human-page change.
