// ===== MAIN JAVASCRIPT FILE =====
// Shree Umiya HR Website - Interactive Functionality

// ===== GLOBAL VARIABLES =====
let currentTestimonial = 0;
let testimonialInterval;
let isDarkMode = false;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// ===== INITIALIZATION FUNCTION =====
function initializeWebsite() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeTestimonials();
    initializePortfolio();
    initializeContactForm();
    initializeDarkMode();
    initializeBackToTop();
    initializeCounters();
    initializeLazyLoading();
    initializeAccessibility();
    initializeBackgroundChanger(); 
    
    console.log('Shree Umiya HR Website initialized successfully');
}

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Update hamburger animation
            navToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navToggle.setAttribute('aria-expanded', 'false');
                        navToggle.classList.remove('active');
                    }
                    
                    // Update active nav link
                    updateActiveNavLink(targetId);
                }
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', throttle(updateActiveNavOnScroll, 100));
}

function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            updateActiveNavLink('#' + sectionId);
        }
    });
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', throttle(function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 10));
}

// ===== ANIMATIONS (AOS) =====
function initializeAnimations() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: function() {
                // Disable animations on mobile for better performance
                return window.innerWidth < 768;
            }
        });
    }
}

// ===== TESTIMONIALS SLIDER =====
function initializeTestimonials() {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dots = document.querySelectorAll('.dot');
    
    if (testimonialItems.length === 0) return;
    
    // Auto-rotate testimonials
    startTestimonialRotation();
    
    // Manual navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            showTestimonial(currentTestimonial - 1);
            resetTestimonialInterval();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            showTestimonial(currentTestimonial + 1);
            resetTestimonialInterval();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showTestimonial(index);
            resetTestimonialInterval();
        });
    });
    
    // Pause on hover
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopTestimonialRotation);
        slider.addEventListener('mouseleave', startTestimonialRotation);
    }
}

function showTestimonial(index) {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    
    if (testimonialItems.length === 0) return;
    
    // Hide all testimonials
    testimonialItems.forEach(item => item.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current testimonial
    currentTestimonial = index;
    if (currentTestimonial >= testimonialItems.length) {
        currentTestimonial = 0;
    }
    if (currentTestimonial < 0) {
        currentTestimonial = testimonialItems.length - 1;
    }
    
    testimonialItems[currentTestimonial].classList.add('active');
    if (dots[currentTestimonial]) {
        dots[currentTestimonial].classList.add('active');
    }
}

function startTestimonialRotation() {
    testimonialInterval = setInterval(function() {
        showTestimonial(currentTestimonial + 1);
    }, 5000);
}

function stopTestimonialRotation() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
    }
}

function resetTestimonialInterval() {
    stopTestimonialRotation();
    startTestimonialRotation();
}

