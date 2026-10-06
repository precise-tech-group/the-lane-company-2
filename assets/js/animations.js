/**
 * The Lane Company 2 — motion system.
 * Requires GSAP + ScrollTrigger (CDN) loaded before this file.
 * Lenis (CDN) is optional — smooth scroll degrades gracefully without it.
 */
(function (global) {
  'use strict';

  var reduceMotion = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = !!global.gsap;
  if (hasGSAP && global.ScrollTrigger) global.gsap.registerPlugin(global.ScrollTrigger);

  /* ---------------------------------------------------------------------
   * Preloader
   * ------------------------------------------------------------------- */
  function initPreloader() {
    var pre = document.querySelector('.preloader');
    if (!pre) return;
    var finish = function () {
      pre.classList.add('is-done');
      document.body.classList.remove('no-scroll');
    };
    if (document.readyState === 'complete') {
      setTimeout(finish, reduceMotion ? 0 : 500);
    } else {
      document.body.classList.add('no-scroll');
      window.addEventListener('load', function () {
        setTimeout(finish, reduceMotion ? 0 : 650);
      });
      setTimeout(finish, 2600); // hard safety cap
    }
  }

  /* ---------------------------------------------------------------------
   * Lenis smooth scroll (optional enhancement)
   * ------------------------------------------------------------------- */
  function initSmoothScroll() {
    if (reduceMotion || typeof global.Lenis !== 'function') return null;
    var lenis = new global.Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (hasGSAP && global.ScrollTrigger) {
      lenis.on('scroll', global.ScrollTrigger.update);
      global.gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      global.gsap.ticker.lagSmoothing(0);
    }
    return lenis;
  }

  /* ---------------------------------------------------------------------
   * Custom cursor
   * ------------------------------------------------------------------- */
  function initCursor() {
    var dot = document.querySelector('.cursor-dot');
    if (!dot || reduceMotion) return;
    var x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; });
    (function loop() {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, [data-tilt]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { dot.classList.add('is-active'); });
      el.addEventListener('mouseleave', function () { dot.classList.remove('is-active'); });
    });
  }

  /* ---------------------------------------------------------------------
   * Scroll progress bar
   * ------------------------------------------------------------------- */
  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    function update() {
      var h = document.documentElement;
      var scrolled = h.scrollTop || document.body.scrollTop;
      var height = h.scrollHeight - h.clientHeight;
      bar.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + '%';
    }
    document.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------------
   * Scroll reveals — [data-reveal] elements fade/slide in once.
   * ------------------------------------------------------------------- */
  function initReveals() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (!hasGSAP || !global.ScrollTrigger || reduceMotion) {
      items.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }

    items.forEach(function (el) {
      global.ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: function () { el.classList.add('is-revealed'); }
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Split-text line reveal for the hero headline
   * ------------------------------------------------------------------- */
  function splitLines(el) {
    var text = el.textContent;
    el.innerHTML = '<span>' + text + '</span>';
    return el.querySelector('span');
  }

  function initHeroTitle() {
    var lines = document.querySelectorAll('.hero-title .line');
    if (!lines.length) return;
    var spans = Array.prototype.map.call(lines, splitLines);
    if (!hasGSAP || reduceMotion) {
      spans.forEach(function (s) { s.style.transform = 'none'; });
      return;
    }
    global.gsap.set(spans, { yPercent: 115 });
    global.gsap.to(spans, {
      yPercent: 0,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.12,
      delay: 0.5
    });
  }

  /* ---------------------------------------------------------------------
   * Cinematic hero: mouse parallax + scroll-driven depth transform
   * ------------------------------------------------------------------- */
  function initHero() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var floats = hero.querySelectorAll('.hero-float');
    var bg = hero.querySelector('.hero-bg');

    if (!reduceMotion && floats.length) {
      hero.addEventListener('mousemove', function (e) {
        var rect = hero.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        floats.forEach(function (f, i) {
          var depth = (i + 1) * 10;
          var tx = px * depth;
          var ty = py * depth;
          if (hasGSAP) {
            global.gsap.to(f, { x: tx, y: ty, duration: 0.9, ease: 'power3.out', overwrite: 'auto' });
          } else {
            f.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
          }
        });
      });
    }

    if (hasGSAP && global.ScrollTrigger && !reduceMotion) {
      global.gsap.timeline({
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 }
      })
        .to(bg, { scale: 1.3, opacity: 0.15, ease: 'none' }, 0)
        .to(floats, { yPercent: -40, opacity: 0, stagger: 0.05, ease: 'none' }, 0)
        .to('.hero-content', { yPercent: -18, opacity: 0, ease: 'none' }, 0);
    }
  }

  /* ---------------------------------------------------------------------
   * Pinned storytelling sections — [data-pin-section]
   * Each contains [data-pin-stage] with repeated [data-pin-frame] panels.
   * Scrubs through frames while the viewport stays pinned.
   * ------------------------------------------------------------------- */
  function initPinnedSections() {
    var sections = document.querySelectorAll('[data-pin-section]');
    if (!sections.length || !hasGSAP || !global.ScrollTrigger || reduceMotion) {
      sections.forEach(function (sec) {
        sec.querySelectorAll('[data-pin-frame]').forEach(function (f, i) {
          f.style.display = i === 0 ? 'grid' : 'none';
        });
      });
      return;
    }

    sections.forEach(function (sec) {
      var frames = sec.querySelectorAll('[data-pin-frame]');
      var progress = sec.querySelectorAll('.pin-progress span');
      if (frames.length < 2) return;

      frames.forEach(function (f, i) { if (i > 0) global.gsap.set(f, { autoAlpha: 0 }); });

      var tl = global.gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: 'top top',
          end: '+=' + (frames.length * 100) + '%',
          scrub: 0.7,
          pin: true,
          anticipatePin: 1
        }
      });

      frames.forEach(function (frame, i) {
        if (i === 0) return;
        var prev = frames[i - 1];
        tl.to(prev.querySelector('.pin-visual'), { scale: 1.06, autoAlpha: 0.4, duration: 0.4, ease: 'power2.inOut' })
          .to(prev, { autoAlpha: 0, duration: 0.2 }, '<0.1')
          .fromTo(frame, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, '<')
          .fromTo(frame.querySelector('.pin-visual'), { scale: 1.1 }, { scale: 1, duration: 0.5, ease: 'power2.out' }, '<')
          .fromTo(frame.querySelectorAll('.pin-copy > *'), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.06 }, '<0.1')
          .add('frame' + i);

        if (progress.length) {
          tl.call(function () {
            progress.forEach(function (p, pi) { p.classList.toggle('is-active', pi === i); });
          }, null, '<');
        }
      });

      if (progress.length) {
        global.ScrollTrigger.create({
          trigger: sec,
          start: 'top top',
          onEnter: function () { progress.forEach(function (p, pi) { p.classList.toggle('is-active', pi === 0); }); }
        });
      }
    });
  }

  /* ---------------------------------------------------------------------
   * Mask / clip reveals for editorial imagery — [data-mask-reveal]
   * ------------------------------------------------------------------- */
  function initMaskReveals() {
    var items = document.querySelectorAll('[data-mask-reveal]');
    if (!items.length) return;
    if (!hasGSAP || !global.ScrollTrigger || reduceMotion) return;

    items.forEach(function (el) {
      var img = el.querySelector('img');
      var direction = el.getAttribute('data-mask-reveal') || 'vertical';
      var clipFrom, clipTo = 'inset(0% 0% 0% 0%)';
      if (direction === 'vertical') clipFrom = 'inset(0% 0% 100% 0%)';
      else if (direction === 'diagonal') clipFrom = 'polygon(0 0,0 0,0 100%,0 100%)';
      else clipFrom = 'inset(0% 100% 0% 0%)';

      global.gsap.set(el, { clipPath: direction === 'diagonal' ? clipFrom : clipFrom, webkitClipPath: clipFrom });
      global.gsap.set(img, { scale: 1.25 });

      global.ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: function () {
          var toClip = direction === 'diagonal' ? 'polygon(0 0,100% 0,100% 100%,0 100%)' : clipTo;
          global.gsap.to(el, { clipPath: toClip, webkitClipPath: toClip, duration: 1.3, ease: 'power4.inOut' });
          global.gsap.to(img, { scale: 1, duration: 1.6, ease: 'power3.out' });
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Parallax images — [data-parallax] moves against scroll
   * ------------------------------------------------------------------- */
  function initParallax() {
    var items = document.querySelectorAll('[data-parallax]');
    if (!items.length || !hasGSAP || !global.ScrollTrigger || reduceMotion) return;
    items.forEach(function (el) {
      var amount = parseFloat(el.getAttribute('data-parallax')) || 60;
      global.gsap.to(el, {
        y: amount,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  /* ---------------------------------------------------------------------
   * 3D product card pointer tilt — [data-tilt]
   * ------------------------------------------------------------------- */
  function initTilt() {
    if (reduceMotion || !global.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      var bounds;
      function onMove(e) {
        bounds = bounds || card.getBoundingClientRect();
        var px = (e.clientX - bounds.left) / bounds.width - 0.5;
        var py = (e.clientY - bounds.top) / bounds.height - 0.5;
        var rx = (py * -8).toFixed(2);
        var ry = (px * 10).toFixed(2);
        card.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(0)';
      }
      card.addEventListener('mouseenter', function () { bounds = card.getBoundingClientRect(); });
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'rotateX(0) rotateY(0)';
        bounds = null;
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Counting numbers — [data-count-to]
   * ------------------------------------------------------------------- */
  function initCounters() {
    var items = document.querySelectorAll('[data-count-to]');
    if (!items.length) return;
    items.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var suffix = el.getAttribute('data-count-suffix') || '';
      var run = function () {
        if (reduceMotion || !hasGSAP) { el.textContent = target + suffix; return; }
        var obj = { val: 0 };
        global.gsap.to(obj, {
          val: target, duration: 1.6, ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.round(obj.val) + suffix; }
        });
      };
      if (hasGSAP && global.ScrollTrigger && !reduceMotion) {
        global.ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: run });
      } else {
        run();
      }
    });
  }

  /* ---------------------------------------------------------------------
   * Boot
   * ------------------------------------------------------------------- */
  function boot() {
    if (reduceMotion) document.documentElement.classList.add('reduced-motion');
    initPreloader();
    initSmoothScroll();
    initCursor();
    initScrollProgress();
    initHeroTitle();
    initHero();
    initReveals();
    initPinnedSections();
    initMaskReveals();
    initParallax();
    initTilt();
    initCounters();

    if (hasGSAP && global.ScrollTrigger) {
      window.addEventListener('load', function () { global.ScrollTrigger.refresh(); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /** Re-scan for [data-reveal] / [data-tilt] after dynamic DOM injection (filters, search). */
  global.LaneMotion = {
    refresh: function () {
      initReveals();
      initTilt();
      if (hasGSAP && global.ScrollTrigger) global.ScrollTrigger.refresh();
    }
  };
})(window);
