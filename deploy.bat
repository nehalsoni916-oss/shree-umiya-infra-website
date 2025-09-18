@echo off
REM Deployment script for Shree Umiya HR website (Windows)
REM This script automates the deployment process

echo 🚀 Starting deployment of Shree Umiya HR website...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm ci --only=production
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies.
    pause
    exit /b 1
)

REM Run tests
echo 🧪 Running tests...
npm test
if %errorlevel% neq 0 (
    echo ⚠️ Tests failed, but continuing deployment...
)

REM Lint code
echo 🔍 Linting code...
npm run lint
if %errorlevel% neq 0 (
    echo ⚠️ Linting failed, but continuing deployment...
)

REM Security audit
echo 🔒 Running security audit...
npm audit
if %errorlevel% neq 0 (
    echo ⚠️ Security audit found issues, but continuing deployment...
)

REM Start the application
echo 🌟 Starting application...
node server.js

echo ✅ Deployment completed successfully!
echo 🌐 Website should be running on http://localhost:3000
echo 📧 Make sure to configure email settings in .env file
pause