// ===== PORTFOLIO FILTERING =====
function initializePortfolio() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    // Trigger animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');
    
    // Validate all fields
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Check honeypot
    const honeypot = form.querySelector('#website');
    if (honeypot && honeypot.value.trim() !== '') {
        console.log('Spam detected - honeypot filled');
        return;
    }
    
    if (!isValid) {
        showFormMessage(errorMsg, 'Please correct the errors above.');
        return;
    }
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;
    
    // Hide previous messages
    hideFormMessages();
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // In a real implementation, you would send the data to your server
        console.log('Form data:', Object.fromEntries(formData));
        
        // Show success message
        showFormMessage(successMsg, '');
        form.reset();
        
        // Reset button state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        
        // Track form submission (analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'engagement',
                event_label: 'contact_form'
            });
        }
        
    }, 2000);
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(fieldName + '-error');
    const formGroup = field.closest('.form-group');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(field)} is required.`;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    
    // Message length validation
    if (fieldName === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long.';
    }
    
    // Update UI
    if (isValid) {
        formGroup.classList.remove('error');
        if (errorElement) errorElement.textContent = '';
    } else {
        formGroup.classList.add('error');
        if (errorElement) errorElement.textContent = errorMessage;
    }
    
    return isValid;
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = document.getElementById(field.name + '-error');
    
    formGroup.classList.remove('error');
    if (errorElement) errorElement.textContent = '';
}

function getFieldLabel(field) {
    const label = field.closest('.form-group').querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : field.name;
}

function showFormMessage(messageElement, customMessage) {
    hideFormMessages();
    if (messageElement) {
        messageElement.style.display = 'flex';
        if (customMessage) {
            const p = messageElement.querySelector('p');
            if (p) p.textContent = customMessage;
        }
    }
}

function hideFormMessages() {
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');
    
    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';
}

// ===== DARK MODE =====
function initializeDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDarkMode = savedTheme === 'dark';
    } else {
        // Check system preference
        isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    applyTheme();
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            isDarkMode = e.matches;
            applyTheme();
        }
    });
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    applyTheme();
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

function applyTheme() {
    const body = document.body;
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const icon = darkModeToggle ? darkModeToggle.querySelector('i') : null;
    
    if (isDarkMode) {
        body.setAttribute('data-theme', 'dark');
        if (icon) {
            icon.className = 'fas fa-sun';
        }
    } else {
        body.removeAttribute('data-theme');
        if (icon) {
            icon.className = 'fas fa-moon';
        }
    }
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', throttle(function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 100));
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== COUNTER ANIMATION =====
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(function() {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// ===== LAZY LOADING =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src || img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.src || img.dataset.src;
        });
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initializeAccessibility() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView();
            }
        });
    }
    
    // Keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll('.filter-btn, .dot, .testimonial-prev, .testimonial-next');
    interactiveElements.forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Announce dynamic content changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
    
    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}

// ===== UTILITY FUNCTIONS =====
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function initializeBackgroundChanger() {
  const images = [
    'assets/1bg.jpg',
    'assets/2bg.jpg',
    'assets/3bg.jpg',
    'assets/4bg.jpg',
    'assets/5bg.jpg'
  ];

  if (!images || images.length === 0) return;

  const body = document.body;
  body.classList.add('bg-slideshow');
  body.style.backgroundColor = '#000'; // fallback while layers load

  // Create two layers that will cross-fade
const layerA = document.createElement('div');
const layerB = document.createElement('div');

layerA.className = 'bg-layer';
layerB.className = 'bg-layer';

  // Append layers (A below B so later we toggle classes)
  body.appendChild(layerA);
  body.appendChild(layerB);

  // GPU hint
  layerA.style.transform = 'translateZ(0)';
  layerB.style.transform = 'translateZ(0)';

  // Preload images function
  function preload(src) {
    const img = new Image();
    img.src = src;
  }

  images.forEach(preload);

  let index = 0;
  let showingA = true;
  const crossfadeDuration = 1000; // should match CSS transition (ms)
  const changeInterval = 6000;    // ms

  // Initialize first visible layer
  layerA.style.backgroundImage = `url(${images[0]})`;
  layerA.classList.add('show');

  // Ensure second layer is ready but hidden
  const nextIndex = () => (index + 1) % images.length;

  function changeBackground() {
    const next = nextIndex();

    const incoming = showingA ? layerB : layerA;
    const outgoing = showingA ? layerA : layerB;

    // Put next image into incoming layer immediately
    incoming.style.backgroundImage = `url(${images[next]})`;

    // Force style calc so transition will run reliably (reflow)
    // eslint-disable-next-line no-unused-expressions
    incoming.offsetHeight;

    // Fade incoming in
    incoming.classList.add('show');

    // After crossfade duration, hide outgoing and finalize
    setTimeout(() => {
      outgoing.classList.remove('show');
      // update pointers
      index = next;
      showingA = !showingA;
    }, crossfadeDuration + 20); // small buffer
  }

  // Start automatic rotation
  const intervalId = setInterval(changeBackground, changeInterval);

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      clearInterval(intervalId);
    } else {
      // restart - keep it simple by resetting interval (no duplicates)
      setInterval(changeBackground, changeInterval);
    }
  });

  // Optional: expose a stop function if you need to cancel later
  window.__bgSlideshow = {
    stop: () => clearInterval(intervalId)
  };
}

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// ===== SERVICE WORKER REGISTRATION (for PWA features) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeWebsite,
        validateField,
        toggleDarkMode,
        showTestimonial,
        animateCounter
    };
}
