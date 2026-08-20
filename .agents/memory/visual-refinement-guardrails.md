---
name: Visual refinement guardrails
description: Durable rules for shared layout CSS and image-sequence loading on the Owlnest site.
---

Shared visual styles may define typography, color, and accessibility tokens, but structural layout rules must be scoped to a named page or component hook. Large local image sequences must use viewport-aware sampling and a small progressive preload window rather than eagerly loading every frame.

**Why:** Broad structural selectors collapsed distinct pages into the same centered template and could silently restructure unrelated routes. Loading the complete homepage frame set at once also created an excessive first-visit transfer.

**How to apply:** When changing shared CSS, avoid generic selectors that alter grid display, order, widths, margins, or alignment across every section. When changing the homepage sequence, preserve direct local asset paths while keeping initial and nearby-frame loading bounded; verify representative English and Traditional Chinese pages at desktop and narrow widths.