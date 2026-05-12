# FlushGut Product Page — Design Spec
**Date:** 2026-05-12
**Scope:** Custom Shopify product page template — bypasses Appstle widget entirely

---

## Goal

Build a fully custom product page (`/products/flushgut-orange` and `/products/flushgut-berry`) that matches the get.flushgut.com/essentials + get.im8health.com/essentials reference pages pixel-for-pixel. No shortcuts. Cold ad traffic must be able to land here and convert without ever seeing the homepage.

Appstle's default widget is completely bypassed — same approach as the homepage buy box.

---

## Architecture

**New files:**
- `sections/product-image-gallery.liquid` — side-by-side gallery (thumbnails left, main image right)
- `sections/product-buy-box.liquid` — 3-tier accordion using `product` object directly
- `templates/product.flushgut.json` — wires all sections; assigned to Orange + Berry in Shopify Admin
- `assets/fg-product-gallery.js` — thumbnail swap JS for gallery

**Reused files (zero changes):**
- `sections/custom-benefits-row.liquid`
- `sections/custom-ingredient-scroll.liquid`
- `sections/custom-format-diff.liquid`
- `sections/custom-social-proof.liquid`
- `sections/custom-final-cta.liquid`
- `assets/fg-buy-box.js` — shared with homepage buy box

**Existing template preserved:**
- `templates/product.json` — Dawn default, used for all non-FlushGut products

---

## Section Order

| # | Section | Source |
|---|---|---|
| — | Dawn header | Existing |
| 1 | `product-image-gallery.liquid` | NEW |
| 2 | `product-buy-box.liquid` | NEW |
| 3 | `custom-benefits-row.liquid` | REUSE |
| 4 | `custom-ingredient-scroll.liquid` | REUSE |
| 5 | `custom-format-diff.liquid` | REUSE |
| 6 | `custom-social-proof.liquid` | REUSE |
| 7 | `custom-final-cta.liquid` | REUSE |
| — | Dawn footer | Existing (has FDA disclaimer) |

---

## Section 1: product-image-gallery.liquid

### Layout

**Desktop:** Side-by-side. Thumbnail column on the LEFT (vertical stack, ~60px wide). Main image on the RIGHT (fills remaining width). This is the IM8/FlushGut essentials reference layout exactly.

**Mobile (≤768px):** Stacks. Main image on top, thumbnails as horizontal scroll row below.

### Flavor navigation pills

Above the gallery, two pill buttons:
- **Current flavor** — solid orange background (`#f37721`), white text, not a link
- **Other flavor** — outlined pill, links to the other product page (`/products/flushgut-berry` or `/products/flushgut-orange`)

Pill content is set via section settings so it works for both products without code changes.

### Image behavior

- Thumbnails pulled from `product.images` — whatever is uploaded in Shopify Admin appears automatically
- Clicking a thumbnail swaps the main image client-side (no page reload)
- First image is active/selected by default
- Selected thumbnail has orange border (`2px solid #f37721`)
- Main image uses `image_url: width: 800`

### Schema settings

- `flavor_label` (text) — e.g. "Orange" — displayed in the active pill
- `other_flavor_label` (text) — e.g. "Berry" — displayed in the link pill
- `other_flavor_url` (url) — e.g. `/products/flushgut-berry`

### JS (`assets/fg-product-gallery.js`)

Separate file from `fg-buy-box.js`. Handles thumbnail click → main image swap. Small, focused. Does not touch the buy box.

```javascript
// Key behavior:
// 1. querySelectorAll('[data-thumb]') — all thumbnail imgs
// 2. on click: update [data-main-image] src + srcset
// 3. toggle .fg-thumb--active class on thumbnails
```

---

## Section 2: product-buy-box.liquid

### Key differences from homepage `custom-buy-box.liquid`

