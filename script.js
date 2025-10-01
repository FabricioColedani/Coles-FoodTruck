/* script.js
   Funcionalidades:
   - Navbar sticky + estilo al hacer scroll
   - Toggle menú mobile
   - Smooth scroll
   - Scroll reveal animado
   - Botón subir arriba
   - Validación y envío de comentarios vía EmailJS
*/

/* -------------------------
   UTILIDADES
------------------------- */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  const navbar = $('#navbar');
  const backToTop = $('#backToTop');
  const menuToggle = $('#menuToggle');
  const navLinks = $('#navLinks');
  const year = $('#year');
  const contactForm = $('#contactForm');
  const formFeedback = $('#formFeedback');

  // Año actual en footer
  if(year) year.textContent = new Date().getFullYear();

  /* -------------------------
     SCROLL NAVBAR & BACK TO TOP
  ------------------------- */
  const SCROLL_THRESHOLD = 60;
  const onScroll = () => {
    if(window.scrollY > SCROLL_THRESHOLD) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    if(window.scrollY > 420) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({top:0, behavior:'smooth'});
  });

  /* -------------------------
     MOBILE MENU TOGGLE
  ------------------------- */
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open');
    const expanded = navLinks.classList.contains('open');
    menuToggle.setAttribute('aria-expanded', expanded ? 'true':'false');
  });

  /* -------------------------
     SMOOTH SCROLL
  ------------------------- */
  const NAVBAR_OFFSET = navbar.offsetHeight || 72;
  $$('a[data-target]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const targetId = a.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if(!targetEl) return;
      const rectTop = targetEl.getBoundingClientRect().top + window.pageYOffset;
      const scrollTo = Math.max(rectTop - NAVBAR_OFFSET - 10, 0);
      window.scrollTo({top:scrollTo, behavior:'smooth'});

      if(navLinks.classList.contains('open')){
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
      }
    });
  });

  /* -------------------------
     SCROLL REVEAL
  ------------------------- */
  const revealElements = $$('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {root:null, rootMargin:"0px 0px -8% 0px", threshold:0.12});
  revealElements.forEach(el => revealObserver.observe(el));

  /* -------------------------
     CONTACT FORM + EMAILJS
  ------------------------- */
  if(contactForm){
    emailjs.init('TU_USER_ID'); // reemplazar TU_USER_ID con tu EmailJS user ID

    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      formFeedback.textContent = '';
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if(!name || !email || !message){
        formFeedback.style.color='crimson';
        formFeedback.textContent='Por favor completá todos los campos.';
        return;
      }
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRe.test(email)){
        formFeedback.style.color='crimson';
        formFeedback.textContent='Ingresá un email válido.';
        return;
      }

      formFeedback.style.color='green';
      formFeedback.textContent='Enviando...';

      // EmailJS: enviar formulario a tu Gmail
      const serviceID = 'TU_SERVICE_ID';   // reemplazar
      const templateID = 'TU_TEMPLATE_ID'; // reemplazar

      emailjs.send(serviceID, templateID, {
        from_name: name,
        from_email: email,
        message: message
      }).then(()=>{
        contactForm.reset();
        formFeedback.textContent='¡Gracias! Tu mensaje fue enviado correctamente.';
      }, (err)=>{
        formFeedback.style.color='crimson';
        formFeedback.textContent='Error al enviar. Intentá de nuevo.';
        console.error(err);
      });
    });
  }

  /* -------------------------
     ACCESIBILIDAD TECLAS
  ------------------------- */
  document.addEventListener('keydown', e=>{
    if(e.key.toLowerCase()==='u') window.scrollTo({top:0, behavior:'smooth'});
  });

  document.addEventListener('keyup', e=>{
    if(e.key==='Tab') document.body.classList.add('show-focus');
  }, {once:true});
});
