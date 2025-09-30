// Global context that orchestrates events, settings, and premium status.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CountdownEvent, CountdownState, EventMode, Mood, NotificationPreference } from '../types';
import { loadEvents, saveEvents } from '../storage/eventStorage';
import { defaultSettings, loadSettings, saveSettings } from '../storage/settingsStorage';
import { cancelNotificationsForEvent, scheduleNotificationsForEvent } from '../services/notificationService';
import { purchasePremium, restorePremium } from '../services/PremiumService';

interface AppContextValue extends CountdownState {
  isBootstrapping: boolean;
  addEvent: (event: Omit<CountdownEvent, 'id' | 'createdAt' | 'pinned'>) => Promise<void>;
  updateEvent: (id: string, changes: Partial<CountdownEvent>) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  availableMoods: Mood[];
  setNotificationPreference: (preference: NotificationPreference) => Promise<void>;
  toggleTheme: () => Promise<void>;
  unlockPremium: () => Promise<boolean>;
  restorePremiumAccess: () => Promise<boolean>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CountdownEvent[]>([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    (async () => {
      const [loadedEvents, loadedSettings] = await Promise.all([loadEvents(), loadSettings()]);
      setEvents(loadedEvents);
      setSettings(loadedSettings);
      setIsBootstrapping(false);
    })();
  }, []);

  useEffect(() => {
    if (!isBootstrapping) {
      saveEvents(events).catch(err => console.warn('Failed saving events', err));
    }
  }, [events, isBootstrapping]);

  useEffect(() => {
    if (!isBootstrapping) {
      saveSettings(settings).catch(err => console.warn('Failed saving settings', err));
    }
  }, [settings, isBootstrapping]);

  const addEvent = useCallback(async (event: Omit<CountdownEvent, 'id' | 'createdAt' | 'pinned'>) => {
    const newEvent: CountdownEvent = {
      ...event,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      pinned: false
    };
    setEvents(prev => [newEvent, ...prev]);
    await scheduleNotificationsForEvent(newEvent, settings.notificationPreference);
  }, [settings.notificationPreference]);

  const updateEvent = useCallback(async (id: string, changes: Partial<CountdownEvent>) => {
    let merged: CountdownEvent | undefined;
    setEvents(prev => prev.map(event => {
      if (event.id === id) {
        merged = { ...event, ...changes } as CountdownEvent;
        return merged;
      }
      return event;
    }));
    if (merged) {
      await scheduleNotificationsForEvent(merged, settings.notificationPreference);
    }
  }, [settings.notificationPreference]);

  const removeEvent = useCallback(async (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    await cancelNotificationsForEvent(id);
  }, []);

  const togglePin = useCallback(async (id: string) => {
    setEvents(prev => prev.map(event => (event.id === id ? { ...event, pinned: !event.pinned } : event)));
  }, []);

  const setNotificationPreference = useCallback(async (preference: NotificationPreference) => {
    setSettings(prev => ({ ...prev, notificationPreference: preference }));
    const updatedEvents = events;
    await Promise.all(updatedEvents.map(event => scheduleNotificationsForEvent(event, preference)));
  }, [events]);

  const toggleTheme = useCallback(async () => {
    setSettings(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  }, []);

  const unlockPremium = useCallback(async () => {
    const success = await purchasePremium();
    if (success) {
      setSettings(prev => ({ ...prev, premiumUnlocked: true }));
    }
    return success;
  }, []);

  const restorePremiumAccess = useCallback(async () => {
    const restored = await restorePremium();
    if (restored) {
      setSettings(prev => ({ ...prev, premiumUnlocked: true }));
    }
    return restored;
  }, []);

  const availableMoods = useMemo<Mood[]>(() => {
    if (settings.premiumUnlocked) {
      return ['Hopeful', 'Melancholy', 'Peaceful', 'Silent'];
    }
    return ['Hopeful', 'Melancholy'];
  }, [settings.premiumUnlocked]);

  const value = useMemo<AppContextValue>(() => ({
    events,
    settings,
    isBootstrapping,
    addEvent,
    updateEvent,
    removeEvent,
    togglePin,
    availableMoods,
    setNotificationPreference,
    toggleTheme,
    unlockPremium,
    restorePremiumAccess
  }), [
    addEvent,
    availableMoods,
    events,
    isBootstrapping,
    removeEvent,
    restorePremiumAccess,
    setNotificationPreference,
    settings,
    togglePin,
    toggleTheme,
    unlockPremium,
    updateEvent
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
};

export const useThemeMode = () => {
  const { settings } = useApp();
  return settings.theme;
};

export const usePremiumUnlocked = () => {
  const { settings } = useApp();
  return settings.premiumUnlocked;
};

export const isMoodAvailable = (mood: Mood, available: Mood[]): boolean => available.includes(mood);
