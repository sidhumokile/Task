/* ============================================
   AI INTEGRATION & VISUAL ENHANCEMENT
   ============================================ */

class AIVisualGenerator {
    constructor() {
        this.apiEndpoint = process.env.VITE_AI_API_ENDPOINT || 'https://api.replicate.com/v1';
        this.imageCache = new Map();
        this.initializeAIBackgrounds();
    }

    /* ============================================
       AI-GENERATED BACKGROUNDS
       ============================================ */

    async generateLuxuryBackground(theme, dimensions = '1920x1080') {
        const cacheKey = `${theme}-${dimensions}`;
        
        if (this.imageCache.has(cacheKey)) {
            return this.imageCache.get(cacheKey);
        }

        try {
            const prompt = this.buildPrompt(theme);
            const imageUrl = await this.callAIAPI(prompt, dimensions);
            
            this.imageCache.set(cacheKey, imageUrl);
            return imageUrl;
        } catch (error) {
            console.error('AI generation failed:', error);
            return this.getFallbackImage(theme);
        }
    }

    buildPrompt(theme) {
        const prompts = {
            luxury: 'Ultra-luxury modern retail environment with gold accents, premium lighting, high-end boutiques, sophisticated architectural design, cinematic lighting, 8k quality',
            dining: 'Fine dining restaurant interior with Michelin-star ambiance, elegant table settings, sophisticated lighting, premium finishes, culinary excellence atmosphere',
            entertainment: 'World-class entertainment venue with cutting-edge stage design, dynamic lighting, premium sound system, cinematic quality, modern architecture',
            retail: 'Global retail destination with luxury flagship stores, architectural excellence, premium lighting, bustling atmosphere, contemporary design',
            events: 'Convention center with state-of-the-art facilities, professional event setup, dramatic lighting, premium acoustics, modern architecture',
            aquarium: 'Massive aquarium with marine life, bioluminescent lighting, dramatic undersea environment, immersive experience, spectacular scale',
            theme_park: 'Immersive theme park attraction with cutting-edge rides, vibrant theming, dynamic lighting, family-friendly ambiance, world-class design'
        };

        return prompts[theme] || prompts.retail;
    }

    async callAIAPI(prompt, dimensions) {
        // Using Replicate API for DALL-E or Stable Diffusion
        // In production, you would call your backend which handles the API key
        
        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    size: dimensions,
                    quality: 'high'
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            return data.imageUrl || this.getFallbackImage('retail');
        } catch (error) {
            console.error('AI API call failed:', error);
            return this.getFallbackImage('retail');
        }
    }

    getFallbackImage(theme) {
        // Fallback to gradient-based images
        const gradients = {
            luxury: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)',
            dining: 'linear-gradient(135deg, #8B7355 0%, #D4AF37 100%)',
            entertainment: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            retail: 'linear-gradient(135deg, #4a4a4a 0%, #1a1a1a 100%)',
            events: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
            aquarium: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
            theme_park: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)'
        };

        return gradients[theme] || gradients.retail;
    }

    /* ============================================
       INITIALIZE AI BACKGROUNDS
       ============================================ */

    initializeAIBackgrounds() {
        // Apply fallback gradients initially
        // In production, these would be replaced with AI-generated images
        
        const backgroundElements = {
            'retail': '.retail-section',
            'luxury': '.luxury-section',
            'dining': '.dining-section',
            'entertainment': '.entertainment-section'
        };

        Object.entries(backgroundElements).forEach(([theme, selector]) => {
            const element = document.querySelector(selector);
            if (element) {
                // Use fallback initially, can be replaced with AI images later
                element.dataset.aiTheme = theme;
            }
        });
    }

    /* ============================================
       DYNAMIC TEXT GENERATION
       ============================================ */

    async generateMarketingCopy(section) {
        try {
            const response = await fetch('/api/generate-copy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    section: section,
                    tone: 'luxury-premium',
                    length: 'medium'
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.copy;
            }
        } catch (error) {
            console.error('Copy generation failed:', error);
        }

        return null;
    }

    /* ============================================
       ADAPTIVE CONTENT GENERATION
       ============================================ */

    generateAdaptiveContent(userProfile) {
        // Generate personalized content based on user interaction
        // This could leverage AI to create customized pitches
        
        const contentTypes = {
            retail_focused: 'Focus on flagship store opportunities and premium locations',
            events_focused: 'Emphasize event hosting capabilities and concert venues',
            sponsorship_focused: 'Highlight sponsorship packages and audience reach',
            mixed: 'Balanced overview of all opportunities'
        };

        // Determine user interest based on scroll/interaction patterns
        const userInterest = this.detectUserInterest();
        
        return {
            type: userInterest,
            description: contentTypes[userInterest] || contentTypes.mixed
        };
    }

    detectUserInterest() {
        // Simple heuristic: could be enhanced with ML
        const timeOnRetail = document.getElementById('retail')?.dataset.viewTime || 0;
        const timeOnEvents = document.getElementById('events')?.dataset.viewTime || 0;
        
        if (timeOnRetail > 30) return 'retail_focused';
        if (timeOnEvents > 30) return 'events_focused';
        return 'mixed';
    }
}

