#!/bin/bash

# Expo 54 Upgrade Script
# This script automates the upgrade process

set -e

echo "🚀 Starting Expo 54 Upgrade Process..."
echo ""

# Step 1: Backup
echo "📦 Step 1: Creating backup..."
if [ ! -d "../countdown-backup" ]; then
    cp -r . ../countdown-backup
    echo "✅ Backup created at ../countdown-backup"
else
    echo "⚠️  Backup already exists, skipping..."
fi
echo ""

# Step 2: Clean
echo "🧹 Step 2: Cleaning old dependencies..."
echo "Removing node_modules..."
rm -rf node_modules
echo "Removing package-lock.json..."
rm -f package-lock.json
echo "Removing .expo cache..."
rm -rf .expo
echo "Removing metro cache..."
rm -rf node_modules/.cache
echo "✅ Cleanup complete"
echo ""

# Step 3: Install
echo "📥 Step 3: Installing Expo 54 dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 4: Prebuild (optional)
read -p "🔧 Do you want to run prebuild? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Running expo prebuild..."
    npx expo prebuild --clean
    echo "✅ Prebuild complete"
else
    echo "⏭️  Skipping prebuild"
fi
echo ""

# Step 5: Verify
echo "🔍 Step 5: Verifying installation..."
node -e "console.log('✅ Node version:', process.version)"
npx expo --version
echo ""

# Step 6: Instructions
echo "✅ Upgrade Complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Run: npx expo start --clear"
echo "  2. Scan QR code with Expo Go or run: npx expo run:ios"
echo "  3. Test all features (see EXPO_54_MIGRATION.md)"
echo ""
echo "📚 Documentation:"
echo "  - UPGRADE_SUMMARY.md - Quick overview"
echo "  - EXPO_54_MIGRATION.md - Detailed guide"
echo "  - DEBUG.md - Troubleshooting"
echo ""
echo "🎉 Happy coding with Expo 54!"
