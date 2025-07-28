# PowerShell script for starting the development server
# This script avoids the && syntax error in PowerShell

Write-Host "🚀 Online Jobs Backend - Development Server" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the backend directory." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "🔧 Starting development server..." -ForegroundColor Yellow
Write-Host "🌐 Server will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📚 API Documentation: http://localhost:3000/api" -ForegroundColor Cyan
Write-Host "🔍 Admin Panel: http://localhost:3000/public/admin-dashboard.html" -ForegroundColor Cyan

# Start the development server
npm run start:dev 