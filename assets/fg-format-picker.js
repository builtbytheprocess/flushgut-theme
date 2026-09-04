/* FlushGut Essentials — format + flavour picker, and add to cart.
 *
 * Replaces fg-buy-box.js for the 2026 buy box. Two levels of choice:
 *
 *   Format  — Jelly / Gummy / Capsule. Separate products, so selecting one
 *             swaps the variant and the selling plan.
 *   Flavour — Orange / Berry within a format. Also separate products in this
 *             catalogue rather than variants of one.
 *
 * DESIGN RULE (client, 2026-09-03): selecting a flavour changes the package
 * image and what goes in the cart. It must change nothing else — no background
 * tint, no accent colour, no reflow. Prices are refreshed from live data, which
 * today is identical across flavours, so nothing visibly moves. Keep it that
 * way: do not add flavour-conditional styling here.
 *
 * A card with data-live="false" is inert: it cannot be selected, and the CTA
 * stays disabled unless another card is selectable.
 */
(function () {
  'use strict';

  function init() {
    var box = document.getElementById('fg-buy-box');
    if (!box) return;

    var cards = Array.prototype.slice.call(box.querySelectorAll('[data-format]'));
    var form = box.querySelector('[data-atc-form]');
    var variantInput = box.querySelector('[data-variant-input]');
    var planInput = box.querySelector('[data-selling-plan-input]');
    var onetimeBtn = box.querySelector('[data-onetime]');
    var submitBtn = box.querySelector('[data-atc-btn]');

    var subscribing = true;
    var selected = null;

    function isLive(card) { return card.getAttribute('data-live') === 'true'; }

    // ── Flavour ────────────────────────────────────────────────────────────
    // Writes the chosen flavour's data onto its parent card, swaps the package
    // image, and refreshes that card's price text. Nothing outside the card.
    function selectFlavour(card, btn) {
      var chips = card.querySelectorAll('[data-flavor]');
      Array.prototype.forEach.call(chips, function (c) {
        var on = c === btn;
        c.classList.toggle('is-selected', on);
        c.setAttribute('aria-checked', on ? 'true' : 'false');
      });

      card.setAttribute('data-variant-id', btn.getAttribute('data-variant-id') || '');
      card.setAttribute('data-selling-plan', btn.getAttribute('data-selling-plan') || '');
      card.setAttribute('data-sub-price', btn.getAttribute('data-sub-price') || '');
      card.setAttribute('data-one-price', btn.getAttribute('data-one-price') || '');

      var img = card.querySelector('[data-flavor-image]');
      var src = btn.getAttribute('data-image');
      if (img && src) {
        img.src = src;
        img.alt = (btn.textContent || '').trim();
      }

      var main = card.querySelector('[data-price-main]');
      if (main) main.textContent = btn.getAttribute('data-sub-price') || main.textContent;

      var cmp = card.querySelector('[data-price-compare]');
      if (cmp) cmp.textContent = (btn.getAttribute('data-one-price') || '') + ' / box';

      var save = card.querySelector('[data-save-label]');
      if (save) {
        var pct = parseInt(btn.getAttribute('data-save'), 10);
        if (pct > 0) { save.textContent = '(Save ' + pct + '%)'; save.hidden = false; }
        else { save.hidden = true; }
      }

      if (selected === card) sync();
    }

    cards.forEach(function (card) {
      Array.prototype.forEach.call(card.querySelectorAll('[data-flavor]'), function (btn) {
        btn.addEventListener('click', function () {
          if (!isLive(card)) return;
          selectFlavour(card, btn);
        });
      });
    });

    // ── Format ─────────────────────────────────────────────────────────────
    function select(card) {
      if (!card || !isLive(card)) return;
      selected = card;
      cards.forEach(function (c) {
        var on = c === card;
        c.classList.toggle('is-selected', on);
        var head = c.querySelector('.fg-format__head');
        if (head) head.setAttribute('aria-checked', on ? 'true' : 'false');
      });
      sync();
    }

    function sync() {
      if (!selected) {
        if (submitBtn) submitBtn.disabled = true;
        return;
      }
      if (variantInput) variantInput.value = selected.getAttribute('data-variant-id') || '';
      var plan = selected.getAttribute('data-selling-plan') || '';
      if (planInput) {
        planInput.value = subscribing ? plan : '';
        planInput.disabled = !subscribing || !plan;
      }
      if (submitBtn) submitBtn.disabled = !variantInput || !variantInput.value;
    }

    cards.forEach(function (card) {
      var head = card.querySelector('.fg-format__head');
      if (!head) return;
      head.addEventListener('click', function () { select(card); });
      head.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); select(card); }
      });
    });

    if (onetimeBtn) {
      onetimeBtn.dataset.subscribeLabel = onetimeBtn.textContent.trim();
      onetimeBtn.setAttribute('aria-pressed', 'false');
      onetimeBtn.addEventListener('click', function () {
        subscribing = !subscribing;
        onetimeBtn.setAttribute('aria-pressed', subscribing ? 'false' : 'true');
        onetimeBtn.textContent = subscribing
          ? onetimeBtn.dataset.subscribeLabel
          : 'Back to Subscribe & Save';
        sync();
      });
    }

    select(cards.filter(isLive)[0]);
    sync();

    // ── Add to cart ────────────────────────────────────────────────────────
    if (form) {
      form.addEventListener('submit', function (evt) {
        evt.preventDefault();
        if (!variantInput || !variantInput.value) return;

        var label = submitBtn ? submitBtn.querySelector('[data-cta-label]') : null;
        var defaultLabel = submitBtn ? submitBtn.dataset.defaultLabel : '';
        if (submitBtn) submitBtn.disabled = true;
        if (label) label.textContent = 'Adding…';

        var payload = { id: parseInt(variantInput.value, 10), quantity: 1 };
        if (planInput && !planInput.disabled && planInput.value) {
          payload.selling_plan = parseInt(planInput.value, 10);
        }

        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ items: [payload] })
        })
          .then(function (res) {
            if (!res.ok) return res.json().then(function (e) { throw e; });
            return res.json();
          })
          .then(function () {
            openCartDrawer();
            if (submitBtn) submitBtn.disabled = false;
            if (label) label.textContent = defaultLabel;
          })
          .catch(function (err) {
            console.error('[FlushGut] add to cart failed:', err);
            if (submitBtn) submitBtn.disabled = false;
            if (label) label.textContent = 'Try again';
          });
      });
    }

    function openCartDrawer() {
      var drawer = document.querySelector('cart-drawer');
      if (drawer && typeof drawer.open === 'function') { drawer.open(); return; }
      var notification = document.querySelector('cart-notification');
      if (notification && typeof notification.open === 'function') { notification.open(); return; }
      window.location.href = '/cart';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', init);
})();
