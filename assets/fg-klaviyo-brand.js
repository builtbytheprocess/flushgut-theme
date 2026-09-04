/* Tag the Klaviyo popup's buttons so the theme can style them.
 *
 * Klaviyo renders both the submit and the dismiss as <button type="button">
 * with generated class names (go3634373664, go488503511) that change every
 * time the form is republished. There is no stable CSS selector separating
 * them, so this adds our own classes by DOM order: the first non-close button
 * is the primary action, anything after it is secondary.
 *
 * Appearance only — the copy and the offer code live in Klaviyo's dashboard.
 */
(function () {
  'use strict';

  function tag(form) {
    var buttons = Array.prototype.filter.call(
      form.querySelectorAll('button'),
      function (b) { return !b.classList.contains('klaviyo-close-form'); }
    );
    buttons.forEach(function (b, i) {
      b.classList.add(i === 0 ? 'fg-kl-primary' : 'fg-kl-secondary');
    });
  }

  function scan() {
    document.querySelectorAll('.klaviyo-form').forEach(function (form) {
      if (form.dataset.fgBranded) return;
      form.dataset.fgBranded = '1';
      tag(form);
    });
  }

  // The popup mounts well after load and can remount, so watch for it rather
  // than running once.
  if (typeof MutationObserver === 'function') {
    new MutationObserver(scan).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }
})();
