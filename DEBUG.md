# Debugging Crash After Build

## Issue Fixed: Circular Dependency

The crash was caused by a **circular dependency** between:
- `eventStore.ts` → imports `widgetService.ts`
- `widgetService.ts` → imports from `eventStore.ts`

This has been fixed by removing the auto-sync from the store.

## Steps to Fix the Crash

### 1. Stop Any Running Processes

**IMPORTANT: Do this first!**

```bash
# Kill any expo/metro processes
# On Windows:
taskkill /F /IM node.exe

# On Mac/Linux:
killall node
```

Or manually close all terminal windows running `expo start` or `npm start`

### 2. Clear All Caches

```bash
# Clear Metro bundler cache
rm -rf node_modules/.cache
rm -rf .expo

# On Windows PowerShell:
Remove-Item -Recurse -Force node_modules\.cache
Remove-Item -Recurse -Force .expo
```

### 3. Restart Development Server

```bash
# Start fresh with cleared cache:
npx expo start --clear

# If port is in use, use different port:
npx expo start --clear --port 8082
```

### 3. Rebuild the App

```bash
# For iOS simulator
npx expo run:ios

# For iOS device (requires EAS)
eas build --platform ios --profile development
```

### 4. If Still Crashing - Check Logs

#### iOS Simulator Logs:
```bash
# Terminal 1: Start expo
npx expo start

# Terminal 2: Watch logs
npx react-native log-ios
```

#### Physical Device Logs:
1. Open Xcode
2. Window → Devices and Simulators
3. Select your device
4. Click "Open Console"

## Files Changed (That Could Cause Crashes)

### Fixed:
1. ✅ **src/store/eventStore.ts** - Removed circular dependency
2. ✅ **src/constants/theme.ts** - Fixed MOOD_PALETTE type
3. ✅ **src/components/EventCard.tsx** - Fixed type cast

### Safe Changes:
- **src/components/ErrorBoundary.tsx** - New file (won't cause crashes)
- **src/hooks/usePremium.ts** - New file (won't cause crashes)
- **app/_layout.tsx** - Added ErrorBoundary wrapper (safe)

## Common Crash Causes & Solutions

### 1. "Cannot read property of undefined"
**Cause**: Importing before module is loaded (circular dependency)
**Solution**: Already fixed - removed circular import

### 2. "Element type is invalid"
**Cause**: Component not properly exported/imported
**Solution**: Check all imports use correct syntax

### 3. "undefined is not an object (evaluating 'MOOD_PALETTE.Hopeful')"
**Cause**: Constants not loading properly
**Solution**: Already fixed - removed `as const` from Record type

### 4. Widget crashes
**Cause**: Widget timeline code issue
**Solution**: The widget code is independent - app should still work even if widget fails

## Quick Test

After clearing cache and restarting:

```bash
npx expo start --clear
```

Then scan QR code with Expo Go or run on simulator:

```bash
npx expo run:ios
```

## If Problem Persists

### Rollback Strategy

If the app still crashes, you can temporarily revert the constants:

```typescript
// In src/components/EventCard.tsx - Line 8
// Remove:
import { COLORS, MOOD_PALETTE, DEFAULTS, ANIMATION, SPACING } from '@/constants/theme';

// Replace with old code:
const moodPalette: Record<string, string[]> = {
  Hopeful: ['#0B0C0F', '#1F3C3A'],
  Melancholy: ['#0B0C0F', '#2C2135'],
  Peaceful: ['#0B0C0F', '#1F2A3A'],
  Silent: ['#0B0C0F', '#1A1A1A']
};

// And revert the gradient line to:
const gradient = event.backgroundColor
  ? [event.backgroundColor, '#0B0C0F']
  : moodPalette[event.mood] ?? moodPalette.Melancholy;
```

## Verification Steps

1. ✅ App starts without errors
2. ✅ Can view home screen
3. ✅ Can create new event
4. ✅ Can view event detail
5. ✅ Can edit event
6. ✅ Can delete event
7. ✅ Widget updates (if premium unlocked)

## Important Notes

- The ErrorBoundary will catch any React crashes and show a friendly error screen
- Check the console for any warnings during development
- Widget functionality requires premium unlock (toggle in settings)

## Need Help?

If crash persists after clearing cache:

1. Check console output for specific error message
2. Look for red error screen with stack trace
3. Share the error message for specific debugging

## Key Fix Summary

**Before**: Store imported widgetService → Circular dependency crash
**After**: Edit screen handles widget sync → No circular dependency
