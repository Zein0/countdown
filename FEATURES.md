# Countdown — The Time That Slips Away

> An iOS countdown widget app that turns meaningful moments into beautiful home screen and lock screen widgets.

## Overview

Countdown is an emotional time-tracking app that lets you create countdowns to future events or count-ups from past memories. Pin your most meaningful moments to iOS widgets and keep them visible on your home screen or lock screen.

## Core Features

### 🎯 Event Creation & Management

- **Flexible Time Tracking**: Create both countdowns (time remaining) and count-ups (time elapsed)
- **Rich Event Details**:
  - Custom titles and emoji icons
  - Target date & time selection
  - Optional inspirational quotes
  - Mood-based visual themes (Hopeful, Melancholy, Peaceful, Silent)
  - Custom background colors or images (Premium)
- **Multiple Display Formats**:
  - **Relative**: Human-readable (e.g., "5 days left")
  - **Precise**: Detailed breakdown (e.g., "5d · 12h 34m 22s left")
  - **Seconds**: Total seconds remaining/elapsed
- **Progress Tracking**: Visual progress bar showing time elapsed from event creation to target date
- **Pin Management**: Pin important events to the top of your feed

### 📱 iOS Widget Integration

- **Home Screen & Lock Screen Support**: Display any event as a live widget
- **Widget Sizes**: Small and medium widget sizes supported
- **Real-time Updates**: Widgets update automatically to show current countdown/count-up
- **One-Tap Widget Assignment**: Set any event as your active widget from the event detail screen
- **Widget Customization**: Inherits event emoji, title, format, and progress settings
- **Premium Feature**: Widget placement requires premium unlock

### 🔔 Smart Notifications

Configurable notification system with three types:

1. **Final Day**: Notification when the countdown reaches the target date
2. **Daily Reminders**: Morning notifications (9:00 AM) for active countdowns
3. **Anniversary Notifications**: Yearly reminders for past events (count-ups)

All notifications include:
- Event title
- Human-readable time remaining/elapsed
- Optional custom quote integration

### 🎨 Personalization

- **Mood Themes**: 4 distinct visual moods affecting card gradients
  - Hopeful (teal-green tones)
  - Melancholy (purple tones)
  - Peaceful (blue tones) - Premium
  - Silent (monochrome) - Premium
- **Custom Backgrounds**: Set unique background colors for each event
- **Theme Support**: Dark mode optimized (light mode theme selector present but not implemented)
- **Custom Emoji**: Any emoji supported for event icons

### 📤 Sharing & Export

- **Share as Image**: Generate and share beautiful countdown cards as PNG images
- **Screen Capture**: Uses `react-native-view-shot` to capture the live event view
- **Native Share Sheet**: Integrates with iOS native sharing

### 💎 Premium Features

- **Peaceful & Silent Moods**: Unlock 2 additional mood themes
- **Custom Background Images**: Set photo backgrounds for events
- **Widget Placement**: Required for home screen widget functionality
- **Future**: Placeholder mentions "serene soundscapes" (not yet implemented)

## Technical Architecture

### Tech Stack

- **Framework**: Expo SDK 51 with Expo Router (file-based routing)
- **Runtime**: React Native 0.74.5 on iOS
- **State Management**: Zustand with AsyncStorage persistence
- **Animations**: React Native Reanimated 3
- **Widgets**: expo-widget (iOS widget support)
- **Notifications**: expo-notifications
- **Data Fetching**: @tanstack/react-query (installed but usage minimal)

### Project Structure

```
countdown/
├── app/                      # Expo Router screens
│   ├── index.tsx            # Home feed
│   ├── add.tsx              # Event creation
│   ├── settings.tsx         # App settings
│   └── event/
│       ├── [id].tsx         # Event detail view
│       └── [id]/edit.tsx    # Event editing
├── src/
│   ├── components/          # Reusable UI components
│   ├── services/            # Business logic
│   │   ├── widgetService.ts       # Widget sync
│   │   ├── notificationService.ts # Notification scheduling
│   │   └── premiumService.ts      # Premium features
│   ├── store/              # Zustand state stores
│   │   ├── eventStore.ts          # Event data
│   │   └── settingsStore.ts       # App settings
│   └── utils/
│       └── time.ts         # Time calculation utilities
└── widgets/
    └── stillness-countdown.tsx # iOS widget definition
```

### Data Models

**CountdownEvent**:
```typescript
{
  id: string                    // nanoid generated
  title: string
  emoji?: string
  dateTime: string             // ISO 8601
  mode: 'countdown' | 'countup'
  quote?: string
  mood: 'Hopeful' | 'Melancholy' | 'Peaceful' | 'Silent'
  pinned: boolean
  backgroundColor?: string
  backgroundImage?: string | null
  format: 'relative' | 'precise' | 'seconds'
  createdAt: string           // ISO 8601
  progressEnabled: boolean
  premiumFeatureUsed: boolean
  notificationIds?: string[]
}
```

### Persistence Strategy

- **AsyncStorage**: All events and settings persisted locally
- **Zustand Middleware**: Automatic persistence with version migration support
- **Widget Storage**: Separate expo-widget storage for active widget event
- **No Cloud Sync**: All data stays on device

### Widget Implementation

- **Widget Kind**: `stillness.countdown`
- **Update Strategy**: Single event at a time can be synced to widget
- **Data Flow**: App → expo-widget storage → iOS widget
- **Families**: systemSmall, systemMedium
- **Lock Screen**: Enabled via `supportsLockScreen: true`

## User Experience Flow

1. **First Launch**: Empty state with candle emoji and call-to-action
2. **Create Event**: FAB → Event form with all customization options
3. **Browse Feed**: Events sorted by pinned status, then chronological
4. **View Detail**: Tap event → Full-screen detail with live countdown
5. **Set Widget**: Premium users tap "Widget" → Event synced to home screen
6. **Edit/Delete**: Edit screen accessible from detail view
7. **Settings**: Configure notifications, theme, premium status

## Platform Support

- **iOS**: Full support (primary platform)
- **Android**: Configuration exists but not optimized (no widget support)
- **Web**: Not supported

## Known Limitations

1. Widget updates depend on iOS system refresh intervals (not every second)
2. Only one event can be displayed on the widget at a time
3. iOS notification limit (64) not enforced in scheduling logic
4. Premium unlock is a local toggle (no payment integration)
5. No iCloud sync or backup functionality
6. No recurring events or event templates
7. Light theme toggle exists but doesn't change UI

## Future Enhancement Opportunities

- [ ] Multiple widget support (different sizes showing different events)
- [ ] Widget configuration UI (select which event without opening app)
- [ ] Event templates for common countdowns (birthdays, holidays)
- [ ] Categories/tags for events
- [ ] Event history and analytics
- [ ] Export/import functionality
- [ ] iCloud sync
- [ ] Interactive widgets (iOS 17+)
- [ ] Live Activities for active countdowns
- [ ] Soundscapes implementation
- [ ] Calendar integration
- [ ] Siri shortcuts
- [ ] Apple Watch complications

## Premium Monetization Strategy

Currently implemented as a boolean toggle in settings. Intended monetization approach:

- One-time purchase or subscription model
- Unlocks: 2 additional moods, custom backgrounds, widget placement
- Placeholder for future audio features (soundscapes)

---

**Version**: 1.0.0
**Bundle ID**: com.zein00.countdown
**Platform**: iOS (iPhone only, no iPad support)
