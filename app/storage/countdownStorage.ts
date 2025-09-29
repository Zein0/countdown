// Storage helpers persist events and settings locally via AsyncStorage.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CountdownEvent, CountdownSettings } from '@/types';

const EVENTS_KEY = 'countdown.events';
const SETTINGS_KEY = 'countdown.settings';

const defaultSettings: CountdownSettings = {
  theme: 'dark',
  notifications: {
    daily: false,
    finalDay: true,
    anniversary: true
  },
  premiumUnlocked: false
};

export async function loadEvents(): Promise<CountdownEvent[]> {
  try {
    const raw = await AsyncStorage.getItem(EVENTS_KEY);
    if (!raw) {
      return [];
    }
    const parsed: CountdownEvent[] = JSON.parse(raw);
    return parsed.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  } catch (error) {
    console.error('Failed to load events', error);
    return [];
  }
}

export async function saveEvents(events: CountdownEvent[]): Promise<void> {
  try {
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save events', error);
    throw error;
  }
}

export async function loadSettings(): Promise<CountdownSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return defaultSettings;
    }
    return { ...defaultSettings, ...JSON.parse(raw) } as CountdownSettings;
  } catch (error) {
    console.error('Failed to load settings', error);
    return defaultSettings;
  }
}

export async function saveSettings(settings: CountdownSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings', error);
    throw error;
  }
}
