# FlushGut Product Hero — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the gallery+buy-box stacked layout with the approved Maeva-style product page: full-viewport hero section with floating ingredient callouts, then a two-column buy box (product image left, subscription tiers right).

**Architecture:** Three targeted changes to the existing theme. New `product-hero.liquid` section for the callout hero. Updated `product-buy-box.liquid` to add two-column desktop layout with box image. Updated `product.flushgut.json` template to swap gallery → hero.

**Tech Stack:** Shopify Liquid, CSS custom properties, vanilla JS, Dawn OS 2.0

**Working directory:** `E:\C Drive\Documents\programs\flushgut-theme`
**Store domain:** `flushgut.com` (DNS cutover complete — use this for all CLI commands)

**Design reference:** `E:\C Drive\Documents\programs\flushgut-theme\.superpowers\brainstorm\5155-1778621728\content\product-final.html`

---

## File Map

| File | Action | Notes |
|---|---|---|
| `sections/product-hero.liquid` | CREATE | Maeva-style hero — gradient bg, headline left, packet image + floating callouts right |
| `sections/product-buy-box.liquid` | MODIFY | Add two-column layout: box image left, existing form right |
| `templates/product.flushgut.json` | MODIFY | Swap `product-image-gallery` → `product-hero` |

---

## Task 1: sections/product-hero.liquid

**Files:**
- Create: `sections/product-hero.liquid`

The hero uses the exact same gradient background as the live flushgut.com homepage (`hp-01-hero.html`). Left column: headline + overline + CTA + trust badge. Right column: product packet image (from `product.featured_image`) with 6 floating callouts that animate in on load.

- [ ] **Step 1: Create `sections/product-hero.liquid`**

