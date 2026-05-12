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
