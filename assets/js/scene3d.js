/**
 * The Lane Company 2 — ambient WebGL depth layer for the homepage hero.
 * A restrained field of drifting gold-dust particles across several depth
 * planes, used only on index.html. Falls back to doing nothing if WebGL
 * or Three.js are unavailable, or the user prefers reduced motion.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('heroScene');
  if (!canvas || typeof THREE === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var supportsWebGL = (function () {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  })();
  if (!supportsWebGL) return;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 18;

  var COUNT = window.innerWidth < 768 ? 180 : 420;
  var geometry = new THREE.BufferGeometry();
  var positions = new Float32Array(COUNT * 3);
  var sizes = new Float32Array(COUNT);

  for (var i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 34;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 24;
    sizes[i] = Math.random() * 1.6 + 0.3;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  var material = new THREE.PointsMaterial({
    color: 0xc9a768,
    size: 0.11,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
    depthWrite: false
  });

  var points = new THREE.Points(geometry, material);
  scene.add(points);

  var mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  }, { passive: true });

  function resize() {
    var w = canvas.clientWidth || window.innerWidth;
    var h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  var clock = new THREE.Clock();
  var running = true;

  var io = new IntersectionObserver(function (entries) {
    running = entries[0].isIntersecting;
  }, { threshold: 0 });
  io.observe(canvas);

  function animate() {
    requestAnimationFrame(animate);
    if (!running) return;
    var t = clock.getElapsedTime();
    points.rotation.y = t * 0.015;
    points.rotation.x = Math.sin(t * 0.08) * 0.04;
    camera.position.x += (mouseX * 2.4 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 1.4 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();
})();
