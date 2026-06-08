/* ============================================
   GRAPELINE — WIJN & LOGISTIEK
   ============================================ */

(function () {
    'use strict';

    const header    = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const nav       = document.getElementById('nav');
    const navLinks  = document.querySelectorAll('.nav-link');
    const hero      = document.querySelector('.hero');

    /* ---- Header scroll state ---- */
    function onScroll() {
        if (window.scrollY > 55) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateActiveLink();
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---- Hero background animation on load ---- */
    window.addEventListener('load', function () {
        if (hero) hero.classList.add('loaded');
    });

    /* ---- Hamburger menu ---- */
    hamburger.addEventListener('click', function () {
        const isOpen = nav.classList.toggle('open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close nav when a link is clicked */
    navLinks.forEach(function (link) {
        link.addEventListener('click', closeNav);
    });

    /* Close nav when clicking outside */
    nav.addEventListener('click', function (e) {
        if (e.target === nav) closeNav();
    });

    function closeNav() {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    /* Close nav on Escape key */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
            closeNav();
        }
    });

    /* ---- Smooth scroll for anchor links ---- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            var offset = header.offsetHeight + 8;
            var top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    /* ---- Active nav link on scroll ---- */
    var sections = Array.from(document.querySelectorAll('section[id]'));

    function updateActiveLink() {
        var scrollY = window.scrollY + header.offsetHeight + 40;

        for (var i = sections.length - 1; i >= 0; i--) {
            var section = sections[i];
            if (section.offsetTop <= scrollY) {
                var id = section.getAttribute('id');
                navLinks.forEach(function (link) {
                    var href = link.getAttribute('href');
                    if (href === '#' + id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
                break;
            }
        }
    }

    /* ---- Scroll-triggered animations (IntersectionObserver) ---- */

    /* Group siblings for staggered delay */
    var groups = new Map();
    document.querySelectorAll('[data-animate]').forEach(function (el) {
        var parent = el.parentElement;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(el);
    });

    groups.forEach(function (children) {
        children.forEach(function (el, i) {
            el.style.transitionDelay = (i * 0.09) + 's';
        });
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('[data-animate]').forEach(function (el) {
        observer.observe(el);
    });

    /* ---- Contact form handler ---- */
    var form      = document.getElementById('contact-form');
    var submitBtn = document.getElementById('submit-btn');
    var successEl = document.getElementById('form-success');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Versturen...';

            /* Simulate async send — replace with real endpoint if needed */
            setTimeout(function () {
                form.reset();
                submitBtn.style.display = 'none';
                successEl.style.display = 'flex';
                successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 1200);
        });
    }

    /* ---- Animated number counter for stats ---- */
    var statNumbers = document.querySelectorAll('.stat-number');

    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var finalText = el.getAttribute('data-value') || el.textContent.trim();
            var numeric = parseInt(finalText.replace(/\D/g, ''), 10);

            if (isNaN(numeric) || numeric === 0) return;

            var suffix = finalText.replace(/[0-9]/g, '');
            var duration = 1400;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(eased * numeric) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
        var text = el.textContent.trim();
        var num  = parseInt(text.replace(/\D/g, ''), 10);
        if (!isNaN(num) && num > 0) {
            el.setAttribute('data-value', text);
            counterObserver.observe(el);
        }
    });

})();
