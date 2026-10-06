/**
 * The Lane Company 2 — product detail page logic.
 * Reads ?id=<product-id> from the URL and renders the full PDP.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var root = document.querySelector('[data-pdp-root]');
    if (!root || !window.LaneCatalog) return;
    var catalog = window.LaneCatalog;

    var params = new URLSearchParams(location.search);
    var id = params.get('id');
    var product = id ? catalog.getById(id) : null;

    if (!product) {
      product = catalog.getAll()[0];
    }

    document.title = product.name + ' | The Lane Company 2';
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', product.description);

    var mainImg = root.querySelector('[data-pdp-main-img]');
    var mainWrap = root.querySelector('[data-pdp-main]');
    var thumbsEl = root.querySelector('[data-pdp-thumbs]');
    var catEl = root.querySelector('[data-pdp-cat]');
    var nameEl = root.querySelector('[data-pdp-name]');
    var priceEl = root.querySelector('[data-pdp-price]');
    var descEl = root.querySelector('[data-pdp-desc]');
    var addBtn = root.querySelector('[data-add-to-cart]');
    var qtyInput = root.querySelector('[data-qty-input]');
    var breadcrumbCat = root.querySelector('[data-pdp-breadcrumb-cat]');
    var metaMaterials = root.querySelector('[data-pdp-materials]');
    var metaAge = root.querySelector('[data-pdp-age]');
    var metaDims = root.querySelector('[data-pdp-dimensions]');

    var breadcrumbName = document.querySelector('[data-pdp-breadcrumb-name]');

    if (catEl) catEl.textContent = catalog.getCategoryLabel(product.category);
    if (nameEl) nameEl.textContent = product.name;
    if (breadcrumbName) breadcrumbName.textContent = product.name;
    if (priceEl) priceEl.textContent = catalog.formatPrice(product.price);
    if (descEl) descEl.textContent = product.description;
    if (addBtn) addBtn.setAttribute('data-add-to-cart', product.id);
    if (breadcrumbCat) {
      breadcrumbCat.textContent = catalog.getCategoryLabel(product.category);
      breadcrumbCat.setAttribute('href', 'shop.html?category=' + product.category);
    }
    if (metaMaterials) metaMaterials.textContent = product.details.materials;
    if (metaAge) metaAge.textContent = product.details.age;
    if (metaDims) metaDims.textContent = product.details.dimensions;

    function setMain(src, animate) {
      if (!mainImg) return;
      if (animate && window.gsap) {
        window.gsap.fromTo(mainImg, { opacity: 0.3, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
      }
      mainImg.src = src;
      mainImg.alt = product.name;
    }

    if (mainImg) setMain(product.images[0], false);

    if (thumbsEl) {
      thumbsEl.innerHTML = product.images.map(function (src, i) {
        return '<button type="button" class="' + (i === 0 ? 'is-active' : '') + '" data-thumb-index="' + i + '" aria-label="View image ' + (i + 1) + '"><img src="' + src + '" alt="" loading="lazy"></button>';
      }).join('');
      thumbsEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-thumb-index]');
        if (!btn) return;
        thumbsEl.querySelectorAll('button').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var idx = parseInt(btn.getAttribute('data-thumb-index'), 10);
        setMain(product.images[idx], true);
      });
    }

    if (mainWrap) {
      mainWrap.addEventListener('click', function () {
        mainWrap.classList.toggle('is-zoomed');
      });
    }

    if (qtyInput) {
      root.querySelectorAll('[data-qty-decrease]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
        });
      });
      root.querySelectorAll('[data-qty-increase]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          qtyInput.value = Math.min(99, (parseInt(qtyInput.value, 10) || 1) + 1);
        });
      });
    }

    if (window.LaneAccordion) window.LaneAccordion.init(root);

    /* ---- Related products ---- */
    var relatedGrid = document.querySelector('[data-related-grid]');
    if (relatedGrid) {
      var related = catalog.getRelated(product, 4);
      catalog.renderGrid(relatedGrid, related);
    }

    if (window.LaneMotion) window.LaneMotion.refresh();
  });
})();
