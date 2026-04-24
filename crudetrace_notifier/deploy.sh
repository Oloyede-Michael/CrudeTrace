#!/bin/bash

# CrudeTrace Notifier Deployment Script

echo "🚀 Deploying CrudeTrace Notifier..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✏️  Please edit .env with your configuration values"
    echo "   - Get SEPOLIA_RPC_URL from Infura or Alchemy"
    echo "   - Create Telegram bot at @BotFather"
    echo "   - Get TELEGRAM_CHAT_ID from bot updates"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building TypeScript..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 To start the notifier service:"
    echo "   npm start"
    echo ""
    echo "🔧 To run in development mode:"
    echo "   npm run dev"
    echo ""
    echo "📱 Telegram bot commands:"
    echo "   /start - Initialize bot"
    echo "   /status - Check service status"
    echo ""
    echo "🌐 API endpoints:"
    echo "   Webhooks: http://localhost:3001"
    echo "   WebSocket: ws://localhost:8080"
else
    echo "❌ Build failed. Check for TypeScript errors."
    exit 1
fi