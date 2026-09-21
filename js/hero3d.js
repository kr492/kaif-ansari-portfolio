/**
 * 3D hero photo card.
 *
 * Renders the profile photo as the front face of a slightly-extruded
 * 3D card that tilts toward the cursor (mouse-move on desktop,
 * touch-drag on mobile) with a gentle idle sway when untouched.
 * Deliberately simple: a well-lit photo presented in 3D space, not a
 * sci-fi effect layered on top of it.
 *
 * Progressive enhancement, as elsewhere on this page: the <img>
 * fallback in index.html (.hero-photo-img) stays visible until this
 * module has successfully loaded Three.js from the CDN, initialized
 * WebGL, AND loaded the photo texture. If any of that fails — CDN
 * blocked, no WebGL, slow network — the fallback photo simply stays
 * on screen and nothing breaks.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

(function () {
  const stage = document.getElementById('heroPhotoStage');
  const canvas = document.getElementById('heroCanvas');
  if (!stage || !canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  } catch (err) {
    return; // No WebGL — the 2D fallback photo stays visible.
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 10);
  camera.position.set(0, 0, 3.6);

  scene.add(new THREE.AmbientLight(0xffffff, 1.0));
  const key = new THREE.DirectionalLight(0xfff3e0, 0.85);
  key.position.set(2, 2, 3);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8fd6a0, 0.55);
  rim.position.set(-2, -1.5, -2);
  scene.add(rim);

  const loader = new THREE.TextureLoader();
  loader.load(
    'assets/profile.jpg',
    onTextureLoaded,
    undefined,
    function () {
      /* texture failed to load — leave the fallback <img> visible */
    }
  );

  function onTextureLoaded(texture) {
    if ('colorSpace' in texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }

    const geometry = new THREE.BoxGeometry(1.86, 1.86, 0.14, 1, 1, 1);
    const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0x2f5233, roughness: 0.55, metalness: 0.05 });
    const faceMaterial = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.65, metalness: 0.02 });
    // BoxGeometry material order: [+x, -x, +y, -y, +z, -z] — index 4 (+z) faces the camera.
    const mesh = new THREE.Mesh(geometry, [edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, faceMaterial, edgeMaterial]);
    scene.add(mesh);

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let running = true;

    function updateFromPointer(clientX, clientY) {
      const rect = stage.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width - 0.5;
      const py = (clientY - rect.top) / rect.height - 0.5;
      targetY = px * 0.85;
      targetX = -py * 0.55;
    }

    stage.addEventListener('mousemove', function (e) {
      updateFromPointer(e.clientX, e.clientY);
    });
    stage.addEventListener('mouseleave', function () {
      targetX = 0;
      targetY = 0;
    });
    stage.addEventListener(
      'touchmove',
      function (e) {
        if (e.touches && e.touches[0]) {
          updateFromPointer(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true }
    );
    stage.addEventListener('touchend', function () {
      targetX = 0;
      targetY = 0;
    });

    function resize() {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', resize);
    resize();

    const clock = new THREE.Clock();

    function animate() {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      currentX += (targetX - currentX) * Math.min(dt * 4.2, 1);
      currentY += (targetY - currentY) * Math.min(dt * 4.2, 1);
      mesh.rotation.x = currentX + Math.sin(t) * 0.025;
      mesh.rotation.y = currentY + Math.sin(t * 0.8) * 0.045;
      renderer.render(scene, camera);
      if (running && !prefersReducedMotion) requestAnimationFrame(animate);
    }

    // Pause the render loop when the hero scrolls out of view, resume
    // when it's back — keeps this lightweight on long scroll sessions.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          running = entry.isIntersecting;
          if (running && !prefersReducedMotion) requestAnimationFrame(animate);
        });
      }).observe(stage);
    }

    if (prefersReducedMotion) {
      mesh.rotation.y = 0.1;
      renderer.render(scene, camera);
    } else {
      requestAnimationFrame(animate);
    }

    stage.classList.add('photo-3d-ready');
  }
})();
