/**
 * Mohammad Kaif Raza Ansari — portfolio behaviour.
 *
 * - Mobile nav toggle (hamburger <-> close)
 * - Scroll-spy: highlights the nav link for the section in view
 * - Sticky nav gets a shadow once the page has scrolled
 * - Reveal/hide toggle for the "confidential" contact fields
 * - Lightweight CSS 3D tilt on project cards (mouse-follow)
 *
 * The flagship 3D hero photo lives in hero3d.js (Three.js, loaded as
 * a module) so a WebGL failure there can't break anything in here.
 */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ---- Mobile nav toggle ---------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navToggleIcon = document.getElementById('navToggleIcon');

  const ICON_MENU = '<path d="M4 7h16M4 12h16M4 17h16"/>';
  const ICON_CLOSE = '<path d="M6 6l12 12M18 6 6 18"/>';

  function setNavOpen(open) {
    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggleIcon.innerHTML = open ? ICON_CLOSE : ICON_MENU;
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      setNavOpen(!navLinks.classList.contains('open'));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setNavOpen(false);
      });
    });
  }

  // ---- Sticky nav shadow on scroll -----------------------------------
  const siteNav = document.getElementById('siteNav');
  function onScroll() {
    if (!siteNav) return;
    siteNav.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Scroll-spy: highlight the active section in the nav ----------
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinkByHash = {};
  document.querySelectorAll('.nav-link').forEach(function (link) {
    navLinkByHash[link.getAttribute('href')] = link;
  });

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const link = navLinkByHash['#' + entry.target.id];
          if (!link) return;
          document.querySelectorAll('.nav-link.active').forEach(function (a) {
            a.classList.remove('active');
          });
          link.classList.add('active');
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ---- Reveal / hide toggle for contact details ----------------------
  document.querySelectorAll('[data-reveal-toggle]').forEach(function (btn) {
    const row = btn.closest('.reveal-row');
    const valueEl = row ? row.querySelector('[data-reveal]') : null;
    if (!valueEl) return;

    const realValue = valueEl.getAttribute('data-value');
    const maskedValue = valueEl.textContent;
    const slash = btn.querySelector('.eye-slash');
    const labelText = row.querySelector('.reveal-label').textContent.trim();
    let revealed = false;

    btn.addEventListener('click', function () {
      revealed = !revealed;
      valueEl.textContent = revealed ? realValue : maskedValue;
      btn.lastChild.textContent = revealed ? ' Hide' : ' Show';
      if (slash) slash.style.opacity = revealed ? '1' : '0';
      btn.setAttribute('aria-label', (revealed ? 'Hide ' : 'Show ') + labelText);
    });
  });

  // ---- Lightweight 3D tilt on project cards --------------------------
  if (canHover && !reduceMotion) {
    document.querySelectorAll('.project-card').forEach(function (card) {
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const tiltX = (-py * 7).toFixed(2);
        const tiltY = (px * 7).toFixed(2);
        card.style.transform = 'perspective(900px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }
})();
