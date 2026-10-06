/**
 * The Lane Company 2 — header scroll behaviour, mobile drawer, search overlay.
 */
(function (global) {
  'use strict';

  function trapFocus(container) {
    var focusable = container.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return function () {};
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    function handler(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
    container.addEventListener('keydown', handler);
    return function () { container.removeEventListener('keydown', handler); };
  }

  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var lastY = window.scrollY;
    function onScroll() {
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 40);
      lastY = y;
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initMobileDrawer() {
    var toggle = document.querySelector('.nav-toggle');
    var drawer = document.querySelector('.mobile-drawer');
    if (!toggle || !drawer) return;
    var release = null;

    function open() {
      drawer.classList.add('is-open');
      toggle.classList.add('is-active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
      release = trapFocus(drawer);
      var firstLink = drawer.querySelector('a');
      if (firstLink) firstLink.focus({ preventScroll: true });
    }
    function close() {
      drawer.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      if (release) release();
      toggle.focus({ preventScroll: true });
    }

    toggle.addEventListener('click', function () {
      drawer.classList.contains('is-open') ? close() : open();
    });
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });
  }

  function initSearch() {
    var openBtns = document.querySelectorAll('[data-search-open]');
    var overlay = document.querySelector('.search-overlay');
    if (!overlay) return;
    var input = overlay.querySelector('input');
    var resultsEl = overlay.querySelector('[data-search-results]');
    var closeBtn = overlay.querySelector('[data-search-close]');
    var release = null;

    function render(query) {
      if (!resultsEl) return;
      if (!query) { resultsEl.innerHTML = ''; return; }
      var catalog = global.LaneCatalog;
      if (!catalog) return;
      var q = query.trim().toLowerCase();
      var matches = catalog.getAll().filter(function (p) {
        return p.name.toLowerCase().indexOf(q) !== -1 ||
               catalog.getCategoryLabel(p.category).toLowerCase().indexOf(q) !== -1 ||
               p.description.toLowerCase().indexOf(q) !== -1;
      }).slice(0, 7);

      if (!matches.length) {
        resultsEl.innerHTML = '<p class="search-empty">No products found for &ldquo;' + query + '&rdquo;. Try &ldquo;wooden&rdquo;, &ldquo;plush&rdquo; or &ldquo;train&rdquo;.</p>';
        return;
      }
      resultsEl.innerHTML = matches.map(function (p) {
        return '<a class="search-result" href="product.html?id=' + p.id + '">' +
          '<img src="' + p.images[0] + '" alt="" width="52" height="52">' +
          '<span><span class="search-result-name">' + p.name + '</span><span class="search-result-cat">' + catalog.getCategoryLabel(p.category) + '</span></span>' +
          '<span class="search-result-price">' + catalog.formatPrice(p.price) + '</span>' +
        '</a>';
      }).join('');
    }

    function open() {
      overlay.classList.add('is-open');
      document.body.classList.add('no-scroll');
      release = trapFocus(overlay);
      setTimeout(function () { input && input.focus(); }, 300);
    }
    function close() {
      overlay.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      if (release) release();
      if (input) input.value = '';
      render('');
    }

    openBtns.forEach(function (btn) { btn.addEventListener('click', open); });
    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    if (input) input.addEventListener('input', function () { render(input.value); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
      if (e.key === '/' && !overlay.classList.contains('is-open') && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        open();
      }
    });
  }

  function markActiveLink() {
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a, .mobile-drawer-nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initMobileDrawer();
    initSearch();
    markActiveLink();
  });
})(window);
