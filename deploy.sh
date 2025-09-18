#!/bin/bash

# Deployment script for Shree Umiya HR website
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting deployment of Shree Umiya HR website..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run tests
echo "🧪 Running tests..."
npm test

# Lint code
echo "🔍 Linting code..."
npm run lint

# Security audit
echo "🔒 Running security audit..."
npm audit

# Build assets (if needed)
echo "🏗️ Building assets..."
# Add build commands here if needed

# Start the application
echo "🌟 Starting application..."
if command -v pm2 &> /dev/null; then
    echo "Using PM2 to start the application..."
    pm2 start server.js --name "shree-umiya-hr"
    pm2 save
else
    echo "PM2 not found. Starting with node..."
    node server.js
fi

echo "✅ Deployment completed successfully!"
echo "🌐 Website should be running on http://localhost:3000"
echo "📧 Make sure to configure email settings in .env file"
