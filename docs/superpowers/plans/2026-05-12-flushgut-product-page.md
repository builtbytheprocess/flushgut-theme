# FlushGut Product Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build custom `/products/flushgut-orange` and `/products/flushgut-berry` pages that match the IM8/FlushGut essentials reference pixel-for-pixel — side-by-side image gallery, 3-tier subscription accordion, full sales content below — bypassing Appstle's widget entirely.

**Architecture:** One new template (`product.flushgut.json`) applied to both products. Two new sections (gallery + buy box) built from scratch. Five existing sections reused unchanged. Product Liquid object used directly in sections — `product.handle` detects Orange vs Berry so one template serves both products. `fg-buy-box.js` shared with homepage, zero changes.

**Tech Stack:** Shopify Liquid, vanilla JS, CSS custom properties, Dawn OS 2.0

**Working directory:** `E:\C Drive\Documents\programs\flushgut-theme`  
**Source HTML reference:** `E:\C Drive\Documents\programs\flushgut-site\sections\`  
**Store:** shop.flushgut.com

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `assets/fg-product-gallery.js` | CREATE | Thumbnail click → main image swap |
| `sections/product-image-gallery.liquid` | CREATE | Side-by-side gallery, flavor nav pills |
| `sections/product-buy-box.liquid` | CREATE | 3-tier accordion using `product` object |
| `sections/custom-final-cta.liquid` | MODIFY (line 71) | Add `cta_scroll_target` schema setting |
| `templates/product.flushgut.json` | CREATE | Wires all sections, one template for both flavors |

---

## Task 1: fg-product-gallery.js

**Files:**
- Create: `assets/fg-product-gallery.js`

- [ ] **Step 1: Create `assets/fg-product-gallery.js`**

```javascript
(function () {
  'use strict';

  function initGallery() {
    var gallery = document.getElementById('fg-product-gallery');
    if (!gallery) return;

    var mainImage = gallery.querySelector('[data-main-image]');
    var thumbs = gallery.querySelectorAll('[data-thumb]');

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        if (mainImage) {
          mainImage.src = thumb.dataset.fullSrc;
          mainImage.alt = thumb.dataset.alt || '';
        }
        thumbs.forEach(function (t) {
          t.classList.remove('fg-thumb--active');
        });
        thumb.classList.add('fg-thumb--active');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
})();
```

- [ ] **Step 2: Commit**

```bash
git add assets/fg-product-gallery.js
git commit -m "feat: add product gallery JS — thumbnail swap"
```

---

## Task 2: product-image-gallery.liquid

**Files:**
- Create: `sections/product-image-gallery.liquid`

This section detects `product.handle` to set flavor labels — no separate template needed per flavor.

- [ ] **Step 1: Create `sections/product-image-gallery.liquid`**

```liquid
{% liquid
  if product.handle == 'flushgut-orange'
    assign current_flavor       = 'Orange'
    assign current_flavor_dot   = '#f37721'
    assign other_flavor         = 'Berry'
    assign other_flavor_dot     = '#a0237f'
    assign other_flavor_url     = '/products/flushgut-berry'
  else
    assign current_flavor       = 'Berry'
    assign current_flavor_dot   = '#a0237f'
    assign other_flavor         = 'Orange'
    assign other_flavor_dot     = '#f37721'
    assign other_flavor_url     = '/products/flushgut-orange'
  endif
%}

<style>
.fg-gallery { background: var(--fg-canvas); padding: 40px 0 0; }
.fg-gallery__inner { max-width: 1100px; margin: 0 auto; padding: 0 var(--container-pad); }

/* Flavor pills */
.fg-gallery__flavors { display: flex; gap: 8px; margin-bottom: 20px; }
.fg-gallery__flavor-current { display: inline-flex; align-items: center; gap: 8px; background: var(--fg-orange); color: #fff; font-family: var(--font-body); font-size: 12px; font-weight: 700; padding: 7px 16px; border-radius: var(--radius-pill); }
.fg-gallery__flavor-other { display: inline-flex; align-items: center; gap: 8px; background: var(--fg-card); color: var(--fg-ink); font-family: var(--font-body); font-size: 12px; font-weight: 600; padding: 7px 16px; border-radius: var(--radius-pill); border: 1px solid var(--fg-border); text-decoration: none; transition: border-color var(--motion-fast) var(--ease-out); }
.fg-gallery__flavor-other:hover { border-color: var(--fg-orange); }
.fg-flavor-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

/* Gallery layout — side by side desktop */
.fg-gallery__layout { display: flex; gap: 16px; align-items: flex-start; }

/* Thumbnail column — left */
.fg-gallery__thumbs { display: flex; flex-direction: column; gap: 8px; width: 64px; flex-shrink: 0; }
.fg-gallery__thumb { width: 64px; height: 64px; border-radius: var(--radius-md); overflow: hidden; cursor: pointer; border: 2px solid var(--fg-border); transition: border-color var(--motion-fast) var(--ease-out); flex-shrink: 0; }
.fg-gallery__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.fg-gallery__thumb.fg-thumb--active { border-color: var(--fg-orange); }

/* Main image — right */
.fg-gallery__main { flex: 1; border-radius: var(--radius-lg); overflow: hidden; background: var(--fg-cream); }
.fg-gallery__main img { width: 100%; height: auto; display: block; max-height: 600px; object-fit: contain; }

/* Mobile: stacked */
@media (max-width: 768px) {
  .fg-gallery__layout { flex-direction: column; }
  .fg-gallery__thumbs { flex-direction: row; width: 100%; overflow-x: auto; padding-bottom: 4px; }
  .fg-gallery__thumb { flex-shrink: 0; }
}
</style>

<div class="fg-gallery" id="fg-product-gallery">
  <div class="fg-gallery__inner">

    <!-- Flavor nav pills -->
    <div class="fg-gallery__flavors">
      <span class="fg-gallery__flavor-current">
        <span class="fg-flavor-dot" style="background:{{ current_flavor_dot }};"></span>
        {{ current_flavor }}
      </span>
      <a class="fg-gallery__flavor-other" href="{{ other_flavor_url }}">
        <span class="fg-flavor-dot" style="background:{{ other_flavor_dot }};"></span>
        {{ other_flavor }} →
      </a>
    </div>

    <!-- Gallery -->
    <div class="fg-gallery__layout">

      <!-- Thumbnails (left on desktop, below on mobile) -->
      <div class="fg-gallery__thumbs">
        {%- for image in product.images -%}
          <div class="fg-gallery__thumb{% if forloop.first %} fg-thumb--active{% endif %}"
               data-thumb
               data-full-src="{{ image | image_url: width: 800 }}"
               data-alt="{{ image.alt | escape }}">
            <img src="{{ image | image_url: width: 128 }}"
                 alt="{{ image.alt | escape }}"
                 width="64" height="64"
                 loading="{{ forloop.first | ternary: 'eager', 'lazy' }}">
          </div>
        {%- endfor -%}
      </div>

      <!-- Main image (right on desktop, top on mobile) -->
      <div class="fg-gallery__main">
        <img data-main-image
             src="{{ product.featured_image | image_url: width: 800 }}"
             alt="{{ product.featured_image.alt | escape }}"
             width="800"
             loading="eager">
      </div>

    </div>
  </div>
</div>

<script src="{{ 'fg-product-gallery.js' | asset_url }}" defer></script>

{% schema %}
{
  "name": "Product Image Gallery",
  "tag": "div",
  "presets": [{ "name": "Product Image Gallery" }]
}
{% endschema %}
```

> **Note on `ternary` filter:** Shopify Liquid does not have a native `ternary` filter. Replace `forloop.first | ternary: 'eager', 'lazy'` with an explicit if/else:
> ```liquid
> {%- if forloop.first -%}eager{%- else -%}lazy{%- endif -%}
> ```
> The plan shows intent; use the if/else form in actual code.

- [ ] **Step 2: Fix the `ternary` filter in the file**

Edit `sections/product-image-gallery.liquid`. Find the line:
```liquid
                 loading="{{ forloop.first | ternary: 'eager', 'lazy' }}">
```
Replace with:
```liquid
                 loading="{%- if forloop.first -%}eager{%- else -%}lazy{%- endif -%}">
```

- [ ] **Step 3: Commit**

```bash
git add sections/product-image-gallery.liquid
git commit -m "feat: add product image gallery — side-by-side, flavor nav pills"
```

---

## Task 3: product-buy-box.liquid

**Files:**
- Create: `sections/product-buy-box.liquid`

This is the homepage buy box adapted for the product page. Key changes:
- Uses `product` object directly (no `all_products`)
- Flavor nav pills are `<a>` links (same as gallery above, reinforces context)
- No product image (gallery section above handles it)
- Section `id="product-buy-box"` (not `fg-buy-box`)
- All CSS classes identical — `fg-buy-box.js` reused without modification

- [ ] **Step 1: Create `sections/product-buy-box.liquid`**

```liquid
{% liquid
  assign plan_5wk  = section.settings.selling_plan_5wk
  assign plan_11wk = section.settings.selling_plan_11wk

  if product.handle == 'flushgut-orange'
    assign current_flavor     = 'Orange'
    assign current_flavor_dot = '#f37721'
    assign other_flavor       = 'Berry'
    assign other_flavor_dot   = '#a0237f'
    assign other_flavor_url   = '/products/flushgut-berry'
  else
    assign current_flavor     = 'Berry'
    assign current_flavor_dot = '#a0237f'
    assign other_flavor       = 'Orange'
    assign other_flavor_dot   = '#f37721'
    assign other_flavor_url   = '/products/flushgut-orange'
  endif
%}

<style>
/* All styles identical to custom-buy-box.liquid — same CSS classes used */
.fg-buybox { background: var(--fg-canvas); padding: 56px 0; }
.fg-buybox__inner { max-width: 520px; margin: 0 auto; padding: 0 var(--container-pad); }
.fg-buybox__title { font-family: var(--font-display); font-size: clamp(28px,4vw,42px); font-weight: 800; text-transform: uppercase; letter-spacing: var(--track-display); color: var(--fg-ink); margin: 0 0 4px; }
.fg-buybox__sub { font-family: var(--font-body); font-size: 14px; color: var(--fg-muted); margin: 0 0 14px; }
.fg-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 18px; }
.fg-badge { font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--fg-ink); background: var(--fg-card); border: 1px solid var(--fg-border); border-radius: var(--radius-pill); padding: 4px 10px; }
.fg-flavors { display: flex; gap: 8px; margin-bottom: 18px; }
.fg-flavor-nav-current { flex: 1; background: var(--fg-orange); border: 2px solid var(--fg-orange); border-radius: var(--radius-md); padding: 10px 12px; display: flex; align-items: center; gap: 8px; font-family: var(--font-body); font-size: 13px; font-weight: 700; color: #fff; }
.fg-flavor-nav-other { flex: 1; background: var(--fg-card); border: 2px solid var(--fg-border); border-radius: var(--radius-md); padding: 10px 12px; display: flex; align-items: center; gap: 8px; font-family: var(--font-body); font-size: 13px; font-weight: 600; color: var(--fg-muted); text-decoration: none; transition: border-color var(--motion-fast) var(--ease-out); }
.fg-flavor-nav-other:hover { border-color: var(--fg-orange); color: var(--fg-ink); }
.fg-flavor-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.fg-savings-banner { background: #e8f5e9; border-radius: var(--radius-md); padding: 8px 14px; text-align: center; font-family: var(--font-body); font-size: 12px; font-weight: 700; color: #2e7d32; margin-bottom: 12px; }
.fg-tier { background: var(--fg-card); border: 2px solid var(--fg-border); border-radius: var(--radius-md); margin-bottom: 8px; overflow: hidden; cursor: pointer; opacity: 0.72; transition: opacity var(--motion-fast) var(--ease-out), border-color var(--motion-fast) var(--ease-out); }
.fg-tier--selected { border-color: var(--fg-orange); opacity: 1; }
.fg-tier__header { display: flex; align-items: flex-start; justify-content: space-between; padding: 12px 14px; gap: 10px; }
.fg-tier__radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--fg-border); flex-shrink: 0; margin-top: 2px; transition: background var(--motion-fast), border-color var(--motion-fast); display: flex; align-items: center; justify-content: center; }
.fg-tier--selected .fg-tier__radio { background: var(--fg-orange); border-color: var(--fg-orange); }
.fg-tier__radio-dot { width: 6px; height: 6px; border-radius: 50%; background: #fff; display: none; }
.fg-tier--selected .fg-tier__radio-dot { display: block; }
.fg-tier__meta { flex: 1; }
.fg-tier__name { font-family: var(--font-body); font-size: 13px; font-weight: 700; color: var(--fg-ink); }
.fg-tier__save { color: var(--fg-orange); font-size: 12px; }
.fg-tier__freq { font-size: 11px; color: var(--fg-muted); margin-top: 2px; }
.fg-tier__price { text-align: right; flex-shrink: 0; }
.fg-tier__amount { font-family: var(--font-body); font-size: 17px; font-weight: 900; color: var(--fg-ink); }
.fg-tier__was { font-size: 11px; color: #bbb; text-decoration: line-through; }
.fg-tier__perks { max-height: 0; overflow: hidden; transition: max-height var(--motion-base) var(--ease-out); background: #fffbf7; border-top: 1px solid #fde8d8; }
.fg-tier__perks-inner { padding: 12px 14px; }
.fg-tier__perks-label { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; color: var(--fg-muted); text-align: center; text-transform: uppercase; margin-bottom: 10px; }
.fg-tier__perk { display: flex; align-items: center; gap: 8px; font-family: var(--font-body); font-size: 12px; color: var(--fg-ink); margin-bottom: 6px; }
.fg-tier__perk-tag { font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.04em; flex-shrink: 0; }
.fg-tier__perk-tag--free { background: var(--fg-orange); color: #fff; }
.fg-tier__perk-tag--exclusive { background: var(--fg-purple); color: #fff; }
.fg-tier__perk-tag--check { color: #22c55e; font-size: 14px; }
.fg-tier__popular { background: var(--fg-orange); color: #fff; text-align: center; padding: 5px; font-family: var(--font-body); font-size: 9px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
.fg-onetime { text-align: center; margin-bottom: 18px; }
.fg-onetime__link { font-family: var(--font-body); font-size: 12px; color: var(--fg-muted); text-decoration: underline; cursor: pointer; background: none; border: none; padding: 0; }
.fg-atc-btn { width: 100%; background: var(--fg-orange); color: #fff; font-family: var(--font-body); font-size: 15px; font-weight: 900; letter-spacing: var(--track-btn); text-transform: uppercase; border: none; border-radius: var(--radius-pill); padding: 17px; cursor: pointer; transition: background var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-out); box-shadow: var(--shadow-cta); margin-bottom: 12px; }
.fg-atc-btn:hover { background: var(--fg-orange-hot); transform: translateY(-1px); }
.fg-atc-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.fg-trust-strip { display: flex; border-top: 1px solid var(--fg-border); padding-top: 12px; }
.fg-trust-strip__item { flex: 1; text-align: center; font-family: var(--font-body); font-size: 9px; font-weight: 700; color: var(--fg-muted); text-transform: uppercase; letter-spacing: 0.06em; border-right: 1px solid var(--fg-border); padding: 0 6px; }
.fg-trust-strip__item:last-child { border-right: none; }
@media (max-width: 600px) {
  .fg-buybox__inner { max-width: 100%; }
}
</style>

<section class="fg-buybox" id="product-buy-box">
  <div class="fg-buybox__inner">

    <div class="fg-buybox__title">{{ section.settings.title }}</div>
    <div class="fg-buybox__sub">{{ section.settings.subtitle }}</div>
    <div class="fg-badges">
      <span class="fg-badge">7G Dietary Fiber</span>
      <span class="fg-badge">Third-Party Tested</span>
      <span class="fg-badge">Once Weekly</span>
      <span class="fg-badge">HSA/FSA Eligible</span>
    </div>

    <!-- Flavor nav pills — links between product pages -->
    <div style="font-family:var(--font-body);font-size:10px;font-weight:700;letter-spacing:var(--track-label);text-transform:uppercase;color:var(--fg-muted);margin-bottom:8px;">Flavor</div>
    <div class="fg-flavors">
      <span class="fg-flavor-nav-current">
        <span class="fg-flavor-dot" style="background:{{ current_flavor_dot }};"></span>
        {{ current_flavor }}
      </span>
      <a class="fg-flavor-nav-other" href="{{ other_flavor_url }}">
        <span class="fg-flavor-dot" style="background:{{ other_flavor_dot }};"></span>
        {{ other_flavor }} →
      </a>
    </div>

    <div class="fg-savings-banner">YOU SAVE $10/MO — $120/YR</div>

    <form data-atc-form>
      <input type="hidden" data-variant-input value="{{ product.variants.first.id }}">
      <input type="hidden" data-selling-plan-input name="selling_plan" value="{{ plan_11wk }}">

      <!-- Tier 1: 3 months (default selected, expanded) -->
      <div class="fg-tier fg-tier--selected"
           data-tier
           data-selling-plan="{{ plan_11wk }}"
           data-price="$27.99/mo"
           aria-expanded="true">
        <div class="fg-tier__header">
          <div class="fg-tier__radio"><div class="fg-tier__radio-dot"></div></div>
          <div class="fg-tier__meta">
            <div class="fg-tier__name">3 Months of FlushGut <span class="fg-tier__save">(SAVE 30%)</span></div>
            <div class="fg-tier__freq">Ships every 11 weeks · 1-week buffer so you never run out</div>
          </div>
          <div class="fg-tier__price">
            <div class="fg-tier__amount">$27.99</div>
            <div class="fg-tier__was">$39.99/box</div>
            <div style="font-size:10px;color:var(--fg-muted);">per box</div>
          </div>
        </div>
        <div class="fg-tier__perks" data-tier-perks style="max-height:200px;">
          <div class="fg-tier__perks-inner">
            <div class="fg-tier__perks-label">Everything in 6-Week, Plus</div>
            <div class="fg-tier__perk"><span class="fg-tier__perk-tag fg-tier__perk-tag--free">Free</span> Welcome Kit <span style="color:var(--fg-muted);">($42 value)</span></div>
            <div class="fg-tier__perk"><span class="fg-tier__perk-tag fg-tier__perk-tag--free">Free</span> Mystery Gift <span style="color:var(--fg-muted);">($18 value)</span></div>
            <div class="fg-tier__perk"><span class="fg-tier__perk-tag--check">✓</span> 60-day money-back guarantee</div>
            <div class="fg-tier__perk"><span class="fg-tier__perk-tag fg-tier__perk-tag--exclusive">Exclusive</span> Access to the FlushGut Method library</div>
          </div>
        </div>
        <div class="fg-tier__popular">Most Popular</div>
      </div>

      <!-- Tier 2: 6 weeks -->
      <div class="fg-tier"
           data-tier
           data-selling-plan="{{ plan_5wk }}"
           data-price="$29.99/mo"
           aria-expanded="false">
        <div class="fg-tier__header">
          <div class="fg-tier__radio"><div class="fg-tier__radio-dot"></div></div>
          <div class="fg-tier__meta">
            <div class="fg-tier__name">6 Weeks of FlushGut <span class="fg-tier__save">(SAVE 25%)</span></div>
            <div class="fg-tier__freq">Ships every 5 weeks · 1-week buffer so you never run out</div>
          </div>
          <div class="fg-tier__price">
            <div class="fg-tier__amount">$29.99</div>
            <div class="fg-tier__was">$39.99/box</div>
          </div>
        </div>
        <div class="fg-tier__perks" data-tier-perks>
          <div class="fg-tier__perks-inner">
            <div class="fg-tier__perk"><span class="fg-tier__perk-tag fg-tier__perk-tag--free">Free</span> Welcome Kit <span style="color:var(--fg-muted);">($42 value)</span></div>
            <div class="fg-tier__perk"><span class="fg-tier__perk-tag--check">✓</span> 60-day money-back guarantee</div>
            <div class="fg-tier__perk"><span class="fg-tier__perk-tag--check">✓</span> Cancel or pause anytime</div>
          </div>
        </div>
      </div>

      <!-- One-time (subtle) -->
      <div class="fg-onetime">
        <button type="button" class="fg-onetime__link"
                data-tier
                data-selling-plan=""
                data-price="$39.99"
                aria-expanded="false">
          One Time Purchase for $39.99
        </button>
      </div>

      <button type="submit" class="fg-atc-btn" data-atc-btn
              data-default-label="Start My FlushGut Routine — $27.99/mo">
        <span data-cta-label>Start My FlushGut Routine — $27.99/mo</span>
      </button>
    </form>

    <div class="fg-trust-strip">
      <div class="fg-trust-strip__item">Free US Shipping</div>
      <div class="fg-trust-strip__item">60-Day Guarantee</div>
      <div class="fg-trust-strip__item">Cancel Anytime</div>
    </div>

  </div>
</section>

<script src="{{ 'fg-buy-box.js' | asset_url }}" defer></script>

{% schema %}
{
  "name": "Product Buy Box",
  "tag": "div",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Product title",
      "default": "FlushGut Essentials"
    },
    {
      "type": "text",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "All-in-One Weekly Gut Support"
    },
    {
      "type": "text",
      "id": "selling_plan_5wk",
      "label": "Selling plan ID — 6-week (every 5 weeks)",
      "info": "Numeric ID from Shopify Admin → Subscriptions.",
      "default": "6089310437"
    },
    {
      "type": "text",
      "id": "selling_plan_11wk",
      "label": "Selling plan ID — 3-month (every 11 weeks)",
      "info": "Create this plan in Appstle first. Numeric ID only."
    }
  ],
  "presets": [
    {
      "name": "Product Buy Box"
    }
  ]
}
{% endschema %}
```

- [ ] **Step 2: Commit**

```bash
git add sections/product-buy-box.liquid
git commit -m "feat: add product buy box — 3-tier accordion using product object"
```

---

## Task 4: Add configurable scroll target to custom-final-cta.liquid

The final CTA button currently hardcodes `href="#fg-buy-box"`. On the product page the buy box ID is `product-buy-box`. Add a schema setting so the template can override it.

**Files:**
- Modify: `sections/custom-final-cta.liquid` (line 71)

- [ ] **Step 1: Read the current CTA line in `sections/custom-final-cta.liquid`**

Run:
```bash
grep -n "fg-buy-box\|href=" "/e/C Drive/Documents/programs/flushgut-theme/sections/custom-final-cta.liquid"
```

You should see a line like:
```
71:           href="#fg-buy-box"
```

- [ ] **Step 2: Replace hardcoded href with Liquid setting**

In `sections/custom-final-cta.liquid`, find the line with `href="#fg-buy-box"` and replace it with:

```liquid
href="{{ section.settings.cta_scroll_target | default: '#fg-buy-box' }}"
```

- [ ] **Step 3: Add the schema setting**

In the same file, find the `{% schema %}` block. Add this setting to the `"settings"` array (before the closing `]`):

```json
{
  "type": "text",
  "id": "cta_scroll_target",
  "label": "CTA scroll target",
  "default": "#fg-buy-box",
  "info": "ID to scroll to on CTA click. Use #fg-buy-box on homepage, #product-buy-box on product pages."
}
```

- [ ] **Step 4: Commit**

```bash
git add sections/custom-final-cta.liquid
git commit -m "feat: make final CTA scroll target configurable via schema"
```

---

## Task 5: templates/product.flushgut.json + Shopify Admin assignment

**Files:**
- Create: `templates/product.flushgut.json`

One template serves both Orange and Berry — `product.handle` detection inside each section handles the flavor differences.

- [ ] **Step 1: Create `templates/product.flushgut.json`**

```json
{
  "sections": {
    "pg-gallery": {
      "type": "product-image-gallery",
      "settings": {}
    },
    "pg-buy-box": {
      "type": "product-buy-box",
      "settings": {
        "title": "FlushGut Essentials",
        "subtitle": "All-in-One Weekly Gut Support",
        "selling_plan_5wk": "6089310437",
        "selling_plan_11wk": ""
      }
    },
    "pg-benefits": {
      "type": "custom-benefits-row",
      "settings": {}
    },
    "pg-ingredients": {
      "type": "custom-ingredient-scroll",
      "settings": {}
    },
    "pg-format": {
      "type": "custom-format-diff",
      "settings": {}
    },
    "pg-social": {
      "type": "custom-social-proof",
      "settings": {}
    },
    "pg-final-cta": {
      "type": "custom-final-cta",
      "settings": {
        "cta_scroll_target": "#product-buy-box"
      }
    }
  },
  "order": [
    "pg-gallery",
    "pg-buy-box",
    "pg-benefits",
    "pg-ingredients",
    "pg-format",
    "pg-social",
    "pg-final-cta"
  ]
}
```

> **Fill in `selling_plan_11wk`** with the numeric ID from Appstle once you've created the "Every 11 weeks" plan.

- [ ] **Step 2: Commit**

```bash
git add templates/product.flushgut.json
git commit -m "feat: add product.flushgut template — full sales page for Orange + Berry"
```

- [ ] **Step 3: Push theme to Shopify (requires CLI)**

```bash
shopify theme push --store shop.flushgut.com
```

- [ ] **Step 4: Assign template to both products in Shopify Admin**

1. Shopify Admin → Products → **FlushGut - Orange**
2. Scroll to bottom → **Theme template** → select `product.flushgut`
3. Save
4. Repeat for **FlushGut - Berry**

- [ ] **Step 5: Verify on both product pages**

Open the Shopify theme preview for:
- `/products/flushgut-orange` — gallery shows Orange, Berry pill links to Berry page
- `/products/flushgut-berry` — gallery shows Berry, Orange pill links to Orange page

Check:
- Side-by-side gallery on desktop (thumbs left, main image right)
- Flavor pills correct on both pages
- 3-month tier expanded by default
- ATC submits correct `variant_id` and `selling_plan`
- Cart drawer opens
- All content sections below render
- Final CTA button scrolls to `#product-buy-box`
