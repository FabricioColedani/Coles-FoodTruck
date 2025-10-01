/* script.js
   JS puro para:
   - Navbar sticky + cambio de estilo al hacer scroll
   - Toggle menú en mobile
   - Smooth scroll con offset por navbar
   - Scroll reveal con IntersectionObserver
   - Botón subir arriba (mostrar/ocultar y scroll)
   - Validación simple de formulario (envío simulado)
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
    // Toggle simple: cuando abierto, mostramos enlaces en columna (estilos via CSS no incluidos para brevity,
    // pero aquí podemos alternar aria-expanded).
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
      // Compute position minus navbar height
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

  // También botón "Ver Menú" (usa anchor normal)
  const verMenuBtn = $('#verMenuBtn');
  if (verMenuBtn){
    verMenuBtn.addEventListener('click', (e) => {
      // allow the anchor handler above to handle via data-target? if not, just scroll
    });
  }

  /* -------------------------
     SCROLL REVEAL (IntersectionObserver)
     ------------------------- */
  const revealElements = $$('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target); // reveal once
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
     CONTACT FORM (validación básica + simulación envío)
     ------------------------- */
  const contactForm = $('#contactForm');
  const formFeedback = $('#formFeedback');
  if (contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formFeedback.textContent = '';
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      // Validación simple
      if (!name || !email || !message) {
        formFeedback.style.color = 'crimson';
        formFeedback.textContent = 'Por favor, completá todos los campos.';
        return;
      }
      // Email simple regex
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) {
        formFeedback.style.color = 'crimson';
        formFeedback.textContent = 'Ingresá un email válido.';
        return;
      }

      // Simular envío (aquí podrías integrar fetch a tu API)
      formFeedback.style.color = 'green';
      formFeedback.textContent = 'Enviando...';

      // Simulación de 1s
      setTimeout(() => {
        contactForm.reset();
        formFeedback.style.color = 'green';
        formFeedback.textContent = '¡Gracias! Tu mensaje fue enviado correctamente.';
      }, 1000);
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