/* ============================================
   ENHANCED INTERACTIONS WITH AI
   ============================================ */

class AIInteractions {
    constructor() {
        this.aiGenerator = new AIVisualGenerator();
        this.userEngagement = {};
        this.setupEngagementTracking();
    }

    setupEngagementTracking() {
        // Track which sections users spend most time on
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.dataset.viewStartTime = Date.now();
                }
            });
        });

        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }

    async getAIRecommendations(sectionId) {
        // Generate AI-powered recommendations based on user behavior
        try {
            const response = await fetch('/api/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentSection: sectionId,
                    engagement: this.userEngagement
                })
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Recommendations failed:', error);
        }

        return null;
    }

    /* ============================================
       CONTEXTUAL TOOLTIPS
       ============================================ */

    addContextualTooltips() {
        const elements = document.querySelectorAll('[data-tooltip]');
        
        elements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showEnhancedTooltip(e.target);
            });
        });
    }

    showEnhancedTooltip(element) {
        const tooltipText = element.dataset.tooltip;
        const tooltip = document.createElement('div');
        
        tooltip.className = 'ai-tooltip';
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: #d4af37;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            z-index: 10000;
            animation: fadeIn 200ms ease-out;
        `;

        document.body.appendChild(tooltip);

        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';

        // Remove after delay
        setTimeout(() => tooltip.remove(), 3000);
    }
}

/* ============================================
   DATA-DRIVEN PERSONALIZATION
   ============================================ */

class AIPersonalization {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.initializePersonalization();
    }

    loadUserProfile() {
        const stored = localStorage.getItem('userProfile');
        return stored ? JSON.parse(stored) : {
            interests: [],
            visitCount: 0,
            lastVisit: null,
            language: navigator.language
        };
    }

    saveUserProfile() {
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
    }

    initializePersonalization() {
        this.userProfile.visitCount++;
        this.userProfile.lastVisit = new Date().toISOString();
        this.saveUserProfile();

        // Personalize content based on profile
        if (this.userProfile.visitCount > 1) {
            this.showPersonalizedGreeting();
        }
    }

    showPersonalizedGreeting() {
        const greeting = document.createElement('div');
        greeting.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid #d4af37;
            color: #d4af37;
            padding: 12px 16px;
            border-radius: 4px;
            font-size: 13px;
            z-index: 9999;
            animation: slideInRight 300ms ease-out;
        `;
        greeting.textContent = `Welcome back! Continue exploring our opportunities.`;

        document.body.appendChild(greeting);
        setTimeout(() => greeting.remove(), 5000);
    }

    detectUserCategory() {
        // ML-based user categorization
        const timeMetrics = this.getUserTimeMetrics();
        
        if (timeMetrics.retailTime > timeMetrics.eventsTime) {
            return 'retail-partner';
        } else if (timeMetrics.eventsTime > timeMetrics.retailTime) {
            return 'events-partner';
        }
        
        return 'general-inquiry';
    }

    getUserTimeMetrics() {
        return {
            retailTime: parseInt(document.getElementById('retail')?.dataset.viewTime || 0),
            eventsTime: parseInt(document.getElementById('events')?.dataset.viewTime || 0),
            diningTime: parseInt(document.getElementById('dining')?.dataset.viewTime || 0)
        };
    }
}

/* ============================================
   EXPORT FOR USE IN MAIN APP
   ============================================ */

// Initialize AI features on app start
window.aiFeatures = {
    generator: null,
    interactions: null,
    personalization: null,

    init: function() {
        this.generator = new AIVisualGenerator();
        this.interactions = new AIInteractions();
        this.personalization = new AIPersonalization();
        
        console.log('✓ AI features initialized');
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.aiFeatures.init();
    });
} else {
    window.aiFeatures.init();
}
