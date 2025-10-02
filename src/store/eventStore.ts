// Zustand store managing all countdown events and persistence.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CountdownMode = 'countdown' | 'countup';
export type CountdownFormat = 'relative' | 'precise' | 'seconds';
export type Mood = 'Hopeful' | 'Melancholy' | 'Peaceful' | 'Silent';

export interface CountdownEvent {
  id: string;
  title: string;
  emoji?: string;
  dateTime: string;
  mode: CountdownMode;
  quote?: string;
  mood: Mood;
  pinned: boolean;
  backgroundColor?: string;
  backgroundImage?: string | null;
  format: CountdownFormat;
  createdAt: string;
  progressOverride?: number | null;
  premiumFeatureUsed: boolean;
  notificationIds?: string[];
}

interface EventStoreState {
  events: CountdownEvent[];
  addEvent: (event: CountdownEvent) => void;
  updateEvent: (id: string, patch: Partial<CountdownEvent>) => void;
  deleteEvent: (id: string) => void;
  togglePin: (id: string) => void;
  replaceEvents: (events: CountdownEvent[]) => void;
}

export const useEventStore = create<EventStoreState>()(
  persist(
    (set, get) => ({
      events: [],
      addEvent: (event) =>
        set(({ events }) => ({ events: [...events, event] })),
      updateEvent: (id, patch) =>
        set(({ events }) => ({
          events: events.map((event) =>
            event.id === id ? { ...event, ...patch } : event
          )
        })),
      deleteEvent: (id) =>
        set(({ events }) => ({ events: events.filter((event) => event.id !== id) })),
      togglePin: (id) => {
        const { events } = get();
        const updated = events.map((event) =>
          event.id === id ? { ...event, pinned: !event.pinned } : event
        );
        set({ events: updated });
      },
      replaceEvents: (events) => set({ events })
    }),
    {
      name: 'countdown-events',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
