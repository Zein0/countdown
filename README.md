# Countdown — The Time That Slips Away

An Expo React Native application that lets you create emotional countdowns or count-ups to the moments that shape you.

> **🎉 Now on Expo SDK 54!** - Latest features, better performance, improved iOS 18 support.

## Getting Started

### Quick Start
```bash
npm install
npx expo start --clear
```

Scan the QR code with Expo Go on iOS.

### First Time Setup
```bash
# Windows
upgrade.bat

# Mac/Linux
chmod +x upgrade.sh
./upgrade.sh
```

## Features

- **iOS Home & Lock Screen Widgets** - Display countdowns on your home screen
- Create reflective countdowns with moods, quotes, and background hues
- Pin meaningful events to the top of the home feed
- Animated event view with shareable capture and progress tracking
- Local storage via AsyncStorage and notification scheduling
- Premium features: Additional moods, custom backgrounds, widget support
- Production-ready with error boundaries and performance optimizations

## Tech Stack

- **Expo SDK 54** with Expo Router 4.0
- **React Native 0.76** with latest performance improvements
- React Native Reanimated 3.16 for smooth animations
- Zustand for state management
- expo-widget 4.0 for iOS widgets
- Expo Notifications & Sharing
- AsyncStorage persistence
- TypeScript 5.6

## Documentation

- **[UPGRADE_SUMMARY.md](UPGRADE_SUMMARY.md)** - Quick upgrade overview
- **[EXPO_54_MIGRATION.md](EXPO_54_MIGRATION.md)** - Detailed migration guide
- **[PRODUCTION_IMPROVEMENTS.md](PRODUCTION_IMPROVEMENTS.md)** - Production enhancements
- **[FEATURES.md](FEATURES.md)** - Complete feature list
- **[DEBUG.md](DEBUG.md)** - Troubleshooting guide

## iOS Widget Support

This app includes iOS home screen and lock screen widget support. To use:

1. Build the app for iOS
2. Enable Premium in Settings
3. Tap "Widget" on any event
4. Add widget from iOS widget gallery
