/* ============================================
   WESTFIELD DOMINION - BACKEND API TEMPLATE
   Node.js + Express Example
   ============================================ */

/**
 * Installation:
 * npm install express dotenv cors sendgrid replicate openai
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sgMail = require('@sendgrid/mail');
const Replicate = require('replicate');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// ============================================
// CONFIGURATION
// ============================================

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    })
);

// ============================================
// ROUTES - FORM SUBMISSION
// ============================================

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, interest, message } = req.body;

        // Validation
        if (!name || !email || !interest) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Store in database (optional)
        const lead = {
            name,
            email,
            interest,
            message,
            timestamp: new Date(),
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        };

        // Save to database
        // await Lead.create(lead);

        // Send confirmation email to customer
        await sgMail.send({
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: 'Thank you for your interest in Westfield Dominion',
            html: `
                <h2>Hello ${name},</h2>
                <p>Thank you for your interest in Westfield Dominion!</p>
                <p>We've received your inquiry about: <strong>${interest}</strong></p>
                <p>Our team will be in touch within 24 hours with more information.</p>
                <hr>
                <p><strong>Your Message:</strong></p>
                <p>${message}</p>
                <hr>
                <p>Best regards,<br>Westfield Dominion Team</p>
            `
        });

        // Send notification to sales team
        await sgMail.send({
            to: process.env.SALES_EMAIL,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: `New Lead: ${name} (${interest})`,
            html: `
                <h2>New Lead Received</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Interest:</strong> ${interest}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            `
        });

        res.status(200).json({ 
            success: true, 
            message: 'Contact form submitted successfully' 
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Failed to submit form' });
    }
});

// ============================================
// ROUTES - AI IMAGE GENERATION
// ============================================

app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt, size = '1024x1024', quality = 'high' } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt required' });
        }

        // Call Replicate API for Stable Diffusion
        const output = await replicate.run(
            'stability-ai/stable-diffusion:db21e45d3f7023abc9f30f5cc4b526da',
            {
                input: {
                    prompt: prompt,
                    num_outputs: 1,
                    height: parseInt(size.split('x')[1]),
                    width: parseInt(size.split('x')[0]),
                    num_inference_steps: quality === 'high' ? 50 : 25,
                    guidance_scale: 7.5
                }
            }
        );

        res.status(200).json({ 
            success: true, 
            imageUrl: output[0] 
        });

    } catch (error) {
        console.error('Image generation error:', error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

// ============================================
// ROUTES - AI COPY GENERATION
// ============================================

app.post('/api/generate-copy', async (req, res) => {
    try {
        const { section, tone = 'professional', length = 'medium' } = req.body;

        const prompts = {
            retail: 'Write compelling marketing copy about flagship retail opportunities at a luxury shopping mall',
            sponsorship: 'Write about sponsorship packages and brand partnership opportunities',
            events: 'Write about event hosting capabilities for concerts, conferences, and activations',
            dining: 'Write about culinary excellence and dining destinations'
        };

        const prompt = prompts[section] || prompts.retail;
        const lengthMap = { short: 50, medium: 150, long: 300 };

        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `${prompt}. Tone: ${tone}. Length: approximately ${lengthMap[length]} words.`,
            max_tokens: lengthMap[length] * 1.5,
            temperature: 0.7
        });

        res.status(200).json({ 
            success: true, 
            copy: response.data.choices[0].text.trim() 
        });

    } catch (error) {
        console.error('Copy generation error:', error);
        res.status(500).json({ error: 'Failed to generate copy' });
    }
});

// ============================================
// ROUTES - PERSONALIZATION & RECOMMENDATIONS
// ============================================

app.post('/api/recommendations', async (req, res) => {
    try {
        const { currentSection, engagement } = req.body;

        // Simple recommendation logic
        let recommendations = [];

        if (engagement.retailTime > 30) {
            recommendations.push({
                type: 'retail',
                title: 'Explore Flagship Store Opportunities',
                link: '/retail'
            });
        }

        if (engagement.eventsTime > 30) {
            recommendations.push({
                type: 'events',
                title: 'Learn About Event Hosting',
                link: '/events'
            });
        }

        if (recommendations.length === 0) {
            recommendations = [
                { type: 'luxury', title: 'Discover Luxury Experiences' },
                { type: 'dining', title: 'Explore Culinary Excellence' }
            ];
        }

        res.status(200).json({ 
            success: true, 
            recommendations 
        });

    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
});

// ============================================
// ROUTES - ANALYTICS
// ============================================

app.post('/api/analytics', async (req, res) => {
    try {
        const { event, data } = req.body;

        // Log analytics event
        console.log(`[${new Date().toISOString()}] ${event}:`, data);

        // Save to database
        // await Analytics.create({ event, data, timestamp: new Date() });

        res.status(200).json({ success: true });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to log event' });
    }
});

// ============================================
// ROUTES - HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({ 
        error: err.message || 'Internal server error' 
    });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
    🚀 Westfield Dominion API Server
    ✓ Running on port ${PORT}
    ✓ Environment: ${process.env.NODE_ENV || 'development'}
    ✓ API endpoints ready
    `);
});

module.exports = app;

/**
 * EXAMPLE USAGE:
 * 
 * // From frontend
 * fetch('/api/contact', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     interest: 'retail',
 *     message: 'Interested in flagship opportunities'
 *   })
 * })
 * 
 * // Database schema (MongoDB example):
 * const leadSchema = {
 *   name: String,
 *   email: String,
 *   interest: String,
 *   message: String,
 *   timestamp: Date,
 *   ipAddress: String,
 *   converted: Boolean,
 *   notes: String
 * }
 */
