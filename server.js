// ===== NODE.JS BACKEND SERVER =====
// Shree Umiya Infra Project Pvt Ltd Website - Contact Form Backend

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== SECURITY MIDDLEWARE =====

// Helmet for security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://shreeumiyahr.com', 'https://www.shreeumiyahr.com']
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 contact form submissions per hour
    message: {
        error: 'Too many contact form submissions. Please try again later.',
        retryAfter: '1 hour'
    }
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== EMAIL CONFIGURATION =====
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// ===== VALIDATION RULES =====
const contactValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces')
        .escape(),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),
    
    body('company')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Company name must be less than 200 characters')
        .escape(),
    
    body('service')
        .optional()
        .isIn(['recruitment', 'consulting', 'training', 'employee-relations', 'payroll', 'compliance', 'other'])
        .withMessage('Invalid service selection'),
    
    body('message')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Message must be between 10 and 2000 characters')
        .escape(),
    
    body('privacy')
        .equals('on')
        .withMessage('You must agree to the privacy policy'),
    
    // Honeypot validation
    body('website')
        .isEmpty()
        .withMessage('Spam detected')
];

// ===== SECURITY FUNCTIONS =====
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
}

function validateHoneypot(data) {
    // Check if honeypot field is filled (indicates bot)
    return !data.website || data.website.trim() === '';
}

function checkSpamKeywords(message) {
    const spamKeywords = [
        'viagra', 'casino', 'lottery', 'winner', 'congratulations',
        'click here', 'free money', 'make money fast', 'work from home',
        'bitcoin', 'cryptocurrency', 'investment opportunity'
    ];
    
    const lowerMessage = message.toLowerCase();
    return spamKeywords.some(keyword => lowerMessage.includes(keyword));
}

function logSecurityEvent(type, details, ip) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        type,
        details,
        ip,
        userAgent: details.userAgent || 'Unknown'
    };
    
    console.log(`Security Event: ${type}`, logEntry);
    
    // In production, you might want to send this to a security monitoring service
    if (process.env.NODE_ENV === 'production') {
        // Example: Send to logging service
        // logger.warn('Security event', logEntry);
    }
}

// ===== ROUTES =====

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
    etag: true,
    lastModified: true
}));

