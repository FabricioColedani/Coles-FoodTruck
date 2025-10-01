/* script.js
   JS puro para:
   - Navbar sticky + cambio de estilo al hacer scroll
   - Toggle menú en mobile
   - Smooth scroll con offset por navbar
   - Scroll reveal con IntersectionObserver
   - Botón subir arriba (mostrar/ocultar y scroll)
*/

/* -------------------------
   UTILIDADES
------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  // Elementos clave
  const navbar = $('#navbar');
  const backToTop = $('#backToTop');
  const menuToggle = $('#menuToggle');
  const navLinks = $('#navLinks');
  const year = $('#year');

  // Poner año actual en footer
  if (year) year.textContent = new Date().getFullYear();

  /* -------------------------
     NAVBAR: cambio al hacer scroll
  ------------------------- */
  const SCROLL_THRESHOLD = 60;
  const onScroll = () => {
    if (window.scrollY > SCROLL_THRESHOLD) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Mostrar botón subir arriba
    if (window.scrollY > 420) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -------------------------
     MOBILE MENU TOGGLE
  ------------------------- */
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open');
    const expanded = navLinks.classList.contains('open');
    menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  });

  /* -------------------------
     SMOOTH SCROLL + offset (navbar sticky)
  ------------------------- */
  const NAVBAR_OFFSET = navbar.offsetHeight || 72;
  $$('a[data-target]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = a.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;
      const rectTop = targetEl.getBoundingClientRect().top + window.pageYOffset;
      const scrollTo = Math.max(rectTop - NAVBAR_OFFSET - 10, 0);
      window.scrollTo({ top: scrollTo, behavior: 'smooth' });

      // cerrar menú mobile si estaba abierto
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
      }
    });
  });

  /* -------------------------
     SCROLL REVEAL (IntersectionObserver)
  ------------------------- */
  const revealElements = $$('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* -------------------------
     BACK TO TOP
  ------------------------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* -------------------------
     CONTACT FORM: Formspree envía directamente
  ------------------------- */
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      // Opcional: mostrar feedback visual
      const formFeedback = document.getElementById('formFeedback');
      if (formFeedback) {
        formFeedback.style.color = 'green';
        formFeedback.textContent = 'Enviando...';
      }
      // El envío real lo maneja Formspree automáticamente
    });
  }

  /* -------------------------
     Mejora: teclas accesibilidad (volver arriba con tecla U)
  ------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'u') window.scrollTo({top:0, behavior:'smooth'});
  });

  /* -------------------------
     Microcopy: añadir focus visible para accesibilidad
  ------------------------- */
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') document.body.classList.add('show-focus');
  }, { once: true });

});