```liquid
{% liquid
  if product.handle == 'flushgut-orange'
    assign packet_alt = 'FlushGut Orange fiber jelly packet'
  else
    assign packet_alt = 'FlushGut Berry fiber jelly packet'
  endif
%}

<style>
.fgh { background-color:#fce8d5; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1721 1721' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"),radial-gradient(circle at 7% 18%,rgb(242,117,33) 0%,rgba(0,0,0,0) 36%),radial-gradient(circle at 72% 12%,rgb(242,117,33) 4%,rgba(0,0,0,0) 24%),radial-gradient(circle at 38% 16%,rgb(159,35,128) 1%,rgba(0,0,0,0) 40%),radial-gradient(circle at 95% 5%,rgb(159,35,128) 5%,rgba(0,0,0,0) 21%); background-blend-mode:soft-light,normal,normal,normal,normal; min-height:calc(100vh - 72px); display:flex; align-items:center; padding:60px var(--container-pad); overflow:hidden; }
.fgh__inner { max-width:var(--container-max); margin:0 auto; width:100%; display:grid; grid-template-columns:360px 1fr; gap:0; align-items:center; }
.fgh__copy { z-index:2; padding-right:24px; }
.fgh__overline { font-family:var(--font-body); font-size:11px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:var(--fg-purple); display:flex; align-items:center; gap:8px; margin-bottom:20px; }
.fgh__overline::before { content:'—'; color:var(--fg-purple); }
.fgh__headline { font-family:var(--font-display); font-size:clamp(52px,5.5vw,78px); font-weight:900; text-transform:uppercase; letter-spacing:var(--track-display); line-height:0.94; color:var(--fg-ink); margin-bottom:20px; }
.fgh__headline em { font-family:'Lora','Georgia',serif; font-style:italic; font-weight:400; text-transform:none; color:var(--fg-orange); display:block; font-size:1.06em; letter-spacing:0; line-height:1.1; }
.fgh__sub { font-size:16px; line-height:1.65; color:#5a3a2a; margin-bottom:28px; max-width:300px; }
.fgh__cta { display:inline-flex; align-items:center; gap:8px; background:var(--fg-orange); color:#fff; font-family:var(--font-body); font-size:13px; font-weight:700; letter-spacing:var(--track-btn); text-transform:uppercase; padding:15px 32px; border-radius:var(--radius-pill); border:none; cursor:pointer; box-shadow:var(--shadow-cta); text-decoration:none; animation:fgh-pulse 2.4s ease-in-out infinite; transition:transform 150ms; }
.fgh__cta:hover { animation-play-state:paused; transform:translateY(-2px); }
@keyframes fgh-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(243,119,33,.55),0 6px 20px rgba(243,119,33,.35)} 50%{box-shadow:0 0 0 12px rgba(243,119,33,0),0 6px 20px rgba(243,119,33,.35)} }
.fgh__trust { margin-top:24px; display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.55); backdrop-filter:blur(8px); border-radius:var(--radius-lg); padding:12px 16px; border:1px solid rgba(255,255,255,0.7); max-width:310px; }
.fgh__trust-stars { color:var(--fg-orange); font-size:15px; letter-spacing:-1px; }
.fgh__trust-text { font-family:var(--font-body); font-size:12px; color:var(--fg-ink); line-height:1.4; }
.fgh__trust-text strong { display:block; font-weight:700; }
.fgh__product { position:relative; display:flex; justify-content:center; align-items:center; min-height:520px; }
.fgh__img { position:relative; z-index:2; max-height:600px; width:auto; max-width:100%; filter:drop-shadow(0 40px 80px rgba(24,6,26,.28)); animation:fgh-float 5s ease-in-out infinite; }
@keyframes fgh-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
.fgh-callout { position:absolute; z-index:3; display:flex; align-items:center; opacity:0; animation:fgh-cin .5s var(--ease-out) forwards; }
@keyframes fgh-cin { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.fgh-callout__pill { background:rgba(255,255,255,0.9); backdrop-filter:blur(12px); border:1.5px solid rgba(255,255,255,0.95); border-radius:var(--radius-pill); padding:9px 16px; font-family:var(--font-body); font-size:13px; font-weight:600; color:var(--fg-ink); white-space:nowrap; box-shadow:0 4px 16px rgba(24,6,26,.1); line-height:1.3; }
.fgh-callout__pill small { display:block; font-family:var(--font-body); font-size:10px; font-weight:500; color:var(--fg-muted); margin-top:1px; white-space:nowrap; }
.fgh-callout__line { height:1.5px; background:rgba(24,6,26,.2); flex-shrink:0; }
.fgh-callout__dot { width:7px; height:7px; border-radius:50%; background:rgba(24,6,26,.25); flex-shrink:0; }
.fgh-callout--left { flex-direction:row; }
.fgh-callout--right { flex-direction:row-reverse; }
.fgh-callout--c1 { top:6%; left:0%; animation-delay:.15s; } .fgh-callout--c1 .fgh-callout__line { width:60px; }
.fgh-callout--c2 { top:34%; left:-6%; animation-delay:.28s; } .fgh-callout--c2 .fgh-callout__line { width:72px; }
.fgh-callout--c3 { bottom:22%; left:0%; animation-delay:.42s; } .fgh-callout--c3 .fgh-callout__line { width:56px; }
.fgh-callout--c4 { top:10%; right:0%; animation-delay:.22s; } .fgh-callout--c4 .fgh-callout__line { width:64px; }
.fgh-callout--c5 { top:42%; right:-4%; animation-delay:.36s; } .fgh-callout--c5 .fgh-callout__line { width:60px; }
.fgh-callout--c6 { bottom:16%; right:2%; animation-delay:.50s; } .fgh-callout--c6 .fgh-callout__line { width:52px; }
@media(max-width:900px){
  .fgh{padding:44px 20px 56px;min-height:auto}
  .fgh__inner{grid-template-columns:1fr;gap:0}
  .fgh__copy{padding-right:0;margin-bottom:40px}
  .fgh__headline{font-size:clamp(56px,13vw,72px)}
  .fgh__product{min-height:360px}
  .fgh__img{max-height:340px}
  .fgh-callout__pill{font-size:11px;padding:6px 12px}
  .fgh-callout--c1{top:0%;left:-2%}
  .fgh-callout--c2{top:35%;left:-8%}
  .fgh-callout--c3{bottom:12%;left:-2%}
  .fgh-callout--c4{top:4%;right:-2%}
  .fgh-callout--c5{top:44%;right:-6%}
  .fgh-callout--c6{display:none}
}
</style>

<section class="fgh" id="fg-product-hero">
  <div class="fgh__inner">

    <div class="fgh__copy">
      <div class="fgh__overline">{{ section.settings.overline }}</div>
      <h1 class="fgh__headline">
        {{ section.settings.headline_line1 }}
        <em>{{ section.settings.headline_line2 }}</em>
      </h1>
      <p class="fgh__sub">{{ section.settings.subheadline }}</p>
      <a href="{{ section.settings.cta_url }}" class="fgh__cta">{{ section.settings.cta_label }}</a>
      <div class="fgh__trust">
        <div class="fgh__trust-stars">★★★★★</div>
        <div class="fgh__trust-text">
          <strong>{{ section.settings.trust_headline }}</strong>
          {{ section.settings.trust_sub }}
        </div>
      </div>
    </div>

    <div class="fgh__product">
      <div class="fgh-callout fgh-callout--left fgh-callout--c1">
        <div class="fgh-callout__pill">7.5g Prebiotic Fiber<small>15 capsules to match this dose</small></div>
        <div class="fgh-callout__line"></div><div class="fgh-callout__dot"></div>
      </div>
      <div class="fgh-callout fgh-callout--left fgh-callout--c2">
        <div class="fgh-callout__pill">No Mixing Required<small>Powders clump. This doesn't.</small></div>
        <div class="fgh-callout__line"></div><div class="fgh-callout__dot"></div>
      </div>
      <div class="fgh-callout fgh-callout--left fgh-callout--c3">
        <div class="fgh-callout__pill">HSA / FSA Eligible<small>Save avg. 30% pre-tax</small></div>
        <div class="fgh-callout__line"></div><div class="fgh-callout__dot"></div>
      </div>
      <div class="fgh-callout fgh-callout--right fgh-callout--c4">
        <div class="fgh-callout__dot"></div><div class="fgh-callout__line"></div>
        <div class="fgh-callout__pill">510M CFU Probiotic<small>Shelf-stable — no fridge needed</small></div>
      </div>
      <div class="fgh-callout fgh-callout--right fgh-callout--c5">
        <div class="fgh-callout__dot"></div><div class="fgh-callout__line"></div>
        <div class="fgh-callout__pill">Zero Added Sugar<small>Gummies can't say that</small></div>
      </div>
      <div class="fgh-callout fgh-callout--right fgh-callout--c6">
        <div class="fgh-callout__dot"></div><div class="fgh-callout__line"></div>
        <div class="fgh-callout__pill">Once Weekly<small>Daily habits fail. Weekly ones stick.</small></div>
      </div>
      <img class="fgh__img"
           src="{{ product.featured_image | image_url: width: 700 }}"
           alt="{{ packet_alt }}"
           width="700"
           loading="eager">
    </div>

  </div>
</section>

{% schema %}
{
  "name": "Product Hero",
  "tag": "div",
  "settings": [
    { "type": "text", "id": "overline", "label": "Overline", "default": "Weekly Fiber Jelly · 22 Ingredients" },
    { "type": "text", "id": "headline_line1", "label": "Headline line 1", "default": "One Jelly Stick." },
    { "type": "text", "id": "headline_line2", "label": "Headline line 2 (italic accent)", "default": "Once a Week." },
    { "type": "text", "id": "subheadline", "label": "Subheadline", "default": "No pills. No powder. No mixing. Just tear, squeeze, and you're done — once a week.*" },
    { "type": "url", "id": "cta_url", "label": "CTA URL", "info": "Use #product-buy-box to scroll to buy box" },
    { "type": "text", "id": "cta_label", "label": "CTA label", "default": "Start My Routine →" },
    { "type": "text", "id": "trust_headline", "label": "Trust badge headline", "default": "4.8 from 150+ beta testers" },
    { "type": "text", "id": "trust_sub", "label": "Trust badge subtext", "default": "Third-party tested · 60-day guarantee" }
  ],
  "presets": [{ "name": "Product Hero" }]
}
{% endschema %}
```

