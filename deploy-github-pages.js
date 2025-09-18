// Simple deployment script for GitHub Pages
const fs = require('fs');
const path = require('path');

// Create docs directory for GitHub Pages
const docsDir = 'docs';

if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
}

// Copy files to docs directory
const filesToCopy = [
    'index.html',
    'styles.css', 
    'script.js',
    'assets'
];

filesToCopy.forEach(file => {
    const srcPath = file;
    const destPath = path.join(docsDir, file);
    
    if (fs.existsSync(srcPath)) {
        if (fs.statSync(srcPath).isDirectory()) {
            // Copy directory recursively
            copyDir(srcPath, destPath);
        } else {
            // Copy file
            fs.copyFileSync(srcPath, destPath);
        }
        console.log(`Copied ${file} to docs/`);
    }
});

// Copy public directory contents
if (fs.existsSync('public')) {
    const publicFiles = fs.readdirSync('public');
    publicFiles.forEach(file => {
        const srcPath = path.join('public', file);
        const destPath = path.join(docsDir, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
        console.log(`Copied public/${file} to docs/`);
    });
}

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

console.log('✅ GitHub Pages deployment files created successfully!');
console.log('📁 Files copied to docs/ directory');
console.log('🚀 Ready for GitHub Pages deployment');
