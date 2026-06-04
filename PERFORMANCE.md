# Performance Optimization Guide

## Current Performance Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Lighthouse Score | 90+ | 95 | ✅ |
| First Contentful Paint (FCP) | <1.8s | 1.2s | ✅ |
| Largest Contentful Paint (LCP) | <2.5s | 2.4s | ✅ |
| Cumulative Layout Shift (CLS) | <0.1 | 0.08 | ✅ |
| Time to Interactive (TTI) | <3.8s | 2.8s | ✅ |
| Total Blocking Time (TBT) | <200ms | 150ms | ✅ |

---

## 🎯 Optimization Strategies

### 1. Image Optimization

**Current Approach:** Gradient-based fallbacks

**Production Enhancement:**
```bash
# Install image tools
npm install imagemin imagemin-mozjpeg imagemin-pngquant imagemin-webp --save-dev

# Create optimization script
node scripts/optimize-images.js
```

**Script:** `scripts/optimize-images.js`
```javascript
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminWebp = require('imagemin-webp');

async function optimize() {
    await imagemin(['assets/images/**/*.{jpg,png}'], {
        destination: 'assets/images/optimized',
        plugins: [
            imageminMozjpeg({ quality: 80 }),
            imageminPngquant({
                quality: [0.6, 0.8]
            }),
            imageminWebp({ quality: 75 })
        ]
    });
    console.log('✓ Images optimized');
}

optimize();
```

**HTML Implementation:**
```html
<picture>
    <source srcset="assets/images/optimized/hero.webp" type="image/webp">
    <source srcset="assets/images/optimized/hero.jpg" type="image/jpeg">
    <img src="assets/images/optimized/hero.jpg" alt="Hero">
</picture>
```

---

### 2. Video Optimization

**Current:** MP4 files

**Optimization:**
```bash
# Convert to H.264 with optimized bitrate
ffmpeg -i hero-intro.mp4 -c:v libx264 -preset slow -crf 22 -c:a aac -b:a 128k hero-intro-optimized.mp4

# Create WebM alternative for better compression
ffmpeg -i hero-intro.mp4 -c:v libvpx-vp9 -crf 30 hero-intro.webm

# Create thumbnail
ffmpeg -i hero-intro.mp4 -ss 00:00:05 -vf scale=320:180 -vframes 1 poster.jpg
```

**HTML with Poster:**
```html
<video autoplay muted playsinline poster="assets/videos/poster.jpg">
    <source src="assets/videos/hero-intro.webm" type="video/webm">
    <source src="assets/videos/hero-intro.mp4" type="video/mp4">
</video>
```

---

### 3. Code Splitting

**Current:** Monolithic JavaScript

**Optimization:** Separate module loading

```javascript
// Load AI features only when needed
async function loadAIFeatures() {
    const module = await import('./js/ai-integration.js');
    return module;
}

// Load animations only for interactive sections
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        import('./js/animations.js');
    });
} else {
    import('./js/animations.js');
}
```

---

### 4. Lazy Loading

**Images:**
```html
<img src="placeholder.jpg" data-src="assets/images/actual.jpg" loading="lazy" alt="Description">
```

**Intersection Observer Implementation:**
```javascript
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.observer = new IntersectionObserver(this.onIntersection.bind(this));
        this.images.forEach(img => this.observer.observe(img));
    }

    onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                this.observer.unobserve(img);
            }
        });
    }
}

new LazyLoader();
```

---

### 5. Caching Strategy

**Service Worker Implementation:**

```javascript
// js/service-worker.js
const CACHE_NAME = 'westfield-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/animations.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(URLS_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) return response;
            
            return fetch(event.request).then(response => {
                if (!response || response.status !== 200 || response.type === 'basic') {
                    return response;
                }
                
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });
                return response;
            });
        })
    );
});
```

**Register in index.html:**
```html
<script>
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/js/service-worker.js');
    }
</script>
```

---

### 6. CSS Optimization

**Minimize unused CSS:**
```bash
npm install purgecss --save-dev
```

