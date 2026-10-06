/**
 * The Lane Company 2 — product catalog data + shared rendering helpers.
 * Loaded before any page-specific script that needs product data.
 */
(function (global) {
  'use strict';

  var IMG = 'assets/images/';

  var CATEGORIES = [
    { slug: 'wooden-toys', label: 'Wooden Toys', tile: IMG + 'category-wooden.jpg' },
    { slug: 'building-blocks', label: 'Building Blocks', tile: IMG + 'category-building.jpg' },
    { slug: 'plush-soft', label: 'Plush & Soft', tile: IMG + 'category-plush.jpg' },
    { slug: 'collectibles', label: 'Collectibles', tile: IMG + 'category-collectible.jpg' },
    { slug: 'vehicles', label: 'Vehicles & Trains', tile: IMG + 'category-vehicles.jpg' },
    { slug: 'craft-kits', label: 'Craft & Creative', tile: IMG + 'product-craft-kit.jpg' },
    { slug: 'games-puzzles', label: 'Games & Puzzles', tile: IMG + 'product-board-game.jpg' },
    { slug: 'gifts', label: 'Gifting', tile: IMG + 'gift-wrap-1.jpg' }
  ];

  var PRODUCTS = [
    {
      id: 'heirloom-rocking-horse',
      name: 'Heirloom Rocking Horse',
      category: 'wooden-toys',
      price: 248,
      badges: ['bestseller'],
      images: [IMG + 'product-rocking-horse.jpg', IMG + 'pdp-building-1.jpg', IMG + 'pdp-building-2.jpg'],
      description: 'A hand-finished rocking horse built from solid ash, sanded to a silken grain and sealed with a low-sheen oil. Sized for years of play, then a lifetime as a keepsake.',
      details: { materials: 'Solid ash, leather saddle', age: '2+ years', dimensions: '28" L x 14" W x 24" H' }
    },
    {
      id: 'arcadia-arch-blocks',
      name: 'Arcadia Arch Building Blocks',
      category: 'wooden-toys',
      price: 86,
      badges: ['new'],
      images: [IMG + 'product-wooden-blocks.jpg', IMG + 'pdp-building-3.jpg'],
      description: 'Thirty-six architectural blocks in hand-painted hardwood, designed for freeform arches, towers and bridges. Each set is finished with food-safe, non-toxic pigment.',
      details: { materials: 'Beechwood, mineral pigment', age: '18 months+', dimensions: '36-piece set' }
    },
    {
      id: 'heritage-stacking-set',
      name: 'Heritage Letter Stacking Set',
      category: 'wooden-toys',
      price: 64,
      badges: [],
      images: [IMG + 'product-wooden-stacking.jpg', IMG + 'pdp-building-4.jpg'],
      description: 'Engraved alphabet blocks that stack, spell and travel well. A quiet, screen-free companion for early language play.',
      details: { materials: 'Maple, engraved finish', age: '12 months+', dimensions: '26-piece set' }
    },
    {
      id: 'prisma-brick-set',
      name: 'Prisma Construction Brick Set',
      category: 'building-blocks',
      price: 92,
      badges: ['new'],
      images: [IMG + 'product-building-set.jpg', IMG + 'category-building.jpg'],
      description: 'High-clarity interlocking bricks in a considered palette of jewel tones, designed to connect seamlessly with most major building systems.',
      details: { materials: 'ABS plastic, lead-free dye', age: '4+ years', dimensions: '210-piece set' }
    },
    {
      id: 'skyline-builder-kit',
      name: 'Skyline Builder Kit',
      category: 'building-blocks',
      price: 78,
      badges: [],
      images: [IMG + 'product-building-blocks-2.jpg', IMG + 'product-building-set.jpg'],
      description: 'A modular brick kit built around real architectural silhouettes — bridges, towers and pavilions included in the instruction booklet.',
      details: { materials: 'ABS plastic', age: '5+ years', dimensions: '180-piece set' }
    },
    {
      id: 'meadow-bear-plush',
      name: 'Meadow Teddy Bear',
      category: 'plush-soft',
      price: 58,
      badges: ['bestseller'],
      images: [IMG + 'product-teddy-bear.jpg', IMG + 'category-plush.jpg'],
      description: 'Woven from brushed organic cotton and filled with hypoallergenic cluster fibre, finished with hand-stitched features that soften with every wash.',
      details: { materials: 'Organic cotton, cluster fill', age: '0+ years', dimensions: '15" seated height' }
    },
    {
      id: 'cloud-cub-plush',
      name: 'Cloud Cub Plush Collection',
      category: 'plush-soft',
      price: 46,
      badges: [],
      images: [IMG + 'product-plush-soft.jpg', IMG + 'product-teddy-bear.jpg'],
      description: 'A small herd of weighted plush companions, each under a pound, designed for little hands and long car rides alike.',
      details: { materials: 'Minky plush, poly fill', age: '0+ years', dimensions: 'Approx. 10" each' }
    },
    {
      id: 'atelier-doll-set',
      name: 'Atelier Handmade Doll',
      category: 'collectibles',
      price: 112,
      badges: [],
      images: [IMG + 'product-figures-collectible.jpg', IMG + 'category-collectible.jpg'],
      description: 'A limited-run cloth doll, hand-sewn with embroidered features and a wardrobe of two removable linen outfits.',
      details: { materials: 'Linen, cotton thread', age: '3+ years', dimensions: '13" tall' }
    },
    {
      id: 'foundry-figure-series',
      name: 'Foundry Collectible Figure Series',
      category: 'collectibles',
      price: 38,
      badges: ['new'],
      images: [IMG + 'product-figures-set.jpg', IMG + 'best-figures.jpg'],
      description: 'Die-cast miniature figures finished with a hand-applied patina, sold individually across six rotating editions.',
      details: { materials: 'Die-cast alloy', age: '6+ years', dimensions: '3.5" tall' }
    },
    {
      id: 'velocity-roadster',
      name: 'Velocity Diecast Roadster',
      category: 'vehicles',
      price: 54,
      badges: ['bestseller'],
      images: [IMG + 'product-car-red.jpg', IMG + 'category-vehicles.jpg'],
      description: 'A precision diecast roadster with rolling wheels, opening doors and a mirror-polish lacquer finish.',
      details: { materials: 'Diecast metal, ABS trim', age: '3+ years', dimensions: '1:24 scale' }
    },
    {
      id: 'grand-prix-classic',
      name: 'Grand Prix Classic Diecast',
      category: 'vehicles',
      price: 49,
      badges: [],
      images: [IMG + 'product-car-classic.jpg', IMG + 'best-car.jpg'],
      description: 'Inspired by golden-era racing liveries, this diecast model ships in a collector-grade display box.',
      details: { materials: 'Diecast metal', age: '3+ years', dimensions: '1:24 scale' }
    },
    {
      id: 'nightfall-express-train',
      name: 'Nightfall Express Train Set',
      category: 'vehicles',
      price: 134,
      badges: ['bestseller'],
      images: [IMG + 'product-toy-train.jpg', IMG + 'new-train.jpg'],
      description: 'A magnetic-coupling train set with working headlamps, modular track and a brass-accented locomotive.',
      details: { materials: 'Beechwood, metal axles', age: '3+ years', dimensions: '52-piece track set' }
    },
    {
      id: 'marquetry-puzzle',
      name: 'Marquetry Wooden Puzzle',
      category: 'games-puzzles',
      price: 42,
      badges: [],
      images: [IMG + 'product-puzzle.jpg', IMG + 'new-puzzle.jpg'],
      description: 'A layered wooden puzzle depicting a map of the night sky, cut from sustainably sourced birch plywood.',
      details: { materials: 'Birch plywood', age: '5+ years', dimensions: '120 pieces, 16" x 12"' }
    },
    {
      id: 'parlour-game-night',
      name: 'Parlour Game Night Set',
      category: 'games-puzzles',
      price: 68,
      badges: [],
      images: [IMG + 'product-board-game.jpg', IMG + 'new-puzzle.jpg'],
      description: 'Four classic parlour games reimagined in a single walnut-veneered box with brass clasps.',
      details: { materials: 'Walnut veneer, card stock', age: '6+ years', dimensions: '4-in-1 set' }
    },
    {
      id: 'companion-plush-friend',
      name: 'Companion Plush Friend',
      category: 'plush-soft',
      price: 52,
      badges: ['new'],
      images: [IMG + 'product-stuffed-animal.jpg', IMG + 'category-plush.jpg'],
      description: 'A heavyweight plush companion finished with embroidered detailing and a weighted base for comforting play.',
      details: { materials: 'Brushed plush, poly fill', age: '0+ years', dimensions: '17" tall' }
    },
    {
      id: 'keepsake-gift-box',
      name: 'Keepsake Gift Box',
      category: 'gifts',
      price: 28,
      badges: [],
      images: [IMG + 'product-gift-box.jpg', IMG + 'gift-wrap-1.jpg'],
      description: 'A reusable linen-wrapped gift box with a gold foil Lane Company seal, sized to carry any of our smaller sets.',
      details: { materials: 'Linen-wrapped board', age: 'All ages', dimensions: '10" x 8" x 4"' }
    },
    {
      id: 'atelier-craft-studio',
      name: 'Atelier Craft Studio Set',
      category: 'craft-kits',
      price: 72,
      badges: [],
      images: [IMG + 'product-craft-kit.jpg', IMG + 'new-craft.jpg'],
      description: 'A full creative studio in a box — natural pigments, brushes, clay and textured paper, organised in a fold-out tray.',
      details: { materials: 'Mixed media, non-toxic', age: '4+ years', dimensions: '48-piece set' }
    },
    {
      id: 'first-strokes-painting',
      name: 'First Strokes Painting Kit',
      category: 'craft-kits',
      price: 58,
      badges: ['new'],
      images: [IMG + 'product-craft-paint.jpg', IMG + 'best-craft.jpg'],
      description: 'Washable watercolour paints, three natural-bristle brushes and a linen roll-up case for small painters.',
      details: { materials: 'Washable pigment, bristle', age: '3+ years', dimensions: '12-colour set' }
    },
    {
      id: 'atelier-craft-supplies',
      name: 'Atelier Creative Supplies Edit',
      category: 'craft-kits',
      price: 64,
      badges: ['new'],
      images: [IMG + 'new-craft.jpg', IMG + 'product-craft-kit.jpg'],
      description: 'An editor’s selection of our favourite open-ended craft supplies, refreshed each season.',
      details: { materials: 'Mixed media', age: '4+ years', dimensions: 'Curated edit' }
    },
    {
      id: 'twilight-rocking-pony',
      name: 'Twilight Rocking Pony',
      category: 'wooden-toys',
      price: 198,
      badges: ['new'],
      images: [IMG + 'new-rocking-horse.jpg', IMG + 'product-rocking-horse.jpg'],
      description: 'A smaller companion to our Heirloom horse, finished in a deep walnut stain with a hand-stitched bridle.',
      details: { materials: 'Solid walnut, leather', age: '18 months+', dimensions: '22" L x 12" W x 19" H' }
    },
    {
      id: 'lantern-express-railway',
      name: 'Lantern Express Railway',
      category: 'vehicles',
      price: 146,
      badges: ['new'],
      images: [IMG + 'new-train.jpg', IMG + 'product-toy-train.jpg'],
      description: 'An expansion railway with a lantern-lit caboose and curved track pieces, compatible with our Nightfall Express.',
      details: { materials: 'Beechwood, metal axles', age: '3+ years', dimensions: '38-piece expansion' }
    },
    {
      id: 'wordplay-tile-set',
      name: 'Wordplay Tile Set',
      category: 'games-puzzles',
      price: 36,
      badges: ['new'],
      images: [IMG + 'new-puzzle.jpg', IMG + 'product-board-game.jpg'],
      description: 'Oversized letter tiles in a linen drawstring bag, designed for early readers and family game nights.',
      details: { materials: 'Beechwood tiles, linen bag', age: '5+ years', dimensions: '100 tiles' }
    },
    {
      id: 'storybook-character-troupe',
      name: 'Storybook Character Troupe',
      category: 'collectibles',
      price: 84,
      badges: ['bestseller'],
      images: [IMG + 'best-figures.jpg', IMG + 'product-figures-set.jpg'],
      description: 'Six hand-painted characters from our original storybook series, each sold with a fold-out scene card.',
      details: { materials: 'Resin, hand-painted', age: '4+ years', dimensions: '6-piece set' }
    },
    {
      id: 'midnight-circuit-collection',
      name: 'Midnight Circuit Diecast Collection',
      category: 'vehicles',
      price: 96,
      badges: ['bestseller'],
      images: [IMG + 'best-car.jpg', IMG + 'product-car-classic.jpg'],
      description: 'Three diecast racers in a shared midnight-and-gold livery, presented in a magnetic display case.',
      details: { materials: 'Diecast metal', age: '3+ years', dimensions: '3-car set, 1:24 scale' }
    },
    {
      id: 'little-atelier-drawing-club',
      name: 'Little Atelier Drawing Club',
      category: 'craft-kits',
      price: 54,
      badges: ['bestseller'],
      images: [IMG + 'best-craft.jpg', IMG + 'product-craft-paint.jpg'],
      description: 'A monthly-inspired drawing set with graphite, charcoal and a linen sketch roll for budding illustrators.',
      details: { materials: 'Graphite, charcoal, linen', age: '5+ years', dimensions: '24-piece set' }
    },
    {
      id: 'gilded-gift-edit',
      name: 'Gilded Gift Edit',
      category: 'gifts',
      price: 44,
      badges: ['bestseller'],
      images: [IMG + 'best-gift.jpg', IMG + 'gift-wrap-2.jpg'],
      description: 'Our most-gifted wrap: a gold-ribboned box sized for stocking-stuffer sets and small keepsakes.',
      details: { materials: 'Linen-wrapped board', age: 'All ages', dimensions: '8" x 6" x 3"' }
    }
  ];

  function slugify(id) { return id; }

  function getAll() { return PRODUCTS.slice(); }

  function getById(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  function getByCategory(slug) {
    if (!slug || slug === 'all') return getAll();
    return PRODUCTS.filter(function (p) { return p.category === slug; });
  }

  function getByBadge(badge) {
    return PRODUCTS.filter(function (p) { return p.badges.indexOf(badge) !== -1; });
  }

  function getRelated(product, count) {
    count = count || 4;
    var pool = PRODUCTS.filter(function (p) {
      return p.id !== product.id && p.category === product.category;
    });
    if (pool.length < count) {
      var extra = PRODUCTS.filter(function (p) {
        return p.id !== product.id && p.category !== product.category && pool.indexOf(p) === -1;
      });
      pool = pool.concat(extra);
    }
    return pool.slice(0, count);
  }

  function getCategoryLabel(slug) {
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].slug === slug) return CATEGORIES[i].label;
    }
    return slug;
  }

  function formatPrice(value) {
    return '$' + value.toFixed(2).replace(/\.00$/, '');
  }

  function badgeMarkup(badges) {
    if (!badges || !badges.length) return '';
    return '<div class="product-badges">' + badges.map(function (b) {
      var cls = b === 'new' ? 'badge-new' : 'badge-best';
      var label = b === 'new' ? 'New' : 'Bestseller';
      return '<span class="badge ' + cls + '">' + label + '</span>';
    }).join('') + '</div>';
  }

  function cardMarkup(product, index) {
    var img = product.images[0];
    return (
      '<article class="product-card" data-reveal="up" style="transition-delay:' + ((index % 4) * 0.08) + 's">' +
        '<div class="product-card-inner" data-tilt>' +
          '<div class="product-media">' +
            badgeMarkup(product.badges) +
            '<img src="' + img + '" alt="' + product.name + '" loading="lazy" width="600" height="750">' +
            '<a href="product.html?id=' + product.id + '" class="product-quick" aria-label="Quick view ' + product.name + '" data-quickview="' + product.id + '">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>' +
            '</a>' +
          '</div>' +
          '<span class="product-cat">' + getCategoryLabel(product.category) + '</span>' +
          '<h3 class="product-name"><a href="product.html?id=' + product.id + '">' + product.name + '</a></h3>' +
          '<div class="product-foot">' +
            '<span class="product-price">' + formatPrice(product.price) + '</span>' +
            '<button class="product-add" type="button" data-add-to-cart="' + product.id + '" aria-label="Add ' + product.name + ' to cart">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderGrid(container, products) {
    if (!container) return;
    if (!products.length) {
      container.innerHTML = '';
      return false;
    }
    container.innerHTML = products.map(cardMarkup).join('');
    return true;
  }

  global.LaneCatalog = {
    CATEGORIES: CATEGORIES,
    getAll: getAll,
    getById: getById,
    getByCategory: getByCategory,
    getByBadge: getByBadge,
    getRelated: getRelated,
    getCategoryLabel: getCategoryLabel,
    formatPrice: formatPrice,
    cardMarkup: cardMarkup,
    renderGrid: renderGrid
  };
})(window);