// Contact form endpoint
app.post('/api/contact', contactLimiter, contactValidation, async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        
        const { name, email, phone, company, service, message, privacy, website } = req.body;
        const clientIP = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');
        
        // Security checks
        if (!validateHoneypot(req.body)) {
            logSecurityEvent('HONEYPOT_TRIGGERED', { 
                ip: clientIP, 
                userAgent,
                honeypotValue: website 
            }, clientIP);
            return res.status(400).json({
                success: false,
                message: 'Invalid request'
            });
        }
        
        if (checkSpamKeywords(message)) {
            logSecurityEvent('SPAM_DETECTED', { 
                ip: clientIP, 
                userAgent,
                message: message.substring(0, 100) 
            }, clientIP);
            return res.status(400).json({
                success: false,
                message: 'Message contains inappropriate content'
            });
        }
        
        // Additional rate limiting per email
        const emailKey = `contact_${email}`;
        // You could implement Redis-based rate limiting here
        
        // Sanitize inputs
        const sanitizedData = {
            name: sanitizeInput(name),
            email: sanitizeInput(email),
            phone: phone ? sanitizeInput(phone) : '',
            company: company ? sanitizeInput(company) : '',
            service: service || 'general',
            message: sanitizeInput(message)
        };
        
        // Prepare email content
        const emailContent = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: process.env.CONTACT_EMAIL || 'info@shreeumiyainfra.com',
            replyTo: sanitizedData.email,
            subject: `New Contact Form Submission - ${sanitizedData.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ff6b35;">New Contact Form Submission</h2>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #2c3e50; margin-top: 0;">Contact Details</h3>
                        <p><strong>Name:</strong> ${sanitizedData.name}</p>
                        <p><strong>Email:</strong> ${sanitizedData.email}</p>
                        ${sanitizedData.phone ? `<p><strong>Phone:</strong> ${sanitizedData.phone}</p>` : ''}
                        ${sanitizedData.company ? `<p><strong>Company:</strong> ${sanitizedData.company}</p>` : ''}
                        <p><strong>Service Interest:</strong> ${sanitizedData.service}</p>
                    </div>
                    
                    <div style="background: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
                        <h3 style="color: #2c3e50; margin-top: 0;">Message</h3>
                        <p style="white-space: pre-wrap;">${sanitizedData.message}</p>
                    </div>
                    
                    <div style="margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 8px; font-size: 12px; color: #6c757d;">
                        <p><strong>Submission Details:</strong></p>
                        <p>IP Address: ${clientIP}</p>
                        <p>Timestamp: ${new Date().toISOString()}</p>
                        <p>User Agent: ${userAgent}</p>
                    </div>
                </div>
            `,
            text: `
                New Contact Form Submission
                
                Name: ${sanitizedData.name}
                Email: ${sanitizedData.email}
                ${sanitizedData.phone ? `Phone: ${sanitizedData.phone}` : ''}
                ${sanitizedData.company ? `Company: ${sanitizedData.company}` : ''}
                Service Interest: ${sanitizedData.service}
                
                Message:
                ${sanitizedData.message}
                
                Submission Details:
                IP Address: ${clientIP}
                Timestamp: ${new Date().toISOString()}
            `
        };
        
        // Send email
        await transporter.sendMail(emailContent);
        
        // Send auto-reply to customer
        const autoReplyContent = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: sanitizedData.email,
            subject: 'Thank you for contacting Shree Umiya Infra Project Pvt Ltd',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #ff6b35;">Shree Umiya Infra Project Pvt Ltd</h1>
                    </div>
                    
                    <h2 style="color: #2c3e50;">Thank you for your inquiry!</h2>
                    
                    <p>Dear ${sanitizedData.name},</p>
                    
                    <p>Thank you for reaching out to Shree Umiya Infra Project Pvt Ltd. We have received your message and will get back to you within 24 hours.</p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #2c3e50; margin-top: 0;">Your Message Summary</h3>
                        <p><strong>Service Interest:</strong> ${sanitizedData.service}</p>
                        <p><strong>Message:</strong> ${sanitizedData.message.substring(0, 200)}${sanitizedData.message.length > 200 ? '...' : ''}</p>
                    </div>
                    
                    <p>In the meantime, feel free to explore our services on our website or contact us directly at:</p>
                    
                    <ul>
                        <li>Phone: +91 98765 43210</li>
                        <li>Email: info@shreeumiyainfra.com</li>
                        <li>Address: Industrial Area, Phase 2, Gurgaon, Haryana 122001</li>
                    </ul>
                    
                    <p>Best regards,<br>
                    The Shree Umiya Infra Project Team</p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e9ecef;">
                    
                    <p style="font-size: 12px; color: #6c757d;">
                        This is an automated response. Please do not reply to this email.
                        If you need immediate assistance, please call us directly.
                    </p>
                </div>
            `
        };
        
        await transporter.sendMail(autoReplyContent);
        
        // Log successful submission
        console.log(`Contact form submitted successfully: ${sanitizedData.email} from ${clientIP}`);
        
        res.status(200).json({
            success: true,
            message: 'Thank you for your message. We will get back to you soon!'
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        
        // Log error for monitoring
        logSecurityEvent('CONTACT_FORM_ERROR', {
            error: error.message,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        }, req.ip);
        
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error processing your request. Please try again later.'
        });
    }
});

// API endpoint for form validation (real-time)
app.post('/api/validate-field', [
    body('field').isIn(['name', 'email', 'phone', 'message']),
    body('value').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Invalid validation request'
        });
    }
    
    const { field, value } = req.body;
    let isValid = true;
    let message = '';
    
    switch (field) {
        case 'name':
            if (value.length < 2 || value.length > 100) {
                isValid = false;
                message = 'Name must be between 2 and 100 characters';
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                isValid = false;
                message = 'Name can only contain letters and spaces';
            }
            break;
            
        case 'email':
            if (!validator.isEmail(value)) {
                isValid = false;
                message = 'Please provide a valid email address';
            }
            break;
            
        case 'phone':
            if (value && !validator.isMobilePhone(value)) {
                isValid = false;
                message = 'Please provide a valid phone number';
            }
            break;
            
        case 'message':
            if (value.length < 10 || value.length > 2000) {
                isValid = false;
                message = 'Message must be between 10 and 2000 characters';
            }
            break;
    }
    
    res.json({
        success: true,
        isValid,
        message
    });
});

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    
    // Don't leak error details in production
    const message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message;
    
    res.status(500).json({
        success: false,
        message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// ===== SERVER STARTUP =====
app.listen(PORT, () => {
    console.log(`🚀 Shree Umiya Infra Project server running on port ${PORT}`);
    console.log(`📧 Email configured: ${process.env.SMTP_USER ? 'Yes' : 'No'}`);
    console.log(`🔒 Security features: Enabled`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

module.exports = app;
