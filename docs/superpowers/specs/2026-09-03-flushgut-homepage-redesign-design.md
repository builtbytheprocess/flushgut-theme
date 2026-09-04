# FlushGut Homepage Redesign — Design Spec

**Date:** 2026-09-03
**Branch:** `redesign/brown-kraft-2026`
**Source of truth:** `G:\My Drive\Businesses\FlushGut\Updated Website\FlushGut Website.pdf`
**Store:** `70dz4v-wt.myshopify.com` → flushgut.com · Theme "FlushGut Theme" (Dawn 15.4.1), id `160927973605`

---

## 1. Goal

Replace the live magenta/purple FlushGut homepage with the brown/kraft comp, section for section,
copy for copy. The comp is a single Figma export: **3840 × 9958 px @2x = 1920 × 4979 CSS px**.

Approved constraints from the client (Jared, 2026-09-03):

1. **Copy is reproduced verbatim.** Only typographic errors are corrected (§7). No rewriting,
   no "improving", no reordering of messaging.
2. **All three formats are built.** Jelly is live and buyable. Capsule and Gummy render in the
   comp's exact layout but non-purchasable until the products exist in Shopify.
3. **The sections absent from the comp are deleted** from the homepage.
4. **Nothing ships to the live theme.** Work lands on an unpublished dev theme behind a preview URL.

## 2. Non-goals

