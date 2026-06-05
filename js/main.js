/* GrapezZ — main.js */

/* ── Fade-in on scroll ── */
(function () {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ── Stat counter animation ── */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();
      (function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target);
        if (p < 1) requestAnimationFrame(step);
      })(start);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
})();

/* ── Lightbox ── */
window.openLb = function (src) {
  const overlay = document.getElementById('lb');
  if (!overlay) return;
  document.getElementById('lb-img').src = src;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeLb = function () {
  const overlay = document.getElementById('lb');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
};

document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeLb(); });

/* ── Contact form ── */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const naam = form.querySelector('[name="naam"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const bericht = form.querySelector('[name="bericht"]').value.trim();
    if (!naam || !email || !bericht) {
      alert('Vul alle verplichte velden in.');
      return;
    }
    const msg = document.getElementById('success-msg');
    if (msg) { msg.style.display = 'block'; }
    form.reset();
    msg && msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();
