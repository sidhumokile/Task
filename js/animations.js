/* ============================================
   ANIMATION UTILITIES
   ============================================ */

class AnimationController {
    constructor() {
        this.observers = [];
        this.initIntersectionObserver();
    }

    initIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const callback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(callback, options);
        
        // Observe all elements with animation classes
        document.querySelectorAll('.section, .metric-card, .retail-card, .luxury-card').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        const sectionType = element.dataset.section;
        
        // Add animation based on section type
        element.classList.add('animate-in');
        
        // Stagger child animations
        const children = element.querySelectorAll('h2, p, .metric-card, .retail-card, .luxury-card, .event-type');
        children.forEach((child, index) => {
            child.style.animationDelay = `${index * 100}ms`;
            child.classList.add('animate-in-stagger');
        });
    }

    static fadeInUp(element, delay = 0) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 500ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 10);
    }

    static staggerChildren(parent, delay = 100) {
        const children = parent.querySelectorAll('> *');
        children.forEach((child, index) => {
            AnimationController.fadeInUp(child, index * delay);
        });
    }

    static parallax(element, scrollProgress) {
        const offset = scrollProgress * 50;
        element.style.transform = `translateY(${offset}px)`;
    }
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

class ScrollAnimations {
    constructor() {
        this.heroVideo = document.getElementById('heroVideo');
        this.heroContent = document.querySelector('.hero-content');
        this.setupScrollListeners();
    }

    setupScrollListeners() {
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    }

    onScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const scrollProgress = Math.min(scrollY / windowHeight, 1);

        // Hero parallax effect
        if (this.heroContent) {
            this.heroContent.style.transform = `translateY(${scrollY * 0.5}px)`;
            this.heroContent.style.opacity = Math.max(1 - scrollY / 400, 0);
        }

        // Update nav on scroll
        this.updateNavOnScroll(scrollY);
    }

    updateNavOnScroll(scrollY) {
        const nav = document.querySelector('.navigation');
        if (scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */

class CounterAnimation {
    static animateCounter(element, target, duration = 2000) {
        const start = 0;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function: cubic-out
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeProgress);
            
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    static setupCounters() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    
                    const targetText = entry.target.textContent.replace(/[^0-9]/g, '');
                    const target = parseInt(targetText) || 0;
                    
                    if (target > 0) {
                        this.animateCounter(entry.target, target);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.metric-card h3').forEach(el => {
            observer.observe(el);
        });
    }
}

/* ============================================
   INITIALIZE ANIMATIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const animController = new AnimationController();
    const scrollAnim = new ScrollAnimations();
    CounterAnimation.setupCounters();

    // Initial animations for hero section
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) {
        AnimationController.staggerChildren(heroTitle, 200);
    }
});
