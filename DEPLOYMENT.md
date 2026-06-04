# Deployment Guide - Westfield Dominion

## Quick Deployment Options

### 1️⃣ Vercel (Recommended)

**Pros:** Automatic deployment, free SSL, edge caching, serverless functions
**Time:** 2-3 minutes

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

**Configuration:** `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".",
  "env": {
    "OPENAI_API_KEY": "@openai_api_key",
    "SENDGRID_API_KEY": "@sendgrid_api_key"
  }
}
```

---

### 2️⃣ Netlify

**Pros:** Git integration, form handling, serverless functions, generous free tier
**Time:** 2 minutes

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Configuration:** `netlify.toml`
```toml
[build]
  publish = "."
  command = "npm run build"

[context.production.environment]
  OPENAI_API_KEY = "your-key"
  SENDGRID_API_KEY = "your-key"

[[redirects]]
  from = "/api/*"
  to = "https://api.westfield-dominion.com/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3️⃣ GitHub Pages (Static)

**Pros:** Free, integrated with GitHub, no configuration needed
**Time:** 1 minute

```bash
# Push to GitHub
git add .
git commit -m "Deploy sales deck"
git push origin main
```

Then enable Pages in repository settings:
- Settings → Pages
- Source: Deploy from branch
- Branch: main
- Save

Your site will be live at: `https://yourusername.github.io/westfield-dominion`

---

### 4️⃣ Self-Hosted (Linux/Docker)

**Pros:** Full control, custom domain, advanced customization
**Time:** 5-10 minutes

#### Using Nginx

```bash
# Install Nginx
sudo apt-get install nginx

# Copy files to web root
sudo cp -r . /var/www/westfield-dominion/

# Create Nginx config
sudo nano /etc/nginx/sites-available/westfield-dominion
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name westfield-dominion.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name westfield-dominion.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/westfield-dominion.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/westfield-dominion.com/privkey.pem;

    # Root directory
    root /var/www/westfield-dominion;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if needed)
    location /api/ {
        proxy_pass https://api.westfield-dominion.com/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/westfield-dominion /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Using Docker

Create `Dockerfile`:
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

Build & run:
```bash
docker build -t westfield-dominion .
docker run -p 80:80 -d westfield-dominion
```

---

### 5️⃣ AWS S3 + CloudFront

**Pros:** Highly scalable, global CDN, enterprise-grade
**Time:** 10-15 minutes

```bash
# Create S3 bucket
aws s3 mb s3://westfield-dominion

# Upload files
aws s3 sync . s3://westfield-dominion --exclude ".git/*"

# Enable static website hosting
aws s3api put-bucket-website \
  --bucket westfield-dominion \
  --website-configuration file://website.json

# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront.json
```

---

## Post-Deployment Checklist

- [ ] Test all navigation links
- [ ] Verify form submissions working
- [ ] Check Lighthouse score (target: 90+)
- [ ] Test on mobile devices
- [ ] Verify SSL certificate
- [ ] Check analytics integration
- [ ] Test video playback
- [ ] Verify API endpoints
- [ ] Set up monitoring alerts
- [ ] Configure auto-backups
- [ ] Test CDN caching
- [ ] Review security headers

---

## Performance Optimization for Production

### 1. Enable Gzip Compression
```nginx
gzip on;
gzip_types text/plain text/css application/javascript;
gzip_min_length 1000;
```

### 2. Set Cache Headers
```
Cache-Control: public, max-age=31536000, immutable
```

### 3. Optimize Images
```bash
npm run optimize
```

### 4. Enable HTTP/2
```nginx
listen 443 ssl http2;
```

### 5. Add Security Headers
```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'" always;
```

---

## Monitoring & Maintenance

### Set Up Monitoring
- **Uptime Monitoring:** StatusPage.io or Uptime Robot
- **Error Tracking:** Sentry.io
- **Performance:** DataDog or New Relic
- **Logs:** CloudWatch or ELK Stack

### Regular Maintenance
- Update dependencies monthly: `npm update`
- Check security vulnerabilities: `npm audit`
- Monitor error rates and 404s
- Review analytics monthly
- Test contact forms monthly
- Verify backup strategy

### Database Backups (if applicable)
```bash
# Daily backups
0 2 * * * pg_dump westfield > /backups/westfield-$(date +\%Y\%m\%d).sql

# Keep last 30 days
find /backups -type f -name "*.sql" -mtime +30 -delete
```

---

## Rollback Procedure

### Git-based Rollback
```bash
git revert <commit-hash>
git push origin main
# Automatic redeployment triggers
```

### Manual Rollback
```bash
# Keep previous versions
tar czf backups/westfield-$(date +%Y%m%d).tar.gz .

# Deploy previous version
rm -rf *
tar xzf backups/westfield-previous.tar.gz
```

---

## Environment-Specific Setup

### Development
```bash
npm run dev
# Runs on localhost:8000 with hot reload
```

### Staging
```bash
NODE_ENV=staging npm run build
# Deploy to staging.westfield-dominion.com
```

### Production
```bash
NODE_ENV=production npm run build
# Deploy to westfield-dominion.com
# With optimizations and monitoring
```

---

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          uploadArtifacts: true
```

---

## SSL Certificate Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d westfield-dominion.com

# Auto-renewal (runs daily)
sudo systemctl enable certbot.timer
```

---

## Domain Configuration

### DNS Records
```
A record:     westfield-dominion.com    →  [Your IP/CDN]
CNAME record: www                       →  westfield-dominion.com
MX record:    (for email)               →  mail.westfield-dominion.com
TXT record:   (SPF/DKIM/DMARC)          →  [Your mail provider]
```

---

## Support & Troubleshooting

**404 on refresh?**
- Configure SPA routing in web server
- Enable URL rewrite rules

**Slow initial load?**
- Enable gzip compression
- Optimize images
- Implement lazy loading
- Use CDN for static assets

**Form submissions not working?**
- Verify API endpoint is accessible
- Check CORS headers
- Review API logs

**Video not playing?**
- Check video format/codec compatibility
- Verify CORS headers for remote videos
- Check browser console for errors

---

**Last Updated:** June 2, 2026
