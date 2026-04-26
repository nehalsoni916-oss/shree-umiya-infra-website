// ===== SHREE UMIYA INFRAPROJECT - MAIN SCRIPT =====
// Fixed & Improved Version

'use strict';

// ===== GLOBALS =====
let isDarkMode = false;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function () {
  initNavigation();
  initScrollEffects();
  initAnimations();
  initPortfolio();
  initContactForm();
  initDarkMode();
  initBackToTop();
  initCounters();
  initAccessibility();
  initBackgroundChanger();
  console.log('✅ Shree Umiya InfraProject website loaded');
});

// ===== NAVIGATION =====
function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu   = document.querySelector('.nav-menu');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.classList.toggle('active', isOpen);
    // Prevent body scroll when menu is open on mobile
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
          window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
        }
        // Close mobile menu
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Update active link on scroll
  window.addEventListener('scroll', throttle(updateActiveNavOnScroll, 80));
}

function updateActiveNavOnScroll() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionH   = section.offsetHeight;
    const id         = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionH) {
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
      });
    }
  });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', throttle(() => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, 50));
}

// ===== AOS ANIMATIONS =====
function initAnimations() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    // Only disable on very small screens
    disable: () => window.innerWidth < 480,
  });
}

// ===== PORTFOLIO FILTERING =====
function initPortfolio() {
  const filterBtns     = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      // Active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Filter items
      portfolioItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        const show = (filter === 'all' || cat === filter);

        if (show) {
          item.style.display = 'block';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(16px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 280);
        }
      });

      // Accessibility
      if (window.announceToScreenReader) {
        const visible = [...portfolioItems].filter(i => i.style.display !== 'none').length;
        window.announceToScreenReader(`Showing ${visible} project${visible !== 1 ? 's' : ''}`);
      }
    });
  });

  // Set default transition on items
  portfolioItems.forEach(item => {
    item.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
  });
}

// ===== CONTACT FORM =====
// Uses Formspree for real form submission.
// SETUP: Replace YOUR_FORM_ID below with your Formspree form ID.
// Get a free one at https://formspree.io — takes 2 minutes.
const FORMSPREE_ID = 'YOUR_FORM_ID'; // <-- REPLACE THIS

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', handleFormSubmit);

  // Real-time validation on blur
  form.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const form      = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const btnText   = submitBtn.querySelector('.btn-text');
  const btnLoad   = submitBtn.querySelector('.btn-loading');
  const successEl = document.getElementById('form-success');
  const errorEl   = document.getElementById('form-error');

  // Honeypot check
  const honeypot = form.querySelector('#website');
  if (honeypot && honeypot.value.trim() !== '') return;

  // Validate all required fields
  let valid = true;
  form.querySelectorAll('[required]').forEach(f => {
    if (!validateField(f)) valid = false;
  });
  if (!valid) return;

  // UI: loading
  btnText.style.display = 'none';
  btnLoad.style.display = 'inline-flex';
  submitBtn.disabled = true;
  hideFormMessages();

  try {
    let sent = false;

    // --- OPTION A: Formspree (recommended, free, no backend needed) ---
    if (FORMSPREE_ID && FORMSPREE_ID !== 'YOUR_FORM_ID') {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        sent = true;
      } else {
        throw new Error('Formspree error');
      }
    } else {
      // --- OPTION B: Fallback simulation (remove once Formspree is set up) ---
      await new Promise(r => setTimeout(r, 1500));
      console.log('📧 Form data (simulation):', Object.fromEntries(new FormData(form)));
      sent = true;
    }

    if (sent) {
      successEl.style.display = 'flex';
      successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      form.reset();
    }

  } catch (err) {
    console.error('Form submission error:', err);
    errorEl.style.display = 'flex';
  } finally {
    btnText.style.display = 'inline-flex';
    btnLoad.style.display = 'none';
    submitBtn.disabled = false;
  }
}