- [ ] **Step 2: Commit**

```bash
git add sections/product-hero.liquid
git commit -m "feat: add product hero section — Maeva-style callouts + gradient"
```

---

## Task 2: Update product-buy-box.liquid — two-column layout with box image

Wrap the existing buy box form in a two-column CSS grid. Left column: product box image (from `section.settings.box_image` or WP CDN fallback). Right column: the existing buy form (unchanged). Mobile collapses to single column.

**Files:**
- Modify: `sections/product-buy-box.liquid`

- [ ] **Step 1: Read the current file**

```bash
head -70 "E:\C Drive\Documents\programs\flushgut-theme\sections\product-buy-box.liquid"
```

Find the opening `<section class="fg-buybox" id="product-buy-box">` line and the closing `</section>` line. Note their line numbers.

- [ ] **Step 2: Add two-column wrapper CSS**

In `sections/product-buy-box.liquid`, find the `</style>` tag (end of the CSS block). Add these rules BEFORE `</style>`:

```css
.fg-buybox { padding: 80px 0; }
.fg-buybox__grid { max-width: 1200px; margin: 0 auto; padding: 0 var(--container-pad); display: grid; grid-template-columns: 1fr 480px; gap: 64px; align-items: center; }
.fg-buybox__product-img { display: flex; align-items: center; justify-content: center; }
.fg-buybox__product-img img { width: 100%; max-width: 480px; border-radius: var(--radius-xl); display: block; filter: drop-shadow(0 24px 48px rgba(24,6,26,.16)); }
.fg-buybox__form-col { max-width: 480px; }
@media (max-width: 900px) {
  .fg-buybox__grid { grid-template-columns: 1fr; gap: 32px; }
  .fg-buybox__product-img img { max-width: 100%; border-radius: var(--radius-lg); }
}
```