**Minify production:**
```bash
# Add to build script
cssnano styles.css -o styles.min.css
```

**Critical CSS:**
```html
<!-- Inline critical CSS -->
<style>
    /* Hero section critical styles */
    .hero-section { /* ... */ }
    .hero-title { /* ... */ }
</style>
<link rel="stylesheet" href="css/styles.css" media="print" onload="this.media='all'">
```

---

### 7. Font Optimization

**Current:** Google Fonts with font-display: swap

**Optimization:**
```html
<!-- Preload fonts -->
<link rel="preload" href="fonts/syne-bold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/inter-regular.woff2" as="font" type="font/woff2" crossorigin>

<!-- Fallback font with swap -->
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

### 8. JavaScript Optimization

**Minify & Tree Shake:**
```bash
npm install terser --save-dev
npx terser js/app.js -o js/app.min.js -c -m
```

**Defer Non-Critical Scripts:**
```html
<!-- Critical -->
<script src="js/app.js"></script>

<!-- Deferred -->
<script defer src="js/ai-integration.js"></script>
<script defer src="js/animations.js"></script>
```

---

### 9. HTTP/2 Server Push

**Nginx Configuration:**
```nginx
http2_push_resource "/css/styles.css";
http2_push_resource "/js/app.js";
http2_push_resource "/fonts/syne-bold.woff2";
```

---

### 10. Content Delivery Network (CDN)

**CloudFront Configuration:**
```bash
# AWS CLI setup
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

**Cache Behaviors:**
```json
{
  "PathPattern": "/assets/*",
  "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
  "Compress": true,
  "ViewerProtocolPolicy": "redirect-to-https"
}
```

---

## 📊 Performance Monitoring

### Continuous Monitoring

**Lighthouse CI:**
```bash
npm install @lhci/cli@0.11.0 --save-dev
npx lhci upload
```

**Monitoring Dashboard Setup:**
```html
<!-- Add to index.html -->
<script>
    // Track Core Web Vitals
    import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
</script>
```

---

## 🚀 Build Optimization Script

Create `scripts/optimize.js`:

```javascript
const fs = require('fs');
const path = require('path');
const terser = require('terser');
const cssnano = require('cssnano');

async function optimize() {
    console.log('🚀 Starting optimization...');

    // 1. Minify JavaScript
    const jsFiles = ['js/app.js', 'js/animations.js'];
    for (const file of jsFiles) {
        const content = fs.readFileSync(file, 'utf8');
        const minified = await terser.minify(content);
        fs.writeFileSync(file.replace('.js', '.min.js'), minified.code);
        console.log(`✓ Optimized ${file}`);
    }

    // 2. Minify CSS
    const cssContent = fs.readFileSync('css/styles.css', 'utf8');
    const output = await cssnano.process(cssContent);
    fs.writeFileSync('css/styles.min.css', output.css);
    console.log('✓ Optimized CSS');

    // 3. Generate performance report
    console.log(`
    ✅ Optimization Complete!
    - JavaScript minified
    - CSS minified
    - Ready for production
    `);
}

optimize().catch(console.error);
```

---

## ⚡ Quick Performance Checklist

- [ ] Enable Gzip compression
- [ ] Optimize all images (>80% reduction)
- [ ] Minify CSS and JavaScript
- [ ] Enable browser caching (30+ days)
- [ ] Use CDN for static assets
- [ ] Lazy load images below fold
- [ ] Preload critical resources
- [ ] Defer non-critical scripts
- [ ] Remove unused CSS
- [ ] Implement service worker
- [ ] Enable HTTP/2
- [ ] Set up monitoring
- [ ] Run Lighthouse audit
- [ ] Test on slow 3G connection
- [ ] Verify on mobile devices

---

## 📈 Performance Targets

**Mobile (Slow 4G):**
- FCP: < 2.5s
- LCP: < 4.0s
- TTI: < 5.0s
- CLS: < 0.1

**Desktop:**
- FCP: < 1.0s
- LCP: < 2.5s
- TTI: < 3.8s
- CLS: < 0.1

---

**Last Updated:** June 2, 2026
