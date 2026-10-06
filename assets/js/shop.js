/**
 * The Lane Company 2 — catalog filtering/sorting engine.
 * Shared by shop.html, toys.html, new-arrivals.html, best-sellers.html.
 *
 * Grid container needs: id="productGrid" data-source="all|new|bestseller"
 *   optional data-categories="wooden-toys,vehicles" to restrict the base set.
 * Optional: [data-filter-chips], [data-sort-select], [data-result-count], [data-empty-state]
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('productGrid');
    if (!grid || !window.LaneCatalog) return;
    var catalog = window.LaneCatalog;

    var source = grid.getAttribute('data-source') || 'all';
    var restrictCats = (grid.getAttribute('data-categories') || '').split(',').filter(Boolean);

    var chipsEl = document.querySelector('[data-filter-chips]');
    var sortEl = document.querySelector('[data-sort-select]');
    var countEl = document.querySelector('[data-result-count]');
    var emptyEl = document.querySelector('[data-empty-state]');

    function baseSet() {
      var all = catalog.getAll();
      if (source === 'new') all = all.filter(function (p) { return p.badges.indexOf('new') !== -1; });
      if (source === 'bestseller') all = all.filter(function (p) { return p.badges.indexOf('bestseller') !== -1; });
      if (restrictCats.length) all = all.filter(function (p) { return restrictCats.indexOf(p.category) !== -1; });
      return all;
    }

    var activeCategory = 'all';

    function buildChips() {
      if (!chipsEl) return;
      var present = {};
      baseSet().forEach(function (p) { present[p.category] = true; });
      var cats = catalog.CATEGORIES.filter(function (c) { return present[c.slug]; });
      var html = '<button class="chip is-active" type="button" data-cat="all">All</button>';
      html += cats.map(function (c) {
        return '<button class="chip" type="button" data-cat="' + c.slug + '">' + c.label + '</button>';
      }).join('');
      chipsEl.innerHTML = html;
      chipsEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.chip');
        if (!btn) return;
        chipsEl.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-active'); });
        btn.classList.add('is-active');
        activeCategory = btn.getAttribute('data-cat');
        update();
      });
    }

    function sortList(list) {
      var mode = sortEl ? sortEl.value : 'featured';
      var copy = list.slice();
      if (mode === 'price-asc') copy.sort(function (a, b) { return a.price - b.price; });
      else if (mode === 'price-desc') copy.sort(function (a, b) { return b.price - a.price; });
      else if (mode === 'name-asc') copy.sort(function (a, b) { return a.name.localeCompare(b.name); });
      else if (mode === 'new') copy.sort(function (a, b) {
        return (b.badges.indexOf('new') !== -1 ? 1 : 0) - (a.badges.indexOf('new') !== -1 ? 1 : 0);
      });
      return copy;
    }

    function update() {
      var list = baseSet();
      if (activeCategory !== 'all') list = list.filter(function (p) { return p.category === activeCategory; });
      list = sortList(list);

      var hasResults = catalog.renderGrid(grid, list);
      if (countEl) countEl.textContent = list.length + (list.length === 1 ? ' piece' : ' pieces');
      if (emptyEl) emptyEl.style.display = hasResults ? 'none' : '';
      grid.style.display = hasResults ? '' : 'none';

      if (window.LaneMotion) window.LaneMotion.refresh();
    }

    buildChips();
    if (sortEl) sortEl.addEventListener('change', update);
    update();
  });
})();
