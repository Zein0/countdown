// Settings store: theme preference, notification toggles, and premium state.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemePreference = 'dark' | 'light';

export interface NotificationPreferences {
  daily: boolean;
  finalDay: boolean;
}

interface SettingsState {
  theme: ThemePreference;
  premiumUnlocked: boolean;
  notifications: NotificationPreferences;
  setTheme: (theme: ThemePreference) => void;
  toggleNotification: (type: keyof NotificationPreferences) => void;
  setPremiumUnlocked: (value: boolean) => void;
  reset: () => void;
}

const defaultNotifications: NotificationPreferences = {
  daily: false,
  finalDay: true
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      premiumUnlocked: false,
      notifications: defaultNotifications,
      setTheme: (theme) => set({ theme }),
      toggleNotification: (type) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            [type]: !state.notifications[type]
          }
        })),
      setPremiumUnlocked: (value) => set({ premiumUnlocked: value }),
      reset: () => set({ theme: 'dark', premiumUnlocked: false, notifications: defaultNotifications })
    }),
    {
      name: 'countdown-settings',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
