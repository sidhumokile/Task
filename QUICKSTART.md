# 🚀 Quick Start Guide - Westfield Dominion

## 1️⃣ Open Locally (30 seconds)

### Option A: Direct Browser
```bash
# Navigate to the project folder
cd westfield-dominion

# Double-click index.html
# Or open in browser: file:///path/to/index.html
```

### Option B: Using Local Server
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# Then visit: http://localhost:8000
```

---

## 2️⃣ Customize Content (2 minutes)

### Update Company Name
Find and replace in `index.html`:
- `Westfield Dominion` → `Your Mall Name`
- `westfield-dominion.com` → `yourdomain.com`

### Update Metrics
Edit in `index.html`:
```html
<h3>150M+</h3>          <!-- Annual Visitors -->
<h3>750+</h3>           <!-- Retailers -->
<h3>$8.2B+</h3>         <!-- Revenue -->
<h3>410K</h3>           <!-- Daily Footfall -->
```

### Update Colors
Edit `css/styles.css`:
```css
:root {
    --primary-black: #0a0a0a;      /* Main background -->
    --accent-gold: #d4af37;        /* Highlight color -->
    --accent-silver: #e8e8e8;      /* Secondary color -->
}
```

### Update Contact Emails
Edit in `index.html`:
```html
<a href="mailto:leasing@yourmall.com" class="cta-button primary">
    Explore Spaces
</a>
```

---

## 3️⃣ Add Your Videos (5 minutes)

### Replace Hero Video
1. Create video file: `assets/videos/hero-intro.mp4`
2. Edit `index.html`:
```html
<video autoplay muted playsinline>
    <source src="assets/videos/hero-intro.mp4" type="video/mp4">
</video>
```

### Optimize Video
```bash
# Install FFmpeg
# Then run:
ffmpeg -i hero-intro.mp4 -c:v libx264 -preset slow -crf 22 hero-intro-optimized.mp4
```

---

## 4️⃣ Add Your Images (5 minutes)

Create folder structure:
```
assets/
├── images/
│   ├── retail/
│   ├── luxury/
│   ├── dining/
│   ├── entertainment/
│   └── events/
├── videos/
└── data/
```

---

## 5️⃣ Enable Backend Features (10 minutes)

### Setup Node.js Backend
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your API keys to .env
SENDGRID_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
REPLICATE_API_TOKEN=your_key_here

# Start backend
npm run start
# Or for development
npm run dev
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:3000/api/health

# Submit contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "interest": "retail",
    "message": "Interested in flagship opportunities"
  }'
```

---

## 6️⃣ Deploy (Choose One)

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Your site: https://your-project.vercel.app
```

### Deploy to Netlify
```bash
# Connect GitHub and drag-and-drop folder
# Or use Netlify CLI
netlify deploy --prod
```

### Deploy to GitHub Pages
```bash
# Push to GitHub
git add .
git commit -m "Deploy"
git push origin main

# Enable Pages in repository settings
# Your site: https://yourusername.github.io/repo-name
```

---

## 7️⃣ Performance Optimization

### Check Performance
```bash
# Using Lighthouse
npm run analyze

# Opens in browser with full report
```

### Optimize Images
```bash
npm run optimize
```

### Minify Code
```bash
npm run build
```

---

## 📋 Customization Checklist

- [ ] Update company name and branding
- [ ] Change colors in CSS variables
- [ ] Update metrics and statistics
- [ ] Replace hero video
- [ ] Add section images
- [ ] Update contact emails
- [ ] Customize content text
- [ ] Add logo (update nav-logo)
- [ ] Set up analytics (Google Analytics ID)
- [ ] Configure form backend
- [ ] Test all navigation links
- [ ] Test on mobile devices
- [ ] Deploy to live domain

---

## 🎨 Key Customization Points

### 1. Navigation Links
```html
<!-- In index.html nav section -->
<li><a href="#opening" class="nav-link" data-section="opening">Intro</a></li>
```

### 2. Hero Section
```html
<h1 class="hero-title">
    <span class="title-line">Welcome to</span>
    <span class="title-line title-bold">Your Mall Name</span>
</h1>
```

### 3. Section Headers
```html
<section id="retail" class="section retail-section">
    <div class="section-header">
        <h2>Your Section Title</h2>
        <p class="section-subtitle">Your subtitle here</p>
    </div>
</section>
```

### 4. Metric Cards
```html
<div class="metric-card">
    <h3>150M+</h3>
    <p>Annual Visitors</p>
    <span class="metric-detail">From 195+ countries</span>
</div>
```

### 5. CTA Buttons
```html
<a href="mailto:sales@yourmall.com" class="cta-button primary">
    Get in Touch
</a>
```

---

## 🐛 Troubleshooting

### Videos Not Playing?
- Check file format (MP4 recommended)
- Verify file path in HTML
- Check browser console for errors
- Try with a different video file

### Navigation Not Working?
- Check section IDs match nav href links
- Verify `data-section` attributes
- Check JavaScript console for errors

### Form Not Submitting?
- Verify backend server is running (`npm run dev`)
- Check API endpoint in `js/app.js`
- Verify email configuration in `.env`
- Check browser console for errors

### Performance Issues?
- Run `npm run optimize` to compress media
- Disable AI features if slow
- Check network tab in DevTools
- Try on different browser/device

---

## 📚 Useful Commands

```bash
# Development
npm run dev              # Start local dev server

# Production
npm run build            # Optimize for production
npm run analyze          # Lighthouse performance report

# Deployment
npm run deploy:vercel    # Deploy to Vercel
npm run deploy:netlify   # Deploy to Netlify

# Utilities
npm run optimize         # Optimize images/videos
npm run lint             # Check code quality
npm run test             # Run tests
```

---

## 💡 Pro Tips

1. **Keep videos short** - Hero video should be <5MB
2. **Use WebP images** - 30-40% smaller than JPEG
3. **Mobile first** - Test on mobile early and often
4. **Test forms** - Make sure emails are being sent
5. **Monitor performance** - Aim for 90+ Lighthouse score
6. **Use CDN** - Serve images/videos from CDN for speed
7. **Enable caching** - Set browser cache headers
8. **Enable compression** - Enable Gzip on server

---

## 🔗 Useful Resources

- [MDN Web Docs](https://developer.mozilla.org)
- [Web.dev Performance](https://web.dev/performance/)
- [Can I Use](https://caniuse.com) - Browser compatibility
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance audits
- [CSS Tricks](https://css-tricks.com) - CSS guides

---

## 📞 Support

- **Documentation:** See README.md
- **Deployment Guide:** See DEPLOYMENT.md
- **Performance Guide:** See PERFORMANCE.md
- **Issues:** Check GitHub Issues

---

## ✅ Success Checklist

- [ ] Project opens locally without errors
- [ ] All navigation links work
- [ ] Contact form submits successfully
- [ ] Lighthouse score 90+
- [ ] Works on mobile devices
- [ ] Videos play smoothly
- [ ] Animations are smooth
- [ ] Deployed to live URL
- [ ] Analytics working
- [ ] Forms being received

---

**Ready to launch? You're all set! 🎉**

For advanced customization, see the full README.md documentation.