- Product detail pages, cart, checkout, collection pages (homepage only).
- New marketing copy, positioning, or CTA rewrites.
- Creating the Capsule and Gummy products in Shopify (client's call; the theme is ready for them).
- Migrating the deleted sections onto other pages (possible later; code is preserved in git).

---

## 3. Measured section map

Boundaries sampled from the comp's left-edge background color. All values in **CSS px** (comp ÷ 2).

| # | Section | y-range | Height | Background |
|---|---------|---------|--------|------------|
| 0 | Announcement topbar | 0–40 | 40 | `#442E17` |
| 1 | Header (transparent, over hero) | 40–~95 | — | none |
| 2 | Hero | 40–592 | 552 | photo `hero-wood.png` |
| 3 | Values bar | 592–682 | 90 | `#442E17` |
| 4 | Buy box + Sustainability (2-col) | 682–1128 | 446 | `#DEC6A6` / photo |
| 5 | Gut symptoms | 1128–1730 | 602 | kraft texture |
| 6 | Benefits (5 cards) | 1730–2230 | 500 | `#442E17` |
| 7 | Fiber gap (2-col + without/with) | 2230–3028 | 798 | `#EFE1CC` / photo |
| 8 | Doctor video | 3028–3430 | 402 | `#947751` / photo |
| 9 | Testimonials (4 cards) | 3430–4030 | 600 | `#271705` texture |
| 10 | Final product grid | 4030–4830 | 800 | `#DEC6A6` |
| 11 | Footer | 4830–4979 | 149 | `#442E17` |

---

## 4. Brand token layer

New snippet `snippets/fg-brand-tokens.liquid`, included once from `layout/theme.liquid`,
before all section styles. Every section consumes these variables; **no section hardcodes a hex value.**

```css
:root {
  --fg-espresso:  #442E17;  /* dark sections, footer, topbar, primary buttons */
  --fg-ink:       #291905;  /* testimonial ground, deepest text */
  --fg-kraft:     #DEC6A6;  /* primary light background */
  --fg-cream:     #EFE1CC;  /* lighter panels, fiber-gap left column */
  --fg-caramel:   #947751;  /* accent — "IT'S NOT IN YOUR HEAD", doctor band */
  --fg-on-dark:   #EFE1CC;
  --fg-on-light:  #442E17;

  --fg-font-display: 'Archivo', system-ui, sans-serif;  /* 600/700/800 */
  --fg-font-body:    'Archivo', system-ui, sans-serif;  /* 400/500 */
  --fg-maxw: 1440px;
}
```

**Typography.** The comp uses **Archivo SemiBold** for display and **Acumin Variable Concept**
(Adobe, not licensable for web here) for body. Archivo is a near-identical grotesque and is free
on Google Fonts — it serves both roles. Loaded with `font-display: swap`, weights 400/500/600/700/800,
subset `latin`. Display headlines are set tight: `letter-spacing: -0.01em`, `line-height: 0.95`.

Rationale: a single token file is what stops magenta from surviving in overlooked corners, and makes
any future palette change a one-file edit rather than a 12-section sweep.

---

## 5. Assets

### 5.1 Photography — extracted from the PDF at native resolution

| File | Native px | Used by |
|------|-----------|---------|
| `fg-hero-wood.png` | 3840×1104 | Hero background (products on wood slice) |
| `fg-sustainability-hands.png` | 2384×896 | §4 right panel (seedling in hands) |
| `fg-texture-kraft.png` | 3840×1000 | §5 background (tiles horizontally) |
| `fg-torso.png` | 10670×4000 | §7 right panel (without/with) |
| `fg-texture-espresso.png` | 7000×2883 | §9 background |
| `fg-doctor-still.png` | 3840×800 | §8 background (office + monitor) |
| `fg-doctor-stein.png` | 1254×1254 | §8 byline headshot |
| `fg-tester-aria.png` | 334×334 | §9 card 1 |
| `fg-tester-marcus.png` | 334×334 | §9 card 2 |
| `fg-tester-jennifer.png` | 334×334 | §9 card 3 |
| `fg-tester-michael.png` | 334×334 | §9 card 4 |
| `fg-pack-capsule.png` | 2048×2048 | §4, §10 (transparent) |
| `fg-pack-gummy.png` | 2048×2048 | §4, §10 (transparent) |
| `fg-pack-jelly.png` | 2000×2000 | §4, §10 (transparent) |

Delivery: uploaded to **Shopify Files** via the existing custom-app token
(`read_files`/`write_files` confirmed working), referenced by CDN URL. Large photos are resized to
a 2560px-wide cap and served with `srcset` at 1×/2× plus explicit `width`/`height` to prevent CLS.
The four headshots already carry transparent circular masks — kept as-is.

### 5.2 Icons — extracted as vector

~45 line icons across topbar, hero badges, values bar, symptoms, benefits, fiber-gap, buy box, footer.
All are **live vector paths in the PDF** (verified: 385 drawing objects; a cropped export of the
five symptom icons yielded 1281 clean paths). Extraction: crop the page to each icon's bounding box,
export SVG, strip embedded `<image>` elements, normalize to a 24×24 viewBox with `stroke: currentColor`.

Inlined via `snippets/fg-icon.liquid` (`{% render 'fg-icon', name: 'turtle' %}`) so icons inherit
section color and cost zero network requests.

---

## 6. Sections

Each is a self-contained `sections/*.liquid` with a scoped `<style>` block — matching the existing
theme convention — plus a `{% schema %}` exposing text and image settings to the theme customizer.

### Built new / rewritten

| File | Replaces | Notes |
|------|----------|-------|
| `custom-announcement.liquid` | announcement bar **+ absorbs `custom-clinician-trust`** | 4 trust items, icons, `#442E17` |
| `custom-hero.liquid` | **rewritten from a flat PNG to real HTML** | See §6.1 |
| `custom-values-bar.liquid` | *(new)* | 5 icon + label items |
| `custom-buy-box.liquid` | rewritten | See §6.2 |
| `custom-sustainability.liquid` | *(new)* | Right half of the §4 row |
| `custom-gut-symptoms.liquid` | restyled | Kraft texture, speech-bubble callout, 5 icons |
| `custom-benefits-row.liquid` | restyled | 5 outlined cards on espresso |
| `custom-fiber-gap.liquid` | `custom-problem.liquid` | 2-col + without/with split over photo |
| `custom-doctor-video.liquid` | `custom-ingredient-science.liquid` | Video still + byline |
| `custom-social-proof.liquid` | restyled | 4 testimonial cards, 4.8 rating block |
| `custom-final-cta.liquid` | rewritten | Ghosted wordmark + 3 product cards |
| `sections/header.liquid` | restyled | Transparent over hero, new nav, Login/Cart |
| `sections/footer.liquid` | restyled | Espresso, 2 nav columns, newsletter |

### Removed from `templates/index.json`

Four sections are dropped outright — `custom-ingredient-scroll` (22 Active Ingredients),
`custom-how-to` (Tear. Eat. Go.), `custom-format-diff`, `custom-glp1-bridge`. A fifth,
`custom-clinician-trust`, is not dropped but **absorbed**: the comp serves its four trust claims
through the new topbar and values bar instead of a standalone strip.

The `.liquid` files are **left in the theme** (unreferenced) so the content survives in git and can be
placed on another page later without rebuilding.

### 6.1 Hero

The current hero is a single `fg-hero-desktop.png` with a mobile twin — the reason the page has no
indexable headline and no real mobile layout. It is rebuilt as HTML:

- `fg-hero-wood.png` as a `background-image`, `center/cover`, min-height 552px.
- Left column: eyebrow `CAN'T GO?` · `<h1>` **FlushGut** (two-tone: `Flush` espresso, `Gut` caramel) ·
  subhead · 4 icon badges (Clinically Proven Ingredients / GLP-1 Friendly / Gentle Controlled Relief* /
  Great Tasting) · primary CTA `START MY ROUTINE` · clinician trust cluster.
- Center: 4 stacked callout cards with SVG connector arrows pointing right at the packshot.
- Right: the packshot is part of the background photo (not a separate layer in the comp).

### 6.2 Buy box — live product data

Three format cards (Jelly / Gummy / Capsule). **Each card takes a `product` picker in the schema.**
The card renders live `product.title`, `product.price`, `product.compare_at_price`, the pack-size
metafield, and the Subscribe & Save discount read from the product's selling plan group — so a price
can never go stale in markup.

- **Card with a product assigned and available** → radio + price + working Add-to-cart / subscribe.
- **Card with no product assigned** → comp layout preserved, price from schema default,
  button rendered `disabled` with a `Coming Soon` label.

Current store state: **Jelly** maps to the live product (`flushgut-orange` / `flushgut-berry` /
`flushgut-orange-and-berry-combo-pack`, `$37.95`, selling plan group `4295131365`
"12 Week Subscription Combo Pack"). **Gummy and Capsule have no product and ship disabled.**

Known discrepancy, resolved by live data: the comp's Jelly is a *15-packet bag at $85.99/$59.99*;
the live Jelly is a *6-packet box at $37.95/$29.99*. The card displays whatever Shopify holds.
The comp's `$37.99 / $29.99 / $85.99 / $59.99` exist only as schema defaults for the disabled cards.

---

## 7. Copy corrections

Verbatim reproduction, with these — and only these — fixes:

| Comp | Corrected |
|------|-----------|
| `REVIEWED BY 200+ CLINICIAN` | `REVIEWED BY 200+ CLINICIANS` |
| `Ships monthy, pause or cancel anytime.` (×3) | `Ships monthly, pause or cancel anytime.` |
| `and I feel increcible.` | `and I feel incredible.` |
| `the effects shows up everywhere` | `the effects show up everywhere` |
| `Prebiotics fiber and probiotic strains` | `Prebiotic fiber and probiotic strains` |
| `Enter you email` | `Enter your email` |
| `Verified beta tester - 3 month` / `2 month` | `3 months` / `2 months` |
| `-` used as an em dash in body copy | `—` |

---

## 8. Responsive behavior

The comp is desktop-only at 1920px. Breakpoints: **1440 / 1024 / 768 / 480**.

| Section | ≤1024 | ≤768 |
|---------|-------|------|
| Hero | Callouts drop to 2×2 below headline | Packshot crops to a top band; copy stacks beneath; CTA full-width |
| Values bar | 5 → 3 across | 5 → 2 across, wraps |
| Buy box + Sustainability | Stacks vertically | Format cards stack; Sustainability photo becomes a 16:9 banner |
| Symptoms / Benefits | 5 → 3 across | 5 → 2 across |
| Fiber gap | Copy above, without/with panel below | Stat trio becomes a 3-row list |
| Testimonials | 4 → 2 across | Horizontal swipe carousel, scroll-snap |
| Final grid | 3 → 3 (narrower) | 1 across, ghosted wordmark scales to viewport |

Ghosted `FlushGut` wordmark in §10 is rendered as **text**, not an image, so it scales cleanly.

---

## 9. Nav and page dependencies

Comp nav: `HOME · SHOP · CONTACT · WHOLESALE · APPLICATION FORM · AFFILIATES · NUTRITION LABEL` + Login + Cart.

| Item | Target | Status |
|------|--------|--------|
| Home | `/` | OK |
| Shop | `/collections/all` | OK |
| Contact | `/pages/contact` | OK |
| Nutrition Label | `/pages/nutrition-label` | OK |
| Wholesale | `/pages/wholesale-application` | OK |
| Application Form | `/pages/wholesale-application` | Same target — confirm whether a separate page is intended |
| **Affiliates** | `/pages/affiliates` | **404 — page does not exist** |
| Login / Cart | `/account/login`, `/cart` | OK |

Affiliates renders in the nav but is flagged, not silently linked to a 404. Client decides:
create the page, or drop the item.

---

## 10. Delivery and verification

1. Build on branch `redesign/brown-kraft-2026`.
2. Push to an **unpublished dev theme** via Shopify CLI (`shopify theme push --unpublished`),
   which requires one browser login from the store owner.
3. Verify against the comp at 1920 / 1440 / 1024 / 768 / 390 px with Playwright screenshots,
   diffed side-by-side with the corresponding comp slice.
4. Checks before hand-off: no magenta remains in any computed style **on the homepage** (product,
   cart and collection pages keep the current styling — they are out of scope, §2); Lighthouse
   performance/accessibility not below the current live page; no console errors; cart adds succeed
   for Jelly; Capsule/Gummy buttons are inert and labeled.
5. Client previews. **Publishing is a separate, explicit step.**

---

## 11. Open items for the client

- **Affiliates page** — create or drop (§9).
- **Application Form** — separate page, or an alias of Wholesale (§9)?
- **Capsule and Gummy products** — when created in Shopify, assign them in the theme customizer and
  the disabled cards go live with no code change.
- **Claims substantiation** — "Reviewed by 200+ Clinicians", "Clinically Proven Ingredients",
  "4.8 from 150+ beta testers", Dr. Ralph Stein's named endorsement, and four named testimonials are
  reproduced from the comp as instructed. These are advertising claims on a live supplement store and
  need backing documentation. Raised, not blocking.

---

## 12. Build log — deviations from this spec (2026-09-03)

Recorded as built, so the spec matches the theme.

**Baseline was wrong.** The repo was behind the live theme. Live carried three
things git did not: the doctor renamed from *John Reger* to **Ralph Stein**
(which is what the comp says), selling plan `6089343205` instead of the repo's
stale `6089310437`, and three **Locksmith** app snippets gating the wholesale
pages. The repo was resynced from a `theme pull` before any work started;
pushing it as-was would have reverted all three.

**Assets ship as theme assets, not Shopify Files.** §5.1 planned a Files upload.
Theme assets version with the theme, need no separate API step, and match what
most of the theme already does. Transparent images are WebP: 3.90 MB → 0.22 MB.

**Sustainability is not its own section.** The comp draws §4 as one row, and two
Shopify sections would stack vertically. It is the right-hand column of
`custom-buy-box.liquid`.

**The topbar stayed in `layout/theme.liquid`.** It was already there as a
hardcoded emoji strip rather than a section; it was rebuilt in place with the
comp's four vector icons. No `custom-announcement.liquid` was created.

**The footer was restyled, not rebuilt.** Dawn's footer already renders the link
columns, newsletter, policy links and payment icons. Replacing it would have
risked that wiring for a cosmetic gain, so it takes the espresso palette and the
wordmark via CSS plus one snippet render.

**A leaked global caused a real bug.** `custom-final-cta.liquid` declared
`.fg-display { font-size: … }` with no scoping, which applied site-wide and blew
the hero headline up to 86px. Same pattern in `custom-ingredient-scroll.liquid`.
Both new sections namespace every selector; the hero's logo rule was likewise
scoped after it leaked out and resized the header wordmark.

### Verified on the dev theme (#164534255845)

- No Liquid errors on the homepage; no console errors from theme code.
- No magenta survives in any computed style on the homepage.
- Section heights against the comp: hero 552/552, values 90/90, doctor 402/402,
  symptoms 596/602, fiber gap 812/798, testimonials 589/600.
- No horizontal scroll at 390px (`scrollWidth == clientWidth`).
- Add to cart adds the Jelly at **$29.99 on the "12 Weeks Subscription" plan**.
- Clicking a Coming Soon card does not change the selected variant or plan.

### Still open for the client

- **Nav menu content.** The header still says CATALOG where the comp says SHOP,
  and both footer link lists point at the same `footer` menu, so they render
  "Search / Your Privacy Choices" instead of the comp's two columns. These are
  Shopify menus (Admin → Content → Menus), not theme code.
- **`/pages/affiliates` is still a 404.**
- **Jelly maps to the Orange & Berry Combo Pack.** The comp has no flavour
  selector, and the previous buy box did. The combo pack resolves that without
  removing a choice, but it is a merchandising decision worth confirming.
- **Capsule and Gummy** render inert until those products exist.

---

## 13. Flavour selection + mobile pass (2026-09-03, second round)

### Flavour selection

Client direction: shoppers pick Orange or Berry; **the package image and the
product added to cart are the only things that may change.** No flavour-themed
backgrounds, accents or reflow.

Orange and Berry are **separate products** in this catalogue
(`flushgut-orange`, `flushgut-berry`), each with a single "Default Title"
variant — not two variants of one product. So a flavour choice swaps products.

Implementation: the format block takes optional `flavor_a_*` / `flavor_b_*`
product, label and image settings. When flavour A is set, the card renders a
packshot tile and a two-chip picker; selecting a chip writes that flavour's
variant, selling plan and prices onto the card and swaps the image. Formats with
no flavours (Gummy, Capsule) render a single packshot from `card_image`, the
product's featured image, or a theme asset.

`assets/fg-format-picker.js` carries a standing comment recording the
no-other-changes rule, so a later editor does not add flavour-conditional
styling.

**Placeholder art.** The updated brown packaging does not exist for the flavours:
every image on the Orange and Berry products is the previous magenta artwork,
and the comp contains one generic brown pouch with no flavour variant. On the
client's instruction the cards use the existing product photographs for now.
They are opaque with a near-white ground, so the packshot sits in a white
product tile — which also suits transparent brown renders when they arrive.
Swapping is then a single image field per flavour, no code change.

**Row alignment.** Adding a packshot to one card alone dropped the Jelly price
below the other two. All three cards now carry a packshot, the card body is a
flex column, and the price takes `margin-top: auto`. The "Coming Soon" line is
always rendered (hidden when purchasable) so it reserves its height. Note the
`margin-top: auto` must be declared *after* the shared `margin: 0` rule for the
card's text elements, or that rule silently resets it.

### Verified

Snapshot of every element's computed colour, geometry and typography, taken
before and after an Orange → Berry switch (`flavor_diff.py`):

| Check | Result |
|---|---|
| Geometry changes (x/y/width/height) | **0** |
| Typography changes | **0** |
| Text changes | **0** |
| Colour changes | **6** — the two flavour chips' own selected state |
| Image swaps | **1** — the packshot |
| Cart variant | Orange → Berry, selling plan preserved |

Add to cart, both flavours:
- Orange → *FlushGut Fiber Gummies Jelly - Orange*, $29.99, "12 Weeks Subscription"
- Berry → *FlushGut Fiber Gummies Jelly - Berry*, $29.99, "12 Weeks Subscription"

Price baselines across the three cards: aligned at 1600px and 768px; stacked at
390px, as intended.

### Mobile pass

Audited at 390px and 768px with touch emulation.

- No horizontal scroll at either width (`scrollWidth == clientWidth`).
- Hero callout copy restored from 10.5px to 12.5px, chips 10px → 11px, buy-box
  trust labels 10px → 10.5px — the desktop sizes were tuned to the comp's 154px
  column and were too small once cards go full width.
- Touch targets padded to ~44px: the one-time purchase link, the closing grid's
  Add to cart, the source citation link, and the flavour chips (26px → 36px).
- "FlushGut ESSENTIALS" was breaking mid-word at 390px; the logo shrinks to
  140px and the word is `nowrap` below 620px.
- Sustainability panel gained a scrim below 1100px: stacked, `cover` crops to
  the hands and the heading lost its light ground.

---

## 14. Klaviyo popup, contrast and access limits (2026-09-03, third round)

### Klaviyo popup

The signup popup is a Klaviyo app form and shipped in the previous brand. It
renders into the page DOM rather than an iframe, so the theme can restyle it:
cream card, espresso border and button, Archivo throughout, quiet dismiss link.

Two things made this non-obvious:

- Both the submit and the dismiss are `<button type="button">` with generated
  class names (`go3634373664`, `go488503511`) that change whenever the form is
  republished. There is no stable selector separating them, so
  `assets/fg-klaviyo-brand.js` tags them by DOM order (`fg-kl-primary` /
  `fg-kl-secondary`) via a MutationObserver, since the popup mounts late.
- The blue ring on the close control is not a Klaviyo colour — it is the
  browser focus ring, and Klaviyo moves focus there when the popup opens. It is
  restyled to espresso rather than removed; keyboard users need it.

**Appearance only.** The copy and the FLUSH20 offer live in Klaviyo's dashboard
and cannot be changed from the theme.

### Contrast

Caramel `#947751` is a display colour and fails WCAG AA as text. Two accessible
siblings now carry the accent per ground: `--fg-caramel-deep #7A5C38` on
cream/kraft, `--fg-caramel-light #C2A170` on espresso/ink.

The doctor band needed more than a colour swap — its copy sits directly on a
photograph, so legibility depended on the pixels behind it. A left-to-right
scrim now darkens the right side, and the copy moved to cream with the accent
line in light caramel.

**This is a deliberate deviation from the comp**, which set that copy dark on a
light ground. It is reversible: remove `.fg-doctor::after` and restore the
espresso colours.

Result: **0 contrast failures on every theme-rendered page** — home, product,
collection, cart, contact, wholesale, search, login, 404.

A computed-style checker cannot see a `::after` scrim, so it reports the doctor
band as failing. That section is verified instead by sampling the actual
rendered pixels behind each line (4.93:1 to 10.08:1, all passing).

### Blocked by app scopes

The custom app token holds `read/write_products` and `read/write_files` only.
Verified denied:

| Needed for | Field | Result |
|---|---|---|
| Header/footer menus | `menus` | Access denied |
| Nutrition Label page content | `pages` | Access denied |
| Theme listing via API | `themes` | Needs `read_themes` |

So these remain admin tasks, or need scopes added to the "API Access" app:

- Header menu says CATALOG where the comp says SHOP; both footer link lists
  point at the same `footer` menu.
- The Nutrition Label page body contains a hardcoded `#8F1263` magenta panel
  and white-on-orange text at 3.58:1. Both live in the page's content HTML.
