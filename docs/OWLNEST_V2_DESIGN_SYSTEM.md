# OWLNEST V2 — Intervals

Visual implementation brief · 2026-10-18 · baseline `557ae712`

## Direction and evidence

**Intervals**: space between activities, light and darkness, a question and an answer. Express this through an offset editorial grid, uninterrupted image fields, generous but purposeful margins, and transitions between warm paper and ink. Not a physiological diagram or a claim of product effects.

Production before-captures: Home, About, Products and Lab, EN/ZH, 390 × 844 and 1440 × 900. The audit found useful photography and concise copy, but repeated half-and-half product layouts, alternating equal-weight Home bands, six similar text-led About blocks, and a Lab page whose sections read as independent summaries. The existing navigation and protected commerce remain outside the redesign.

## Layout blueprint (established before implementation)

| Page | Desktop composition and sequence | Mobile composition | Primary actions |
|---|---|---|---|
| Home | Preserve the 96-frame cinematic sky; place the headline high-left and the product path low-right, without a second logo. Follow with a paper manifesto and a quiet margin note. Introduce Lume early in an offset photographic spread: smaller unlit portrait, larger amber portrait, with product identity between them. Principles become an editorial definition list alongside one oversized thesis, not four cards. Future directions become a stepped typographic sequence; research is a compact index; close with purchase/About. | Sky, short headline and both actions within the first screen. Product identity precedes a staggered pair of uncropped portraits, not a miniature desktop two-column grid. Principles use a heading rail and short entries; directions form a readable vertical progression. | Our Philosophy / Shop Lume; US$119 regular price; Sleep Lab / Program / Science / Evidence |
| About | Paper opening with a large left-aligned title and right-offset introduction. Put the true Phu Quoc origin beside the first large historical drawing, rather than postponing both images to a gallery. Dark interlude for natural, low-effort design. Second historical drawing and Lume story form a reverse, unequal spread. Finish with the qualified ambition. | Title followed by introduction; first drawing becomes the visual lead into the origin. Later drawing is inset, with a different scale. Retain both exact historical disclaimers. | Explore Lume / Explore Sleep Lab |
| Products | A 7:5 image-led opening with purchase information alongside; preserve exact price and anchor. A narrow nighttime-use note bridges into a reversed material/detail spread, with the close-up larger than the specs. Science/evidence become a compact reading margin. Size and package are separate unequal compositions instead of equal cards. Policy/support links immediately precede the untouched purchase section. | Product title, image, value, price and purchase action use explicit grid areas; image remains large enough to show the body/base. Price/action must stay near the first screen. Compact details, portrait scale image, then landscape package image. | Shop Lume → existing #buy; verified shipping/returns/support |
| Lab | Ink journal masthead and oversized Sleep Lab title; concise framework introduction. Paper research spread places the four questions in a wide text column and honest-feedback principle in the margin. The Program becomes a distinct oversized typographic feature with method/CTA, no fake diagram. End with sources and explicitly future research directions. | Short masthead, questions at readable scale, feedback separated by space rather than cards. Program number/title and CTA form a compact feature; sources are simple links. | Existing Science / Evidence / Program / About |

## Shared rules

- Scope tokens and components to `.ow-v2`; never override the shared header, footer, consent UI or protected `#buy`.
- Palette: warm paper `#eee9df`, charcoal `#202420`, muted ink `#565b54`, night `#111a24`, light text `#eee9df`, amber `#e5b565` for product/action emphasis. No decorative glow or repeated gradients.
- Existing licensed delivery: Playfair Display / Noto Serif TC for display; Manrope / Noto Sans TC with native system fallbacks for body. No new font family or third-party font dependency.
- 12-column desktop grid, 20–104px fluid gutters, maximum outer content width 1600px. Unequal 5:7 and 7:5 spreads. Mobile uses explicit grid placement, inset images and independent ordering, not a blanket stacked layout.
- Display type uses fluid scales; body at least 16px, line-height 1.65–1.8. Chinese uses wider line-height, zero forced tracking and natural phrase boundaries. Never force Lume uppercase.
- Images: square corners, intrinsic aspect ratios, explicit dimensions. Preserve exact approved paths and family allocation. No filters, distortion, AI edits or new product assets.
- Actions: one quiet solid action plus underlined editorial links; minimum 44px height. Visible keyboard outline. Existing global menu interaction remains intact.
- Motion: retain the original Home engine. No new JS animation, scroll hijacking or content hidden behind entrance effects. Reduced-motion preferences remain supported.
- Existing SEO, structured data, research/claims boundaries, purchase and form integrations stay intact.

## Implementation details

- `assets/css/owlnest-v2.css` is an opt-in content system for eight HTML documents, not a global stylesheet replacement. Existing navigation, footer and consent styles/behaviors are retained.
- Six approved photos/archive images have three responsive WebP derivatives each (480/960/1440 naming; archive maximum actual width 1254). Quality 92, intrinsic aspect ratio, EXIF orientation only; no cropping, recoloring, generative edits or enlargement. Original paths remain as `src` fallbacks and original files are unchanged. `srcset` selects only same-family derivatives.
- Home's two photos use independent mobile inset widths. Products switches from a desktop 7:5 opening to title → portrait → value/price/action. About moves the archive into the story rather than collecting both images at the end. Lab removes the numbered question containers and joins the honest-feedback statement to the questions.
- Buttons have 48px minimum height; editorial links 44px. New focus outlines are 2px with 5px offset. Reduced-motion removes the new 160ms hover transitions; the original Hero already uses its reduced-motion branch.
- Existing Google Fonts and icon-font origins receive early connection hints. No font, framework or JavaScript dependency is added to the site.
- Final visual refinements include balanced 320px Home heading breaks, a two-column mobile product/CTA row, explicit Chinese display-family selection, and readable Lab list type independent of legacy list rules.
- See `qa/owlnest-v2/README.md` for measured results and limitations; `qa/owlnest-v2/index.html` provides the before/after screenshot gallery.

## Imagery system and gaps

| Family | Approved assets / purpose | Direction for an additional commissioned shoot (not implemented) |
|---|---|---|
| Home | Existing sky frames; unlit wooden-base portrait; amber nighttime portrait | Real lived-in space at two natural times, camera locked, off-centre light through a window; wide 16:9 plus portrait 4:5, clear negative space. No implied human effect. |
| About | Two founder-supplied historical design images, shown as archive, not present specs | Documentary Phu Quoc light/shoreline and real design process; restrained daylight, paper/wood textures, no invented founder/research scene. |
| Products | Existing glowing hero, close-up, scale reference and package contents | Color-calibrated silicone/wood macro, accurate base and USB-C details, actual package flat lay on neutral stone; 4:5 and wide crops with full product edges. |
| Lab | No content photos | Keep typographic until authentic, consented research documentation exists. Never substitute stock laboratory imagery. |

Use only repository assets explicitly approved by the owner. No external licensed imagery has been added; repository provenance does not establish rights for unrelated assets. The present package/scale photos contain practical documentation backgrounds and limit the photographic polish possible without a new shoot.

## Release gates

Before/after screenshots for all eight pages; 320/390/430/768/1440/1920 widths; no clipping, broken image, horizontal overflow or blocked CTA. Check keyboard, reduced motion, language, menu, footer, form destination and existing purchase entry. Hash protected commerce/scripts and original typography.css. Run HTML/JSON/JS/resource checks, accessibility scan and lab performance sampling. Lab results are not real-user p75 Core Web Vitals or proof of full WCAG conformance. Record actual results separately before release.