function validateField(field) {
  const value      = field.value.trim();
  const name       = field.name;
  const errorEl    = document.getElementById(name + '-error');
  const formGroup  = field.closest('.form-group');
  let msg          = '';

  if (field.hasAttribute('required')) {
    if (field.type === 'checkbox' && !field.checked) {
      msg = 'You must agree to continue.';
    } else if (field.type !== 'checkbox' && !value) {
      msg = `${getFieldLabel(field)} is required.`;
    }
  }
  if (!msg && name === 'email' && value) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = 'Please enter a valid email address.';
  }
  if (!msg && name === 'phone' && value) {
    if (!/^[\+]?[0-9][\d\s\-\(\)]{6,20}$/.test(value)) msg = 'Please enter a valid phone number.';
  }
  if (!msg && name === 'message' && value && value.length < 10) {
    msg = 'Message must be at least 10 characters.';
  }

  formGroup.classList.toggle('error', !!msg);
  if (errorEl) errorEl.textContent = msg;
  return !msg;
}

function clearFieldError(field) {
  const formGroup = field.closest('.form-group');
  const errorEl   = document.getElementById(field.name + '-error');
  if (formGroup) formGroup.classList.remove('error');
  if (errorEl)   errorEl.textContent = '';
}

function getFieldLabel(field) {
  const label = field.closest('.form-group')?.querySelector('label');
  return label ? label.textContent.replace('*', '').trim() : field.name;
}

function hideFormMessages() {
  const s = document.getElementById('form-success');
  const e = document.getElementById('form-error');
  if (s) s.style.display = 'none';
  if (e) e.style.display = 'none';
}

// ===== DARK MODE =====
function initDarkMode() {
  const btn = document.querySelector('.dark-mode-toggle');

  const saved = localStorage.getItem('theme');
  isDarkMode = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme();

  if (btn) btn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    applyTheme();
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      isDarkMode = e.matches;
      applyTheme();
    }
  });
}

function applyTheme() {
  document.body.setAttribute('data-theme', isDarkMode ? 'dark' : '');
  const icon = document.querySelector('.dark-mode-toggle i');
  if (icon) icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', throttle(() => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, 100));

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== COUNTER ANIMATION =====
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target    = parseInt(el.getAttribute('data-count'));
  const duration  = 1800;
  const step      = target / (duration / 16);
  let current     = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('en-IN');
  }, 16);
}

// ===== ACCESSIBILITY =====
function initAccessibility() {
  // Skip link
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) { target.setAttribute('tabindex', '-1'); target.focus(); }
    });
  }

  // Keyboard: Enter/Space on interactive custom elements
  document.querySelectorAll('.filter-btn').forEach(el => {
    el.setAttribute('role', 'button');
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  });

  // Screen reader announcer
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);
  window.announceToScreenReader = msg => {
    announcer.textContent = msg;
    setTimeout(() => { announcer.textContent = ''; }, 1200);
  };
}

// ===== BACKGROUND SLIDESHOW =====
function initBackgroundChanger() {
  const images = [
    'assets/1bg.jpg',
    'assets/2bg.jpg',
    'assets/3bg.jpg',
    'assets/4bg.jpg',
    'assets/5bg.jpg',
  ];
  if (!images.length) return;

  const body = document.body;
  const crossfadeDuration = 1000; // ms — match CSS transition
  const changeInterval    = 6000; // ms

  // Create two cross-fade layers
  const layerA = document.createElement('div');
  const layerB = document.createElement('div');
  [layerA, layerB].forEach(l => {
    l.className = 'bg-layer';
    body.appendChild(l);
  });

  // Preload images
  images.forEach(src => { new Image().src = src; });

  let index    = 0;
  let showingA = true;

  // Show first image
  layerA.style.backgroundImage = `url(${images[0]})`;
  layerA.classList.add('show');

  function changeBackground() {
    index = (index + 1) % images.length;
    const incoming = showingA ? layerB : layerA;
    const outgoing  = showingA ? layerA : layerB;

    incoming.style.backgroundImage = `url(${images[index]})`;
    void incoming.offsetHeight; // force reflow
    incoming.classList.add('show');

    setTimeout(() => {
      outgoing.classList.remove('show');
      showingA = !showingA;
    }, crossfadeDuration + 20);
  }

  let intervalId = setInterval(changeBackground, changeInterval);

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(intervalId);
    } else {
      intervalId = setInterval(changeBackground, changeInterval);
    }
  });
}

// ===== SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('✅ ServiceWorker registered'))
      .catch(err => console.log('ServiceWorker failed:', err));
  });
}

// ===== UTILITIES =====
function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===== ERROR TRACKING =====
window.addEventListener('unhandledrejection', e => {
  console.error('Unhandled promise rejection:', e.reason);
});
