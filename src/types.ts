// Shared application types for Countdown — The Time That Slips Away.
// These structures describe events, settings, and premium status used across the app.

export type EventMode = 'countdown' | 'countup';

export type Mood = 'Hopeful' | 'Melancholy' | 'Peaceful' | 'Silent';

export type NotificationPreference = 'daily' | 'final' | 'anniversary' | 'none';

export interface EventBackground {
  type: 'color' | 'image';
  value: string; // Hex color or URI depending on the background type.
}

export interface CountdownEvent {
  id: string;
  title: string;
  date: string; // ISO string for date/time.
  mode: EventMode;
  quote?: string;
  mood: Mood;
  background?: EventBackground;
  pinned: boolean;
  createdAt: string;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  notificationPreference: NotificationPreference;
  premiumUnlocked: boolean;
  ambientSound: boolean; // Peaceful ambient background sound toggle for premium users.
}

export interface CountdownState {
  events: CountdownEvent[];
  settings: AppSettings;
}
