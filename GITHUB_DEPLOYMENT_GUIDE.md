# 🚀 GitHub Upload & Deployment Guide

## 📋 **Step-by-Step Instructions**

### **Step 1: Create GitHub Repository**

1. **Go to GitHub.com** and sign in to your account
2. **Click the "+" icon** in the top right corner
3. **Select "New repository"**
4. **Fill in the details:**
   - Repository name: `shree-umiya-infra-website`
   - Description: `Professional electrical infrastructure solutions website for Shree Umiya Infra Project Pvt Ltd`
   - Make it **Public** (required for free GitHub Pages)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. **Click "Create repository"**

### **Step 2: Connect Local Repository to GitHub**

Run these commands in your terminal (in the UM2 folder):

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/shree-umiya-infra-website.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

### **Step 3: Enable GitHub Pages**

1. **Go to your repository** on GitHub
2. **Click on "Settings"** tab
3. **Scroll down to "Pages"** section (in the left sidebar)
4. **Under "Source"**, select **"Deploy from a branch"**
5. **Select branch:** `main`
6. **Select folder:** `docs`
7. **Click "Save"**

### **Step 4: Wait for Deployment**

- GitHub will automatically deploy your website
- It may take 5-10 minutes for the first deployment
- You'll see a green checkmark when it's ready
- Your website will be available at: `https://YOUR_USERNAME.github.io/shree-umiya-infra-website`

## 🔄 **Future Updates**

### **To Update Your Website:**

1. **Make changes** to your files
2. **Run these commands:**

```bash
# Add changes
git add .

# Commit changes
git commit -m "Update website content"

# Push to GitHub
git push origin main
```

3. **GitHub Pages will automatically update** (takes 1-2 minutes)

## 🛠️ **Alternative Deployment Methods**

### **Method 1: Direct File Upload (Easiest)**

1. **Go to your GitHub repository**
2. **Click "Add file" → "Upload files"**
3. **Drag and drop** all your files:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `assets/` folder
4. **Commit changes**
5. **Enable GitHub Pages** (same as Step 3 above)

### **Method 2: Using GitHub Desktop**

1. **Download GitHub Desktop** from desktop.github.com
2. **Clone your repository**
3. **Copy your files** to the cloned folder
4. **Commit and push** through the GUI

## 📁 **File Structure for GitHub Pages**

Your repository should have this structure:
```
shree-umiya-infra-website/
├── docs/                    # GitHub Pages folder
│   ├── index.html          # Main website file
│   ├── styles.css          # CSS styles
│   ├── script.js           # JavaScript
│   └── assets/             # Images and icons
│       ├── logo.svg
│       ├── hero-image.svg
│       └── ... (all other assets)
├── .github/
│   └── workflows/
│       └── deploy.yml      # Auto-deployment workflow
├── README.md
├── package.json
└── ... (other project files)
```

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Website not loading:**
   - Check if GitHub Pages is enabled
   - Verify the `docs` folder contains your files
   - Wait 5-10 minutes for deployment

2. **Images not showing:**
   - Ensure all images are in the `docs/assets/` folder
   - Check file paths in HTML are correct

3. **Styling not working:**
   - Verify `styles.css` is in the `docs/` folder
   - Check the CSS file path in HTML

### **Check Deployment Status:**

1. **Go to your repository**
2. **Click "Actions" tab**
3. **Look for deployment status**

## 🌐 **Custom Domain (Optional)**

### **To use your own domain:**

1. **Add a CNAME file** in the `docs/` folder:
   ```
   yourdomain.com
   ```

2. **Update DNS settings** with your domain provider:
   - Add CNAME record: `www` → `YOUR_USERNAME.github.io`

3. **Update GitHub Pages settings:**
   - Go to repository Settings → Pages
   - Add your custom domain

## 📊 **Analytics & Monitoring**

### **Add Google Analytics:**

1. **Get Google Analytics tracking code**
2. **Add to your `index.html`** before closing `</head>` tag:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

## 🎯 **Quick Commands Summary**

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/shree-umiya-infra-website.git
git push -u origin main

# Future updates
git add .
git commit -m "Update website"
git push origin main
```

## ✅ **Checklist**

- [ ] GitHub repository created
- [ ] Files uploaded to GitHub
- [ ] GitHub Pages enabled
- [ ] Website accessible at GitHub Pages URL
- [ ] All images and styles working
- [ ] Contact form functional (if using backend)

## 🆘 **Need Help?**

- **GitHub Documentation:** https://docs.github.com/en/pages
- **GitHub Pages Guide:** https://pages.github.com/
- **Contact Support:** Check GitHub's help documentation

---

**Your website will be live at:** `https://YOUR_USERNAME.github.io/shree-umiya-infra-website`

🎉 **Congratulations! Your electrical infrastructure company website is now live on the internet!**