- [ ] **Step 3: Wrap existing HTML in two-column grid**

In `sections/product-buy-box.liquid`, find the current `<section class="fg-buybox" id="product-buy-box">` and the `<div class="fg-buybox__inner">` wrapper inside it.

Replace the section opening + inner div with the two-column grid structure. The section becomes:

```liquid
<section class="fg-buybox" id="product-buy-box">
  <div class="fg-buybox__grid">

    <!-- Left: product box image -->
    <div class="fg-buybox__product-img">
      {%- if section.settings.box_image -%}
        <img src="{{ section.settings.box_image | image_url: width: 560 }}"
             alt="FlushGut — Orange &amp; Berry"
             width="560" loading="lazy">
      {%- else -%}
        <img src="https://flushgut.com/wp-content/uploads/2026/05/boxeswithfruit.png"
             alt="FlushGut — Orange &amp; Berry"
             width="560" loading="lazy">
      {%- endif -%}
    </div>

    <!-- Right: buy form -->
    <div class="fg-buybox__form-col">
```

And close with `</div></div></section>` at the end (replacing the old `</div></section>`).

- [ ] **Step 4: Add `box_image` schema setting**

Find the `{% schema %}` block in `sections/product-buy-box.liquid`. Add this setting to the `"settings"` array (before the closing `]`):

```json
,{
  "type": "image_picker",
  "id": "box_image",
  "label": "Product box image (left column)",
  "info": "If empty, uses the default both-boxes image from WP CDN."
}
```

- [ ] **Step 5: Commit**

```bash
git add sections/product-buy-box.liquid
git commit -m "feat: add two-column layout to product buy box — box image left, form right"
```

---

## Task 3: Update product.flushgut.json template

Swap `product-image-gallery` → `product-hero`. Update the CTA URL in the hero settings to scroll to `#product-buy-box`.

**Files:**
- Modify: `templates/product.flushgut.json`

- [ ] **Step 1: Replace `templates/product.flushgut.json`**

```json
{
  "sections": {
    "pg-hero": {
      "type": "product-hero",
      "settings": {
        "overline": "Weekly Fiber Jelly · 22 Ingredients",
        "headline_line1": "One Jelly Stick.",
        "headline_line2": "Once a Week.",
        "subheadline": "No pills. No powder. No mixing. Just tear, squeeze, and you're done — once a week.*",
        "cta_url": "#product-buy-box",
        "cta_label": "Start My Routine →",
        "trust_headline": "4.8 from 150+ beta testers",
        "trust_sub": "Third-party tested · 60-day guarantee"
      }
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
    "pg-benefits": { "type": "custom-benefits-row", "settings": {} },
    "pg-ingredients": { "type": "custom-ingredient-scroll", "settings": {} },
    "pg-format": { "type": "custom-format-diff", "settings": {} },
    "pg-social": { "type": "custom-social-proof", "settings": {} },
    "pg-final-cta": {
      "type": "custom-final-cta",
      "settings": { "cta_scroll_target": "#product-buy-box" }
    }
  },
  "order": [
    "pg-hero",
    "pg-buy-box",
    "pg-benefits",
    "pg-ingredients",
    "pg-format",
    "pg-social",
    "pg-final-cta"
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add templates/product.flushgut.json
git commit -m "feat: update product template — swap gallery for hero section"
```

- [ ] **Step 3: Push to Shopify (requires CLI)**

```bash
shopify theme push --store flushgut.com
```
