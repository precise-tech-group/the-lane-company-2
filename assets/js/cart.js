/**
 * The Lane Company 2 — cart state (localStorage) + shared cart UI wiring.
 * Depends on products.js (window.LaneCatalog) when rendering line items.
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'lane-co-cart-v1';

  function read() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) { /* storage unavailable — fail silently, cart stays in-memory for this view */ }
    document.dispatchEvent(new CustomEvent('lane:cart-updated', { detail: { items: items } }));
  }

  function addItem(productId, qty) {
    qty = qty || 1;
    var items = read();
    var existing = items.filter(function (i) { return i.id === productId; })[0];
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id: productId, qty: qty });
    }
    write(items);
    return items;
  }

  function updateQty(productId, qty) {
    var items = read();
    items = items.map(function (i) {
      if (i.id === productId) i.qty = Math.max(1, qty);
      return i;
    });
    write(items);
    return items;
  }

  function removeItem(productId) {
    var items = read().filter(function (i) { return i.id !== productId; });
    write(items);
    return items;
  }

  function clear() { write([]); }

  function count() {
    return read().reduce(function (sum, i) { return sum + i.qty; }, 0);
  }

  function lineItems() {
    if (!global.LaneCatalog) return [];
    var catalog = global.LaneCatalog;
    return read().map(function (i) {
      var product = catalog.getById(i.id);
      if (!product) return null;
      return { product: product, qty: i.qty, lineTotal: product.price * i.qty };
    }).filter(Boolean);
  }

  function subtotal() {
    return lineItems().reduce(function (sum, li) { return sum + li.lineTotal; }, 0);
  }

  /* ---- Shared chrome wiring: header cart badge, toast, add-to-cart delegation ---- */
  function updateBadges() {
    var n = count();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = n;
      el.classList.toggle('is-visible', n > 0);
    });
  }

  function showToast(message) {
    var toast = document.querySelector('[data-toast]');
    if (!toast) return;
    toast.querySelector('[data-toast-message]').textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2600);
  }

  function initChrome() {
    updateBadges();
    document.addEventListener('lane:cart-updated', updateBadges);

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-add-to-cart]');
      if (!btn) return;
      e.preventDefault();
      var id = btn.getAttribute('data-add-to-cart');
      var qtyInput = btn.closest('form, .pdp-actions, .product-card') ? btn.closest('form, .pdp-actions, .product-card').querySelector('[data-qty-input]') : null;
      var qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
      addItem(id, qty);
      var product = global.LaneCatalog ? global.LaneCatalog.getById(id) : null;
      showToast((product ? product.name : 'Item') + ' added to cart');
      btn.classList.add('is-added');
      setTimeout(function () { btn.classList.remove('is-added'); }, 900);
    });
  }

  /* ---- Full cart page rendering ---- */
  function renderCartPage() {
    var root = document.querySelector('[data-cart-page]');
    if (!root || !global.LaneCatalog) return;
    var catalog = global.LaneCatalog;
    var listEl = root.querySelector('[data-cart-list]');
    var emptyEl = root.querySelector('[data-cart-empty]');
    var summaryEl = root.querySelector('[data-cart-summary]');
    var subtotalEl = root.querySelector('[data-cart-subtotal]');
    var totalEl = root.querySelector('[data-cart-total]');
    var countLabelEl = root.querySelector('[data-cart-item-count]');

    function rowMarkup(li) {
      var p = li.product;
      return (
        '<div class="cart-row" data-cart-row="' + p.id + '">' +
          '<img src="' + p.images[0] + '" alt="' + p.name + '" width="96" height="96">' +
          '<div class="cart-row-info">' +
            '<div class="cart-row-name"><a href="product.html?id=' + p.id + '">' + p.name + '</a></div>' +
            '<span class="cart-row-cat">' + catalog.getCategoryLabel(p.category) + '</span>' +
          '</div>' +
          '<div class="cart-row-qty">' +
            '<div class="qty-stepper">' +
              '<button type="button" data-row-decrease aria-label="Decrease quantity">&minus;</button>' +
              '<input type="number" value="' + li.qty + '" min="1" max="99" data-row-qty aria-label="Quantity for ' + p.name + '">' +
              '<button type="button" data-row-increase aria-label="Increase quantity">+</button>' +
            '</div>' +
          '</div>' +
          '<span class="cart-row-price">' + catalog.formatPrice(li.lineTotal) + '</span>' +
          '<button type="button" class="cart-row-remove" data-row-remove aria-label="Remove ' + p.name + ' from cart">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>' +
          '</button>' +
        '</div>'
      );
    }

    function render() {
      var items = lineItems();
      var sub = subtotal();

      if (!items.length) {
        if (listEl) listEl.innerHTML = '';
        if (emptyEl) emptyEl.style.display = '';
        if (summaryEl) summaryEl.style.display = 'none';
        return;
      }

      if (emptyEl) emptyEl.style.display = 'none';
      if (summaryEl) summaryEl.style.display = '';
      if (listEl) listEl.innerHTML = items.map(rowMarkup).join('');
      if (subtotalEl) subtotalEl.textContent = catalog.formatPrice(sub);
      if (totalEl) totalEl.textContent = catalog.formatPrice(sub);
      if (countLabelEl) countLabelEl.textContent = count() + (count() === 1 ? ' item' : ' items');
    }

    root.addEventListener('click', function (e) {
      var row = e.target.closest('[data-cart-row]');
      if (!row) return;
      var id = row.getAttribute('data-cart-row');
      var input = row.querySelector('[data-row-qty]');

      if (e.target.closest('[data-row-increase]')) {
        updateQty(id, (parseInt(input.value, 10) || 1) + 1);
        render();
      } else if (e.target.closest('[data-row-decrease]')) {
        updateQty(id, Math.max(1, (parseInt(input.value, 10) || 1) - 1));
        render();
      } else if (e.target.closest('[data-row-remove]')) {
        removeItem(id);
        render();
      }
    });

    root.addEventListener('change', function (e) {
      if (!e.target.matches('[data-row-qty]')) return;
      var row = e.target.closest('[data-cart-row]');
      var id = row.getAttribute('data-cart-row');
      updateQty(id, Math.max(1, parseInt(e.target.value, 10) || 1));
      render();
    });

    render();
  }

  global.LaneCart = {
    read: read,
    addItem: addItem,
    updateQty: updateQty,
    removeItem: removeItem,
    clear: clear,
    count: count,
    lineItems: lineItems,
    subtotal: subtotal,
    showToast: showToast,
    initChrome: initChrome,
    renderCartPage: renderCartPage
  };

  document.addEventListener('DOMContentLoaded', function () {
    initChrome();
    renderCartPage();
  });
})(window);
