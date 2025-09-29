// CountdownContext centralises event data, settings, and premium state management.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { CountdownEvent, CountdownMode, CountdownSettings, Mood } from '@/types';
import { loadEvents, loadSettings, saveEvents, saveSettings } from '@/storage/countdownStorage';
import { scheduleCountdownNotifications, cancelNotificationsForEvent } from '@/services/notifications';
import { requestPurchase, restorePurchases } from '@/services/premium';

interface CountdownState {
  events: CountdownEvent[];
  settings: CountdownSettings;
  loading: boolean;
  premiumLoading: boolean;
}

const initialState: CountdownState = {
  events: [],
  settings: {
    theme: 'dark',
    notifications: {
      daily: false,
      finalDay: true,
      anniversary: true
    },
    premiumUnlocked: false
  },
  loading: true,
  premiumLoading: false
};

type Action =
  | { type: 'SET_EVENTS'; payload: CountdownEvent[] }
  | { type: 'SET_SETTINGS'; payload: CountdownSettings }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PREMIUM_LOADING'; payload: boolean };

function reducer(state: CountdownState, action: Action): CountdownState {
  switch (action.type) {
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PREMIUM_LOADING':
      return { ...state, premiumLoading: action.payload };
    default:
      return state;
  }
}

interface CountdownContextValue extends CountdownState {
  addEvent: (input: {
    title: string;
    date: Date;
    mode: CountdownMode;
    quote?: string;
    mood: Mood;
    backgroundColor?: string;
    backgroundImageUri?: string;
    premiumRequired?: boolean;
  }) => Promise<void>;
  updateEvent: (event: CountdownEvent) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
  togglePinned: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<CountdownSettings>) => Promise<void>;
  purchasePremium: () => Promise<boolean>;
  restorePremium: () => Promise<void>;
}

const CountdownContext = createContext<CountdownContextValue | undefined>(undefined);

export const CountdownProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function hydrate() {
      dispatch({ type: 'SET_LOADING', payload: true });
      const [events, settings] = await Promise.all([loadEvents(), loadSettings()]);
      dispatch({ type: 'SET_EVENTS', payload: events });
      dispatch({ type: 'SET_SETTINGS', payload: settings });
      dispatch({ type: 'SET_LOADING', payload: false });
      setHydrated(true);
    }
    hydrate();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveEvents(state.events).catch((error) => console.warn('Persist events error', error));
  }, [state.events, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveSettings(state.settings).catch((error) => console.warn('Persist settings error', error));
  }, [state.settings, hydrated]);

  const addEvent = useCallback<CountdownContextValue['addEvent']>(
    async ({ title, date, mode, quote, mood, backgroundColor, backgroundImageUri, premiumRequired }) => {
      const event: CountdownEvent = {
        id: `${Date.now()}`,
        title,
        date: date.toISOString(),
        mode,
        quote,
        mood,
        backgroundColor,
        backgroundImageUri,
        premiumRequired,
        pinned: false,
        createdAt: new Date().toISOString()
      };
      const updated = [...state.events, event];
      dispatch({ type: 'SET_EVENTS', payload: sortEvents(updated) });
      await scheduleCountdownNotifications(event, state.settings.notifications);
    },
    [state.events, state.settings.notifications]
  );

  const updateEvent = useCallback(async (event: CountdownEvent) => {
    const updated = state.events.map((item) => (item.id === event.id ? event : item));
    dispatch({ type: 'SET_EVENTS', payload: sortEvents(updated) });
    await scheduleCountdownNotifications(event, state.settings.notifications);
  }, [state.events, state.settings.notifications]);

  const removeEvent = useCallback(async (id: string) => {
    const target = state.events.find((item) => item.id === id);
    if (!target) return;
    dispatch({ type: 'SET_EVENTS', payload: state.events.filter((item) => item.id !== id) });
    await cancelNotificationsForEvent(id);
  }, [state.events]);

  const togglePinned = useCallback(async (id: string) => {
    const updated = state.events.map((event) =>
      event.id === id ? { ...event, pinned: !event.pinned } : event
    );
    dispatch({ type: 'SET_EVENTS', payload: sortEvents(updated) });
  }, [state.events]);

  const updateSettings = useCallback(async (settings: Partial<CountdownSettings>) => {
    dispatch({
      type: 'SET_SETTINGS',
      payload: { ...state.settings, ...settings }
    });
  }, [state.settings]);

  const purchasePremium = useCallback(async () => {
    try {
      dispatch({ type: 'SET_PREMIUM_LOADING', payload: true });
      const success = await requestPurchase();
      if (success) {
        dispatch({
          type: 'SET_SETTINGS',
          payload: { ...state.settings, premiumUnlocked: true }
        });
      }
      return success;
    } finally {
      dispatch({ type: 'SET_PREMIUM_LOADING', payload: false });
    }
  }, [state.settings]);

  const restorePremium = useCallback(async () => {
    try {
      dispatch({ type: 'SET_PREMIUM_LOADING', payload: true });
      const restored = await restorePurchases();
      if (restored) {
        dispatch({
          type: 'SET_SETTINGS',
          payload: { ...state.settings, premiumUnlocked: true }
        });
      }
    } finally {
      dispatch({ type: 'SET_PREMIUM_LOADING', payload: false });
    }
  }, [state.settings]);

  const value = useMemo<CountdownContextValue>(() => ({
    ...state,
    addEvent,
    updateEvent,
    removeEvent,
    togglePinned,
    updateSettings,
    purchasePremium,
    restorePremium
  }), [state, addEvent, updateEvent, removeEvent, togglePinned, updateSettings, purchasePremium, restorePremium]);

  return <CountdownContext.Provider value={value}>{children}</CountdownContext.Provider>;
};

function sortEvents(events: CountdownEvent[]): CountdownEvent[] {
  return [...events].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

export function useCountdowns(): CountdownContextValue {
  const context = useContext(CountdownContext);
  if (!context) {
    throw new Error('useCountdowns must be used within CountdownProvider');
  }
  return context;
}
