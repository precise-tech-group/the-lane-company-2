/**
 * The Lane Company 2 — global glue: page transitions, footer year, nav toggles.
 */
(function () {
  'use strict';

  function initFooterYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  function isInternalNavigable(link) {
    if (!link || !link.href) return false;
    if (link.target && link.target !== '' && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;
    if (link.getAttribute('href') && link.getAttribute('href').indexOf('#') === 0) return false;
    var url = new URL(link.href, location.href);
    return url.origin === location.origin && /\.html($|\?)/.test(url.pathname) || url.pathname === location.pathname;
  }

  function initPageTransitions() {
    var overlay = document.querySelector('.page-transition');
    if (!overlay) return;

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { overlay.classList.remove('is-covering'); });
    });

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (!isInternalNavigable(link)) return;
      var url = new URL(link.href, location.href);
      if (url.href === location.href) return;

      e.preventDefault();
      overlay.classList.add('is-active');
      setTimeout(function () { location.href = url.href; }, 480);
    });
  }

  /**
   * Accessible accordion: toggles [data-accordion-group] panels independently
   * (FAQ) or within a scoped root (PDP details). Panels animate via max-height.
   */
  function initAccordionIn(scope) {
    scope.querySelectorAll('.accordion-item').forEach(function (item) {
      if (item._accordionBound) return;
      item._accordionBound = true;
      var trigger = item.querySelector('.accordion-trigger');
      var panel = item.querySelector('.accordion-panel');
      if (!trigger || !panel) return;
      var exclusive = item.closest('[data-accordion-exclusive]');

      trigger.setAttribute('aria-expanded', 'false');
      trigger.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        if (exclusive) {
          exclusive.querySelectorAll('.accordion-item').forEach(function (i) {
            i.classList.remove('is-open');
            i.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
            i.querySelector('.accordion-panel').style.maxHeight = null;
          });
        }
        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        } else {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          panel.style.maxHeight = null;
        }
      });
    });
  }

  window.LaneAccordion = {
    init: function (scope) { initAccordionIn(scope || document); }
  };

  document.addEventListener('DOMContentLoaded', function () {
    initFooterYear();
    initPageTransitions();
    initAccordionIn(document);
  });
})();
