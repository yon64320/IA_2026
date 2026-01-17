// ============================================
// BOULANGERIE DU SUD - JAVASCRIPT
// Simple animations and interactions
// ============================================

(function() {
  'use strict';

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip empty hash
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===== INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe feature sections for scroll-triggered animations
  document.addEventListener('DOMContentLoaded', function() {
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
      // Reset initial state
      feature.style.opacity = '0';
      feature.style.transform = 'translateY(30px)';
      feature.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      feature.style.transitionDelay = `${index * 0.1}s`;
      
      observer.observe(feature);
    });

    // Observe contact cards
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      card.style.transitionDelay = `${index * 0.1}s`;
      
      observer.observe(card);
    });
  });

  // ===== BUTTON HOVER EFFECTS =====
  document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
  });

  // ===== PARALLAX EFFECT FOR HERO (SUBTLE) =====
  let lastScrollY = 0;
  let ticking = false;

  function updateParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const scrolled = window.pageYOffset;
    const heroContent = hero.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
      const parallaxValue = scrolled * 0.3;
      heroContent.style.transform = `translateY(${parallaxValue}px)`;
      heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
    
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Only apply parallax on larger screens and if user hasn't reduced motion
  if (window.matchMedia('(min-width: 768px)').matches && 
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // ===== CONTACT SECTION SCROLL ANIMATION =====
  function animateContactInfo() {
    const contactInfo = document.getElementById('contact-info');
    if (!contactInfo) return;

    const contactObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.contact-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 100);
          });
          contactObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    contactObserver.observe(contactInfo);
  }

  document.addEventListener('DOMContentLoaded', animateContactInfo);

  // ===== MOBILE NAVIGATION TOGGLE =====
  document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.setAttribute('aria-expanded', !isExpanded);
      });

      // Close menu when clicking on a link
      const navLinks = navMenu.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', function() {
          navToggle.setAttribute('aria-expanded', 'false');
          navMenu.setAttribute('aria-expanded', 'false');
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navToggle.setAttribute('aria-expanded', 'false');
          navMenu.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  // ===== CONSOLE MESSAGE (OPTIONAL) =====
  console.log('%c🍞 Boulangerie du Sud', 'font-size: 20px; font-weight: bold; color: #d4a574;');
  console.log('%cBienvenue sur notre site !', 'font-size: 14px; color: #4a3f32;');

})();
