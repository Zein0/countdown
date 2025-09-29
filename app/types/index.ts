// Shared TypeScript types describing events, moods, and persisted settings.
export type CountdownMode = 'countdown' | 'countup';

export type Mood = 'Hopeful' | 'Melancholy' | 'Peaceful' | 'Silent';

export interface CountdownEvent {
  id: string;
  title: string;
  date: string;
  mode: CountdownMode;
  quote?: string;
  mood: Mood;
  backgroundColor?: string;
  backgroundImageUri?: string;
  pinned?: boolean;
  premiumRequired?: boolean;
  createdAt: string;
}

export interface CountdownSettings {
  theme: 'dark' | 'light';
  notifications: {
    daily: boolean;
    finalDay: boolean;
    anniversary: boolean;
  };
  premiumUnlocked: boolean;
}
