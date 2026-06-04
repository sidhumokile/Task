/* ============================================
   WESTFIELD DOMINION - MAIN APPLICATION
   ============================================ */

class SalesDeckApp {
    constructor() {
        this.currentSection = 'opening';
        this.mobileMenuOpen = false;
        this.initializeApp();
    }

    initializeApp() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupHeroButton();
        this.setupFormHandling();
        this.setupSectionTracking();
        this.prefetchResources();
    }

    /* ============================================
       NAVIGATION SETUP
       ============================================ */

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection(link.dataset.section);
                this.closeMenuIfOpen();
            });
        });

        // Scroll to section and update active link
        this.updateActiveLink();
    }

    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            this.currentSection = sectionId;
            this.updateActiveLink();
        }
    }

    updateActiveLink() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === this.currentSection) {
                link.classList.add('active');
            }
        });
    }

    /* ============================================
       MOBILE MENU
       ============================================ */

    setupMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                this.toggleMenu();
            });
        }

        // Close menu when clicking on menu items
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenuIfOpen();
            });
        });
    }

    toggleMenu() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        this.mobileMenuOpen = !this.mobileMenuOpen;
        navToggle.classList.toggle('active', this.mobileMenuOpen);
        navMenu.classList.toggle('active', this.mobileMenuOpen);
    }

    closeMenuIfOpen() {
        if (this.mobileMenuOpen) {
            const navToggle = document.getElementById('navToggle');
            const navMenu = document.getElementById('navMenu');
            
            this.mobileMenuOpen = false;
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }

    /* ============================================
       HERO SECTION
       ============================================ */

    setupHeroButton() {
        const heroScrollBtn = document.getElementById('heroScrollBtn');
        if (heroScrollBtn) {
            heroScrollBtn.addEventListener('click', () => {
                this.navigateToSection('why');
            });
        }
    }

    /* ============================================
       FORM HANDLING
       ============================================ */

    setupFormHandling() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleFormSubmit(e, contactForm);
            });
        }
    }

    handleFormSubmit(e, form) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = {
            name: form.querySelector('input[type="text"]').value,
            email: form.querySelector('input[type="email"]').value,
            interest: form.querySelector('select').value,
            message: form.querySelector('textarea').value,
            timestamp: new Date().toISOString()
        };

        // Validate
        if (!data.name || !data.email || !data.interest) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Simulate submission
        this.submitForm(data, form);
    }

    submitForm(data, form) {
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;

        button.disabled = true;
        button.textContent = 'Sending...';

        // Simulate API call
        setTimeout(() => {
            // In production, send to backend via fetch/axios
            console.log('Form submitted:', data);
            
            // Show success message
            this.showNotification('Thank you! We\'ll be in touch shortly.', 'success');
            
            // Reset form
            form.reset();
            button.disabled = false;
            button.textContent = originalText;
        }, 1500);
    }

    /* ============================================
       NOTIFICATIONS
       ============================================ */

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 300ms ease-out;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 300ms ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /* ============================================
       SECTION TRACKING
       ============================================ */

    setupSectionTracking() {
        const sections = document.querySelectorAll('.section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.currentSection = entry.target.id;
                    this.updateActiveLink();
                }
            });
        }, {
            threshold: 0.3
        });

        sections.forEach(section => observer.observe(section));
    }

    /* ============================================
       RESOURCE PREFETCHING
       ============================================ */

    prefetchResources() {
        // Prefetch video
        this.prefetchVideo('assets/videos/hero-intro.mp4');
    }

    prefetchVideo(src) {
        const video = document.querySelector('video[src*="' + src + '"]');
        if (video && !video.src) {
            video.src = src;
            video.load();
        }
    }

    /* ============================================
       UTILITY: SMOOTH SCROLL
       ============================================ */

    static smoothScroll(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/* ============================================
   PERFORMANCE METRICS
   ============================================ */

class PerformanceMonitor {
    constructor() {
        this.trackCoreWebVitals();
        this.trackLazyLoading();
    }

    trackCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
            for (const {hadRecentInput} of list.getEntries()) {
                if (!hadRecentInput) {
                    clsValue += 0; // Simplified
                }
            }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    trackLazyLoading() {
        // Lazy load images when needed
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

/* ============================================
   KEYBOARD NAVIGATION
   ============================================ */

class KeyboardNavigation {
    constructor() {
        this.sections = Array.from(document.querySelectorAll('.section'));
        this.currentIndex = 0;
        this.setupKeyboardShortcuts();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.nextSection();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.previousSection();
            }
        });
    }

    nextSection() {
        this.currentIndex = Math.min(this.currentIndex + 1, this.sections.length - 1);
        this.sections[this.currentIndex].scrollIntoView({ behavior: 'smooth' });
    }

    previousSection() {
        this.currentIndex = Math.max(this.currentIndex - 1, 0);
        this.sections[this.currentIndex].scrollIntoView({ behavior: 'smooth' });
    }
}

/* ============================================
   APPLY ANIMATION STYLES
   ============================================ */

function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .animate-in {
            animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-in-stagger {
            animation: slideInUp 0.6s ease-out forwards;
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   INITIALIZE APPLICATION
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Inject animation styles
    injectAnimationStyles();

    // Initialize main app
    const app = new SalesDeckApp();

    // Initialize keyboard navigation
    const keyboard = new KeyboardNavigation();

    // Initialize performance monitoring
    const perf = new PerformanceMonitor();

    console.log('🎯 Westfield Dominion Sales Deck Initialized');
    console.log('✓ Navigation ready');
    console.log('✓ Animations active');
    console.log('✓ Performance monitoring enabled');
});

/* ============================================
   ERROR HANDLING
   ============================================ */

window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
});
