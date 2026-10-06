# The Lane Company 2

A premium, cinematic digital flagship for The Lane Company 2 — a curated retailer of toys and thoughtfully selected goods. Built as a fully static HTML/CSS/JavaScript site with a navy-and-gold editorial identity, scroll-driven storytelling, a lightweight 3D ambient layer, and a working front-end cart.

## Project Overview

- **Brand**: The Lane Company 2 — variety goods retailer launching with a toy collection, architected to expand into other categories.
- **Visual direction**: deep luxury navy with restrained metallic gold, large editorial serif typography (Fraunces) paired with a clean sans (Manrope), layered depth, mask reveals, pinned scroll sequences.
- **Logo**: a custom geometric "L" monogram (navy roundel, gold ring, ivory letterform, gold accent dot) — no stock/template logo — used as the header/footer wordmark lockup and as `assets/icons/favicon.svg`.
- **Catalog**: 26 products across 8 categories (wooden toys, building blocks, plush & soft, collectibles, vehicles & trains, craft & creative, games & puzzles, gifting), defined once in `assets/js/products.js` and rendered everywhere from that single source.
- **Photography**: real, licensed photography sourced from Pexels (free for commercial use), downloaded and compressed to appropriate display widths into `assets/images/`. No placeholders, no stock-icon-as-product substitutions, no Lorem Ipsum anywhere on the site.

## Technology Used

Strictly front-end, no build step and no framework:

- HTML5, CSS3 (custom properties, CSS Grid/Flexbox), vanilla JavaScript (ES5-compatible, no transpiler needed)
- [GSAP](https://gsap.com/) + ScrollTrigger — scroll-driven reveals, pinned storytelling sections, hero depth/parallax
- [Lenis](https://lenis.darkroom.engineering/) — smooth-scroll enhancement (degrades gracefully without it)
- [Three.js](https://threejs.org/) — a restrained ambient gold-dust particle field behind the homepage hero (WebGL, auto-disabled under `prefers-reduced-motion` or when WebGL is unavailable)
- All three libraries load from CDN (cdnjs / jsdelivr); nothing is bundled or compiled

## Directory Structure

```
/
  index.html            Home — cinematic hero, pinned category showcase, editorial storytelling
  shop.html             Full catalog with filtering + sorting
  toys.html             Toy category landing page with its own pinned "how we choose" sequence
  new-arrivals.html     Newest pieces
  best-sellers.html     Most-loved pieces
  product.html          Product detail template (reads ?id=<product-id>)
  about.html            Brand story and selection philosophy
  faq.html              Accordion FAQ grouped by topic
  contact.html          Contact info + a working mailto-based contact form
  cart.html             Front-end cart (localStorage), quantities, removal, subtotal

/assets
  /css
    reset.css           Minimal modern reset
    variables.css       Design tokens (color, type, spacing, motion)
    global.css          Base layout, header, footer, nav, search, drawer
    components.css      Hero, pinned sections, product cards, forms, cart, PDP, etc.
    animations.css      Reveal/mask/parallax utility classes
    responsive.css       Breakpoint adaptations (1920 → 375px)
  /js
    products.js          Product + category data and shared render helpers
    cart.js               localStorage cart state, chrome wiring, cart page rendering
    navigation.js        Header scroll state, mobile drawer, search overlay
    main.js               Page transitions, footer year, shared accordion logic
    animations.js         GSAP/ScrollTrigger motion system (hero, pin sequences, reveals, tilt)
    scene3d.js             Three.js ambient hero particle layer (index.html only)
    shop.js                Catalog filter/sort engine (shop/toys/new-arrivals/best-sellers)
    product.js             Product detail page rendering
  /images                 Licensed photography (Pexels), pre-sized per usage
  /icons
    favicon.svg           Brand monogram favicon
```

## How to Run Locally

This is a static site — no install or build required. Any static file server works:

```bash
# Python
python -m http.server 8080

# Node (if you have it)
npx http-server . -p 8080
```

Then open `http://localhost:8080/index.html`. Opening the HTML files directly via `file://` also works for most pages, though a local server is recommended so `fetch`/relative-path behavior matches production.

## Animation & 3D Systems

- **Cinematic hero** (`index.html`): layered floating product imagery with mouse-driven parallax, a Three.js gold-dust particle field, and a scroll-scrubbed GSAP timeline that separates the hero as the page scrolls into the next section.
- **Pinned scroll storytelling**: two independent pinned sequences — a 5-stage category showcase on the homepage and a 4-stage "how we choose" sequence on `toys.html` — built with `ScrollTrigger.create({ pin: true, scrub: true })` timelines that scrub frame-to-frame content, imagery and progress indicators.
- **Scroll reveals**: `[data-reveal]` elements fade/slide/scale in once via `ScrollTrigger`, with an instant-reveal fallback when JavaScript or `prefers-reduced-motion` disables motion.
- **Mask reveals**: `[data-mask-reveal]` images animate in via `clip-path` (vertical / diagonal / horizontal variants) rather than a single repeated fade.
- **3D product cards**: pointer-driven tilt (`data-tilt`) plus a floating media layer and animated gold details on hover.
- **Page transitions**: a lightweight curtain transition between internal pages.

All animation code uses `transform`/`opacity` only, is wrapped with `prefers-reduced-motion` fallbacks, and cleans up/refreshes correctly on dynamically-rendered content (filtering, search).

## Product & Cart Functionality

- Catalog, filtering (by category), sorting (featured/new/price/name), and search are all driven from the single `products.js` data source — no duplicated markup.
- Cart state lives in `localStorage` (`lane-co-cart-v1`) and persists across every page: add from any product card or the product detail page, adjust quantity, remove items, and see a live subtotal on `cart.html`.
- Checkout is **not** implemented (no payment gateway or backend exists). The cart page is explicit about this: submitting the cart sends the shopper to `contact.html` to arrange their order directly, rather than simulating a fake successful checkout.
- The contact form composes a `mailto:` message to `alanlane66@gmail.com` — it is honestly described as opening the visitor's email client, since no server-side form handler is implemented.

## Assumptions Made

No company history, product inventory, logo, or legal policy text was supplied, so the following were written to make the site feel finished without fabricating facts:

- Product names, prices, descriptions and specs are original, plausible catalog copy — not real inventory.
- "About" copy describes the brand's selection philosophy rather than a fabricated founding story, year, or team.
- FAQ/shipping/returns copy is written as reasonable, softly-worded customer-service guidance (e.g. "generally," "within 30 days") rather than binding legal policy, since no real policy was provided.
- No reviews, ratings, award claims or customer counts are shown anywhere — all stats shown (category counts, product counts) are derived directly from the real catalog data, not invented.

## What Would Need a Backend Later

- A real payment gateway / checkout flow (Stripe, etc.) — the cart currently hands off to a contact request instead.
- A server-side (or form-service) handler for the contact form, if a `mailto:` client-side flow isn't the desired long-term UX.
- Order management, inventory, and account/auth if the business needs accounts or order history.

## Image Sourcing

All photography is real, licensed photography downloaded from [Pexels](https://www.pexels.com) (free for commercial use, no attribution required under the Pexels License), resized to the dimensions actually used on the page. No AI-generated imagery, stock-icon substitutes, or placeholder graphics are used anywhere on the site.
