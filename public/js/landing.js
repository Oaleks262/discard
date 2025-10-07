// Landing Page JavaScript

class LandingPage {
  constructor() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.setupLanguageSwitcher();
    this.setupThemeToggle();
    this.setupMobileMenu();
    this.setupCTAButton();
    this.setupScrollAnimations();
    this.setupThemeDetection();
    this.loadFooter();

    // Update texts after language is loaded
    setTimeout(() => {
      if (window.i18n) {
        window.i18n.updatePageTexts();
      }
    }, 100);
  }

  async loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;

    try {
      const response = await fetch('/footer.html');
      const footerHTML = await response.text();
      footerPlaceholder.innerHTML = footerHTML;

      // Update i18n after footer is loaded
      if (window.i18n) {
        setTimeout(() => window.i18n.updatePageTexts(), 100);
      }
    } catch (error) {
      console.error('Failed to load footer:', error);
    }
  }

  setupLanguageSwitcher() {
    // Language switching is handled in inline script in index.html
    // This method kept for compatibility but doesn't add duplicate handlers
  }

  setupThemeToggle() {
    // Theme toggle is handled in inline script in index.html
    // This method kept for compatibility but doesn't add duplicate handlers
  }

  setupMobileMenu() {
    // Mobile menu is handled in inline script in index.html
    // This method kept for compatibility but doesn't add duplicate handlers
  }

  setupCTAButton() {
    // CTA button is handled in inline script in index.html
    // This method kept for compatibility but doesn't add duplicate handlers
  }

  navigateToApp() {
    // Redirect directly to app
    window.location.href = '/app.html';
  }

  animatePhoneMockup() {
    const mockup = document.querySelector('.phone-mockup');
    if (mockup) {
      mockup.style.animation = 'none';
      setTimeout(() => {
        mockup.style.animation = 'float 6s ease-in-out infinite';
      }, 10);
    }
  }

  setupScrollAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          
          // Animate feature cards with delay
          if (entry.target.classList.contains('feature-card')) {
            const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.1}s`;
          }
          
          // Animate screenshot cards
          if (entry.target.classList.contains('screenshot-card')) {
            const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.15}s`;
          }
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .screenshot-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  setupThemeDetection() {
    // Detect system theme preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark-theme-preferred');
    }

    // Listen for theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
          document.body.classList.add('dark-theme-preferred');
        } else {
          document.body.classList.remove('dark-theme-preferred');
        }
      });
    }
  }

  // Utility methods
  smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Analytics and tracking (placeholder)
  trackEvent(event, data = {}) {
    // Implementation for analytics
  }
}

// Additional animations and effects
class LandingAnimations {
  constructor() {
    this.initCodeAnimations();
    this.initParallaxEffect();
  }

  initCodeAnimations() {
    // Animate the barcode and QR codes in the phone mockup
    const barcodes = document.querySelectorAll('.barcode.animated');
    const qrcodes = document.querySelectorAll('.qrcode.animated');

    // Stagger animations
    barcodes.forEach((barcode, index) => {
      barcode.style.animationDelay = `${index * 0.5}s`;
    });

    qrcodes.forEach((qrcode, index) => {
      qrcode.style.animationDelay = `${index * 0.7}s`;
    });
  }

  initParallaxEffect() {
    // Simple parallax effect for hero section - disabled on mobile
    if (window.innerWidth <= 768) {
      return; // Skip parallax on mobile devices
    }
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3;
      
      const heroVisual = document.querySelector('.hero-visual');
      if (heroVisual) {
        heroVisual.style.transform = `translateY(${rate}px)`;
      }
    });
  }

}

// Performance optimization
class LandingPerformance {
  constructor() {
    this.optimizeImages();
    this.preloadCriticalResources();
  }

  optimizeImages() {
    // Lazy load images when they come into viewport
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  preloadCriticalResources() {
    // Preload app.html for faster navigation
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/app.html';
    document.head.appendChild(link);

    // Preload critical app CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'prefetch';
    cssLink.href = '/css/app.css';
    document.head.appendChild(cssLink);
  }
}

// Mobile optimizations
class LandingMobile {
  constructor() {
    this.setupTouchGestures();
    this.optimizeForMobile();
  }

  setupTouchGestures() {
    // Add touch feedback for interactive elements
    const interactiveElements = document.querySelectorAll('button, .card-item, .feature-card');
    
    interactiveElements.forEach(element => {
      element.addEventListener('touchstart', () => {
        element.style.transform = 'scale(0.98)';
      });

      element.addEventListener('touchend', () => {
        setTimeout(() => {
          element.style.transform = '';
        }, 150);
      });
    });
  }

  optimizeForMobile() {
    // Optimize animations for mobile
    if (window.DeviceMotionEvent) {
      // Reduce animations on mobile for better performance
      document.documentElement.style.setProperty('--transition-duration', '0.2s');
    }

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        // Recalculate layout after orientation change
        window.dispatchEvent(new Event('resize'));
      }, 100);
    });
  }
}

// Initialize classes
new LandingPage();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new LandingAnimations();
  new LandingPerformance();
  
  // Initialize mobile optimizations only on mobile devices
  if (window.innerWidth <= 768) {
    new LandingMobile();
  }
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is not visible
    document.documentElement.style.setProperty('animation-play-state', 'paused');
  } else {
    // Resume animations
    document.documentElement.style.setProperty('animation-play-state', 'running');
  }
});

// Error handling
window.addEventListener('error', (e) => {
  console.error('Landing page error:', e.error);
  // Implement error reporting if needed
});

// Service Worker registration for PWA features
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        // Service Worker registered successfully
      })
      .catch(registrationError => {
        console.error('SW registration failed: ', registrationError);
      });
  });
}