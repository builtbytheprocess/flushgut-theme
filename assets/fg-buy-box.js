(function () {
  'use strict';

  function initBuyBox() {
    const box = document.getElementById('fg-buy-box');
    if (!box) return;

    const form = box.querySelector('[data-atc-form]');
    const variantInput = box.querySelector('[data-variant-input]');
    const sellingPlanInput = box.querySelector('[data-selling-plan-input]');
    const ctaLabel = box.querySelector('[data-cta-label]');

    // ── Accordion ────────────────────────────────────────────
    box.querySelectorAll('[data-tier]').forEach(function (tier) {
      tier.addEventListener('click', function () {
        // Collapse all tiers
        box.querySelectorAll('[data-tier]').forEach(function (t) {
          t.setAttribute('aria-expanded', 'false');
          t.classList.remove('fg-tier--selected');
          var perks = t.querySelector('[data-tier-perks]');
          if (perks) perks.style.maxHeight = '0';
        });
        // Expand clicked tier
        tier.setAttribute('aria-expanded', 'true');
        tier.classList.add('fg-tier--selected');
        var perks = tier.querySelector('[data-tier-perks]');
        if (perks) perks.style.maxHeight = perks.scrollHeight + 'px';
        // Update selling plan
        var plan = tier.dataset.sellingPlan || '';
        var price = tier.dataset.price || '';
        if (sellingPlanInput) {
          sellingPlanInput.value = plan;
          sellingPlanInput.disabled = !plan;
        }
        updateCta(price);
      });
    });

    // ── Flavor toggle ────────────────────────────────────────
    box.querySelectorAll('[data-flavor-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        box.querySelectorAll('[data-flavor-btn]').forEach(function (b) {
          b.classList.remove('fg-flavor--active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('fg-flavor--active');
        btn.setAttribute('aria-pressed', 'true');
        if (variantInput) variantInput.value = btn.dataset.variantId;
        // Swap product image
        var imgTarget = box.querySelector('[data-flavor-image]');
        if (imgTarget && btn.dataset.imageSrc) {
          imgTarget.src = btn.dataset.imageSrc;
          imgTarget.alt = btn.dataset.imageAlt || '';
        }
      });
    });

    // ── ATC form submission ──────────────────────────────────
    if (form) {
      form.addEventListener('submit', function (evt) {
        evt.preventDefault();
        var btn = form.querySelector('[data-atc-btn]');
        if (btn) {
          btn.disabled = true;
          btn.querySelector('[data-cta-label]').textContent = 'Adding…';
        }

        var payload = {
          id: variantInput ? parseInt(variantInput.value, 10) : null,
          quantity: 1
        };
        var plan = sellingPlanInput && !sellingPlanInput.disabled
          ? sellingPlanInput.value
          : null;
        if (plan) payload.selling_plan = parseInt(plan, 10);

        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ items: [payload] })
        })
          .then(function (res) {
            if (!res.ok) return res.json().then(function (e) { throw e; });
            return res.json();
          })
          .then(function () {
            openCartDrawer();
            if (btn) {
              btn.disabled = false;
              var defaultLabel = btn.dataset.defaultLabel || 'Start My FlushGut Routine';
              btn.querySelector('[data-cta-label]').textContent = defaultLabel;
            }
          })
          .catch(function (err) {
            console.error('[FlushGut] ATC error:', err);
            if (btn) {
              btn.disabled = false;
              btn.querySelector('[data-cta-label]').textContent = 'Try again';
            }
          });
      });
    }

    function openCartDrawer() {
      var drawer = document.querySelector('cart-drawer');
      if (!drawer) { window.location.href = '/cart'; return; }

      // Update cart count, then open
      fetch('/cart.js', { headers: { 'Accept': 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (cart) {
          // Update header cart count bubbles
          document.querySelectorAll('.cart-count-bubble span:not(.visually-hidden)').forEach(function (el) {
            el.textContent = cart.item_count;
          });
          // Open Dawn's cart drawer
          if (typeof drawer.open === 'function') {
            drawer.open();
          }
        })
        .catch(function () {
          window.location.href = '/cart';
        });
    }

    function updateCta(price) {
      if (ctaLabel && price) {
        ctaLabel.textContent = 'Start My FlushGut Routine — ' + price;
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBuyBox);
  } else {
    initBuyBox();
  }
})();