| | Homepage | Product Page |
|---|---|---|
| Product data | `all_products['flushgut-orange']` | `product` (direct, available on product pages) |
| Variant ID | `orange_variant.id` / `berry_variant.id` | `product.variants.first.id` |
| Selling plans | `section.settings.selling_plan_5wk/11wk` | Same schema settings |
| Flavor toggle | JS swap (both products on one page) | Nav link pills (separate URLs per flavor) |
| Image swap | JS (data-flavor-image) | Not needed (gallery section handles images) |

### Flavor pills

Same design as gallery pills — two pills above the buy box that mirror the gallery. Active pill is current product, inactive links to the other.

**Why repeat them?** The gallery is above the fold on mobile. When the user scrolls to the buy box, the gallery is off-screen. The buy box pills orient them to which flavor they're buying without scrolling up.

### Accordion tiers

Identical to homepage buy box — same CSS classes, same 3-tier structure, same perks content. Uses `fg-buy-box.js` shared from the homepage.

```liquid
{% liquid
  assign plan_5wk  = section.settings.selling_plan_5wk
  assign plan_11wk = section.settings.selling_plan_11wk
%}
```

### ATC form

Same `data-atc-form`, `data-variant-input`, `data-selling-plan-input` contract as homepage. `fg-buy-box.js` works without modification.

Variant input value: `{{ product.variants.first.id }}`

### Schema settings

- `title` (text) — product display name
- `subtitle` (text)
- `selling_plan_5wk` (text) — numeric ID, default "6089310437"
- `selling_plan_11wk` (text) — numeric ID, fill in after creating plan
- `flavor_label` (text) — current flavor name
- `other_flavor_label` (text) — other flavor name
- `other_flavor_url` (url) — link to other product page

### Section ID

`id="product-buy-box"` — `custom-final-cta.liquid` CTA scrolls to `#product-buy-box` (not `#fg-buy-box` as on homepage).

---

## templates/product.flushgut.json

```json
{
  "sections": {
    "pg-gallery": {
      "type": "product-image-gallery",
      "settings": {
        "flavor_label": "Orange",
        "other_flavor_label": "Berry",
        "other_flavor_url": "/products/flushgut-berry"
      }
    },
    "pg-buy-box": {
      "type": "product-buy-box",
      "settings": {
        "title": "FlushGut Essentials",
        "subtitle": "All-in-One Weekly Gut Support",
        "selling_plan_5wk": "6089310437",
        "selling_plan_11wk": "",
        "flavor_label": "Orange",
        "other_flavor_label": "Berry",
        "other_flavor_url": "/products/flushgut-berry"
      }
    },
    "pg-benefits": { "type": "custom-benefits-row", "settings": {} },
    "pg-ingredients": { "type": "custom-ingredient-scroll", "settings": {} },
    "pg-format": { "type": "custom-format-diff", "settings": {} },
    "pg-social": { "type": "custom-social-proof", "settings": {} },
    "pg-final-cta": { "type": "custom-final-cta", "settings": {} }
  },
  "order": ["pg-gallery","pg-buy-box","pg-benefits","pg-ingredients","pg-format","pg-social","pg-final-cta"]
}
```
> Note: A second `product.flushgut-berry.json` uses the same sections with `flavor_label: "Berry"`, `other_flavor_label: "Orange"`, `other_flavor_url: "/products/flushgut-orange"`.

### Assigning the template to products

In Shopify Admin → Products → FlushGut Orange → Theme template → select `product.flushgut`. Repeat for Berry. The default `product.json` remains untouched for all other products.

---

## Design Tokens

Same `fg-tokens.css` loaded globally. No new tokens needed.

## Visual Reference

- get.flushgut.com/essentials — primary reference
- get.im8health.com/essentials — secondary reference
- Gallery layout B (thumbnails left, main image right) — exact match to both references

## Out of Scope

- Customer subscription portal customization (Phase 3)
- Product page FAQ section (can add as a follow-up session)
- Supplement Facts panel embed
- Review app integration (e.g. Okendo, Stamped)
