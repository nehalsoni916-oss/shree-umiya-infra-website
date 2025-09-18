# Shree Umiya Infra Project Pvt Ltd - Electrical Infrastructure Solutions Website

A modern, responsive, and secure website for Shree Umiya Infra Project Pvt Ltd, featuring comprehensive electrical infrastructure solutions, installation, maintenance, and repair services.

## 🌟 Features

### Frontend Features
- **Responsive Design**: Mobile-first approach with full compatibility across all devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Accessibility**: WCAG 2.1 compliant with screen reader support
- **Dark Mode**: Toggle between light and dark themes
- **SEO Optimized**: Meta tags, structured data, and social media integration
- **Performance**: Lazy loading, optimized images, and fast loading times

### Backend Features
- **Secure Contact Form**: Node.js backend with comprehensive validation
- **Email Integration**: Automated email responses and notifications
- **Security**: Rate limiting, input sanitization, and spam protection
- **Error Handling**: Comprehensive error logging and user feedback

### Security Features
- **Content Security Policy (CSP)**: Prevents XSS attacks
- **Input Validation**: Server-side validation with express-validator
- **Rate Limiting**: Prevents spam and abuse
- **Honeypot Protection**: Bot detection and filtering
- **HTTPS Ready**: SSL/TLS configuration support

## 📁 Project Structure

```
shree-umiya-hr-website/
├── public/                 # Static files served by Express
│   ├── index.html         # Main HTML file
│   ├── styles.css         # CSS styles
│   └── script.js          # JavaScript functionality
├── assets/                # Images and static assets
│   ├── logo.svg          # Company logo
│   ├── hero-image.svg    # Hero section image
│   ├── about-image.svg   # About section image
│   ├── team-member-*.svg # Team member photos
│   ├── portfolio-*.svg   # Portfolio project images
│   ├── client-*.svg      # Client testimonial photos
│   └── favicon.svg       # Website favicon
├── server.js             # Node.js backend server
├── package.json          # Dependencies and scripts
├── env.example           # Environment variables template
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)
- Email service (Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shreeumiyahr/website.git
   cd website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@shreeumiyahr.com
   CONTACT_EMAIL=info@shreeumiyahr.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Email Setup

#### Gmail Configuration
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the app password in your `.env` file

#### Other Email Providers
Update the SMTP settings in `.env`:
```env
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

### Customization

#### Company Information
Edit the following files to customize company details:
- `public/index.html`: Update company name, contact info, services
- `assets/logo.svg`: Replace with your company logo
- `assets/*.svg`: Replace placeholder images with actual photos

#### Styling
- `public/styles.css`: Modify colors, fonts, and layout
- CSS variables are defined in `:root` for easy customization

#### Content
- Update service descriptions in the Services section
- Modify team member information in the Team section
- Replace portfolio projects with actual case studies
- Update testimonials with real client feedback

## 🚀 Deployment

### Production Deployment

#### Using PM2 (Recommended)
1. **Install PM2 globally**
   ```bash
   npm install -g pm2
   ```

2. **Start the application**
   ```bash
   pm2 start server.js --name "shree-umiya-hr"
   ```

3. **Save PM2 configuration**
   ```bash
   pm2 save
   pm2 startup
   ```

#### Using Docker
1. **Create Dockerfile**
   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Build and run**
   ```bash
   docker build -t shree-umiya-hr .
   docker run -p 3000:3000 --env-file .env shree-umiya-hr
   ```

#### Using Heroku
1. **Install Heroku CLI**
2. **Create Heroku app**
   ```bash
   heroku create shree-umiya-hr
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SMTP_USER=your-email@gmail.com
   heroku config:set SMTP_PASS=your-app-password
   # ... other variables
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### SSL/HTTPS Setup

#### Using Let's Encrypt (Free)
1. **Install Certbot**
   ```bash
   sudo apt-get install certbot
   ```

2. **Generate certificate**
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   ```

3. **Update server.js** to use SSL:
   ```javascript
   const https = require('https');
   const fs = require('fs');
   
   const options = {
     key: fs.readFileSync('/path/to/private.key'),
     cert: fs.readFileSync('/path/to/certificate.crt')
   };
   
   https.createServer(options, app).listen(443);
   ```

#### Using Cloudflare (Recommended)
1. Add your domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS encryption
4. Configure security settings

## 🛡️ Security Best Practices

### Production Security Checklist
- [ ] Use HTTPS in production
- [ ] Set secure environment variables
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Use strong passwords for email accounts
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity
- [ ] Backup data regularly

### Environment Variables Security
- Never commit `.env` files to version control
- Use different credentials for development and production
- Rotate passwords regularly
- Use environment-specific configurations

## 📊 Performance Optimization

### Frontend Optimization
- Images are optimized SVG format
- CSS and JavaScript are minified
- Lazy loading implemented
- CDN ready for static assets

### Backend Optimization
- Rate limiting prevents abuse
- Input validation reduces processing overhead
- Efficient error handling
- Logging for monitoring

## 🧪 Testing

### Manual Testing
1. **Form Validation**: Test all form fields
2. **Responsive Design**: Test on different screen sizes
3. **Accessibility**: Use screen readers and keyboard navigation
4. **Performance**: Test loading times and animations
5. **Security**: Test rate limiting and input validation

### Automated Testing
```bash
# Run tests (when implemented)
npm test

# Lint code
npm run lint

# Security audit
npm audit
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Troubleshooting

### Common Issues

#### Email Not Sending
1. Check SMTP credentials
2. Verify app password for Gmail
3. Check firewall settings
4. Review email service logs

#### Images Not Loading
1. Verify file paths in HTML
2. Check file permissions
3. Ensure files exist in assets folder

#### Form Not Submitting
1. Check browser console for errors
2. Verify backend server is running
3. Check network connectivity
4. Review server logs

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
LOG_LEVEL=debug
```

## 📞 Support

For technical support or questions:
- Email: support@shreeumiyahr.com
- Phone: +91 98765 43210
- Website: https://shreeumiyahr.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📈 Future Enhancements

- [ ] Multi-language support
- [ ] Blog section
- [ ] Client portal
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Integration with HR software
- [ ] Advanced reporting dashboard

## 🙏 Acknowledgments

- Design inspiration from modern HR websites
- Icons from Font Awesome
- Fonts from Google Fonts
- Animation library: AOS.js

---

**Shree Umiya HR** - Transforming organizations through strategic HR solutions.

*Built with ❤️ for modern businesses*
