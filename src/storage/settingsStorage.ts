// AsyncStorage helpers for app-wide settings and premium status.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types';
import { STORAGE_KEYS } from './storageKeys';

export const defaultSettings: AppSettings = {
  theme: 'dark',
  notificationPreference: 'daily',
  premiumUnlocked: false,
  ambientSound: false
};

export const loadSettings = async (): Promise<AppSettings> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!raw) {
    return defaultSettings;
  }
  try {
    const parsed = JSON.parse(raw) as AppSettings;
    return { ...defaultSettings, ...parsed };
  } catch (error) {
    console.warn('Failed to parse stored settings', error);
    return defaultSettings;
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};
