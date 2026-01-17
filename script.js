// ============================================
// BOULANGERIE DU SUD - JAVASCRIPT
// Dynamic content loading from JSON + animations
// ============================================

(function() {
  'use strict';

  // ===== GLOBAL DATA STORAGE =====
  let siteData = null;

  // ===== LOAD JSON DATA =====
  async function loadSiteData() {
    try {
      const response = await fetch('site.json');
      if (!response.ok) throw new Error('Failed to load site.json');
      siteData = await response.json();
      return siteData;
    } catch (error) {
      console.error('Error loading site data:', error);
      return null;
    }
  }

  // ===== GET CURRENT PAGE =====
  function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    
    if (filename.includes('produits')) return 'products';
    if (filename.includes('a-propos') || filename.includes('about')) return 'about';
    if (filename.includes('contact')) return 'contact';
    return 'home';
  }

  // ===== POPULATE NAVIGATION =====
  function populateNavigation(data) {
    const navLogo = document.querySelector('.nav-logo');
    if (navLogo && data.site?.name) {
      navLogo.textContent = data.site.name;
    }

    // Update active nav link based on current page
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if ((currentPage === 'home' && href.includes('index.html')) ||
          (currentPage === 'products' && href.includes('produits.html')) ||
          (currentPage === 'about' && href.includes('a-propos.html')) ||
          (currentPage === 'contact' && href.includes('contact.html'))) {
        link.classList.add('active');
      }
    });
  }

  // ===== POPULATE PAGE TITLE =====
  function populatePageTitle(data, page) {
    if (data[page]?.pageTitle) {
      document.title = data[page].pageTitle;
    }
  }

  // ===== POPULATE HOME PAGE =====
  function populateHomePage(data) {
    const home = data.home;
    if (!home) return;

    // Hero section
    const heroTitle = document.querySelector('.hero-title');
    const heroText = document.querySelector('.hero-text');
    if (heroTitle && home.hero?.title) heroTitle.textContent = home.hero.title;
    if (heroText && home.hero?.text) heroText.textContent = home.hero.text;

    // Page title
    if (home.pageTitle) document.title = home.pageTitle;

    // Contact info section
    const contactInfo = document.querySelector('#contact-info');
    if (contactInfo && data.site) {
      const site = data.site;
      const cards = contactInfo.querySelectorAll('.contact-card');
      
      // Address card
      if (cards[0]) {
        const h3 = cards[0].querySelector('h3');
        const p = cards[0].querySelector('p');
        if (h3) h3.textContent = 'Adresse';
        if (p) p.innerHTML = site.address?.replace(', ', '<br>') || '';
      }
      
      // Hours card
      if (cards[1]) {
        const h3 = cards[1].querySelector('h3');
        const p = cards[1].querySelector('p');
        if (h3) h3.textContent = 'Horaires';
        if (p) p.innerHTML = `Ouvert tous les jours<br>${site.hours || ''}`;
      }
      
      // Contact card
      if (cards[2]) {
        const h3 = cards[2].querySelector('h3');
        const p = cards[2].querySelector('p');
        if (h3) h3.textContent = 'Contact';
        if (p) p.innerHTML = `${site.phone || ''}<br>${site.email || ''}`;
      }
    }
  }

  // ===== POPULATE PRODUCTS PAGE =====
  function populateProductsPage(data) {
    const products = data.products;
    if (!products) return;

    // Page hero
    const pageTitle = document.querySelector('.page-title');
    const pageSubtitle = document.querySelector('.page-subtitle');
    if (pageTitle) pageTitle.textContent = products.pageTitle?.replace(' — Boulangerie du Sud', '') || 'Nos produits';
    if (pageSubtitle && products.intro) pageSubtitle.textContent = products.intro;

    // Clear existing sections
    const productsSection = document.querySelector('.products-section');
    if (productsSection && products.categories) {
      const container = productsSection.parentElement || document.body;
      
      // Remove old products sections except the first container
      const existingSections = container.querySelectorAll('.products-section');
      existingSections.forEach((section, index) => {
        if (index > 0) section.remove();
      });

      // Populate categories
      products.categories.forEach((category, catIndex) => {
        let section = existingSections[catIndex] || productsSection;
        
        if (catIndex === 0) {
          // Use existing first section
          const heading = section.querySelector('.section-heading');
          if (heading) heading.textContent = category.title;
          
          const grid = section.querySelector('.products-grid');
          if (grid) {
            grid.innerHTML = '';
            category.items.forEach(item => {
              const card = createProductCard(item);
              grid.appendChild(card);
            });
          }
        } else {
          // Create new section for additional categories
          section = document.createElement('section');
          section.className = 'products-section';
          
          const heading = document.createElement('h2');
          heading.className = 'section-heading';
          heading.textContent = category.title;
          section.appendChild(heading);
          
          const grid = document.createElement('div');
          grid.className = 'products-grid';
          
          category.items.forEach(item => {
            const card = createProductCard(item);
            grid.appendChild(card);
          });
          
          section.appendChild(grid);
          productsSection.parentElement.insertBefore(section, productsSection.nextSibling);
        }
      });
    }
  }

  // ===== CREATE PRODUCT CARD =====
  function createProductCard(item) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const image = document.createElement('div');
    image.className = 'product-image';
    image.innerHTML = `
      <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="200" height="150" fill="#f5ebe0"/>
        <ellipse cx="100" cy="75" rx="30" ry="50" fill="#d4a574"/>
        <ellipse cx="100" cy="75" rx="25" ry="45" fill="#e8c5a0"/>
      </svg>
    `;
    
    const h3 = document.createElement('h3');
    h3.textContent = item.name;
    
    const p = document.createElement('p');
    p.textContent = item.desc;
    
    card.appendChild(image);
    card.appendChild(h3);
    card.appendChild(p);
    
    return card;
  }

  // ===== POPULATE ABOUT PAGE =====
  function populateAboutPage(data) {
    const about = data.about;
    if (!about) return;

    // Page hero
    const pageTitle = document.querySelector('.page-title');
    const pageSubtitle = document.querySelector('.page-subtitle');
    if (pageTitle) pageTitle.textContent = about.pageTitle?.replace(' — Boulangerie du Sud', '') || 'À propos';
    if (pageSubtitle && about.intro) pageSubtitle.textContent = about.intro;

    // Cards section (values)
    if (about.cards) {
      const valuesGrid = document.querySelector('.values-grid');
      if (valuesGrid) {
        valuesGrid.innerHTML = '';
        about.cards.forEach(cardData => {
          const card = document.createElement('div');
          card.className = 'value-card';
          
          const icon = document.createElement('div');
          icon.className = 'value-icon';
          // Map badges to emojis
          const emojiMap = {
            'Artisanal': '🍞',
            'Essentiel': '🌾',
            'Clair': '❤️'
          };
          icon.textContent = emojiMap[cardData.badge] || '⭐';
          
          const h3 = document.createElement('h3');
          h3.textContent = cardData.title;
          
          const p = document.createElement('p');
          p.textContent = cardData.text;
          
          card.appendChild(icon);
          card.appendChild(h3);
          card.appendChild(p);
          valuesGrid.appendChild(card);
        });
      }
    }

    // Commitments section
    if (about.commitments && about.commitmentsTitle) {
      const commitmentsHeading = document.querySelector('.commitments-section .section-heading');
      if (commitmentsHeading) commitmentsHeading.textContent = about.commitmentsTitle;
      
      const commitmentsList = document.querySelector('.commitments-list');
      if (commitmentsList) {
        commitmentsList.innerHTML = '';
        about.commitments.forEach(commitment => {
          const li = document.createElement('li');
          li.textContent = commitment;
          commitmentsList.appendChild(li);
        });
      }
    }
  }

  // ===== POPULATE CONTACT PAGE =====
  function populateContactPage(data) {
    const contact = data.contact;
    if (!contact) return;

    // Page hero
    const pageTitle = document.querySelector('.page-title');
    const pageSubtitle = document.querySelector('.page-subtitle');
    if (pageTitle) pageTitle.textContent = contact.pageTitle?.replace(' — Boulangerie du Sud', '') || 'Contact';
    if (pageSubtitle && contact.intro) pageSubtitle.textContent = contact.intro;

    // Contact cards
    if (contact.cards) {
      const contactGrid = document.querySelector('.contact-grid');
      if (contactGrid) {
        contactGrid.innerHTML = '';
        contact.cards.forEach((cardData, index) => {
          const card = document.createElement('div');
          card.className = 'contact-card-large';
          
          // Icon SVG
          const icon = document.createElement('div');
          icon.className = 'contact-icon';
          const icons = [
            `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg>`,
            `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/></svg>`,
            `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/></svg>`
          ];
          icon.innerHTML = icons[index] || icons[0];
          
          const h2 = document.createElement('h2');
          h2.textContent = cardData.title;
          
          const lines = cardData.lines || [];
          lines.forEach((line, lineIndex) => {
            const p = document.createElement('p');
            
            // Check if line contains email
            if (line.includes('@')) {
              const a = document.createElement('a');
              a.href = `mailto:${line}`;
              a.textContent = line;
              p.appendChild(a);
            } 
            // Check if line looks like a phone number
            else if (line.match(/^[\d\s\-\+\(\)]+$/)) {
              const a = document.createElement('a');
              a.href = `tel:${line.replace(/\s/g, '').replace(/[^\d+]/g, '')}`;
              a.textContent = line;
              p.appendChild(a);
            } 
            // Regular text - handle line breaks
            else {
              p.innerHTML = line.replace(/\n/g, '<br>');
            }
            
            // Add strong tag if it's the first line and contains specific keywords
            if (lineIndex === 0 && (line.includes('Ouvert') || line.includes('Lundi') || line.includes('Téléphone'))) {
              const strong = document.createElement('strong');
              if (p.firstChild && p.firstChild.nodeType === 3) {
                // Text node
                const text = p.firstChild.textContent;
                p.removeChild(p.firstChild);
                strong.textContent = text;
                p.insertBefore(strong, p.firstChild);
              }
            }
            
            card.appendChild(p);
          });
          
          if (cardData.badge) {
            const note = document.createElement('p');
            note.className = 'contact-note';
            note.textContent = cardData.badge;
            card.appendChild(note);
          }
          
          card.insertBefore(icon, card.firstChild);
          card.insertBefore(h2, icon.nextSibling);
          contactGrid.appendChild(card);
        });
      }
    }
  }

  // ===== POPULATE FOOTER =====
  function populateFooter(data) {
    const footer = document.querySelector('.page-footer');
    if (footer && data.site) {
      const site = data.site;
      footer.innerHTML = `
        <p>&copy; ${new Date().getFullYear()} ${site.name || 'Boulangerie du Sud'} — ${site.address || ''}</p>
        <p>${site.hours || ''} • ${site.phone || ''} • ${site.email || ''}</p>
      `;
    }
  }

  // ===== INITIALIZE PAGE =====
  async function initializePage() {
    const data = await loadSiteData();
    if (!data) {
      console.error('Could not load site data');
      return;
    }

    const currentPage = getCurrentPage();
    
    // Populate common elements
    populateNavigation(data);
    populateFooter(data);
    populatePageTitle(data, currentPage === 'home' ? 'home' : currentPage === 'products' ? 'products' : currentPage);

    // Populate page-specific content
    switch (currentPage) {
      case 'home':
        populateHomePage(data);
        break;
      case 'products':
        populateProductsPage(data);
        break;
      case 'about':
        populateAboutPage(data);
        break;
      case 'contact':
        populateContactPage(data);
        break;
    }

    // Initialize animations after content is loaded
    setTimeout(() => {
      initAnimations();
    }, 100);
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  function initSmoothScroll() {
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
  }

  // ===== INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS =====
  function initAnimations() {
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

    // Observe feature sections
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
      feature.style.opacity = '0';
      feature.style.transform = 'translateY(30px)';
      feature.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      feature.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(feature);
    });

    // Observe contact cards
    const contactCards = document.querySelectorAll('.contact-card, .contact-card-large');
    contactCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      card.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(card);
    });

    // Observe product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      card.style.transitionDelay = `${index * 0.05}s`;
      observer.observe(card);
    });

    // Observe value cards
    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      card.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(card);
    });
  }

  // ===== BUTTON HOVER EFFECTS =====
  function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
  }

  // ===== PARALLAX EFFECT FOR HERO =====
  function initParallax() {
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

    if (window.matchMedia('(min-width: 768px)').matches && 
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('scroll', requestTick, { passive: true });
    }
  }

  // ===== MOBILE NAVIGATION TOGGLE =====
  function initMobileNav() {
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
  }

  // ===== INITIALIZE ON DOM LOAD =====
  document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    initSmoothScroll();
    initButtonEffects();
    initParallax();
    initMobileNav();

    // Console message
    console.log('%c🍞 Boulangerie du Sud', 'font-size: 20px; font-weight: bold; color: #d4a574;');
    console.log('%cSite chargé depuis site.json', 'font-size: 14px; color: #4a3f32;');
  });

})();
