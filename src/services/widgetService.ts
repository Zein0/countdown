import { Platform } from 'react-native';
import Constants from 'expo-constants';
import type { CountdownEvent } from '@/store/eventStore';

interface WidgetModule {
  setItemAsync: (key: string, value: string) => Promise<void>;
  deleteItemAsync?: (key: string) => Promise<void>;
  updateTimelinesAsync: (options: { kind: string }) => Promise<void>;
}

interface WidgetEventPayload {
  id: string;
  title: string;
  emoji: string;
  dateTime: string;
  mode: 'countdown' | 'countup';
  format: 'relative' | 'precise' | 'seconds';
  mood: string;
  createdAt: string;
  progressEnabled: boolean;
}

const WIDGET_KIND = 'stillness.countdown';
const STORAGE_KEY = 'stillness.widget.event';

let widgetModule: WidgetModule | null = null;

const getWidgetModule = (): WidgetModule | null => {
  if (widgetModule !== null) {
    return widgetModule;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const module = require('expo-widget') as WidgetModule;
    widgetModule = module;
    return widgetModule;
  } catch (error) {
    console.error('Failed to load expo-widget module:', error);
    widgetModule = null;
    return null;
  }
};

export const getCurrentWidgetEventId = async (): Promise<string | null> => {
  if (Platform.OS !== 'ios') {
    return null;
  }

  const module = getWidgetModule();
  if (!module) {
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stored = await (module as any).getItemAsync?.(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const payload: WidgetEventPayload = JSON.parse(stored);
    return payload.id;
  } catch (error) {
    console.error('Failed to get current widget event:', error);
    return null;
  }
};

export const syncWidgetForEvent = async (
  event: CountdownEvent | null
): Promise<void> => {
  if (Platform.OS !== 'ios') {
    console.warn('Widget sync is only supported on iOS');
    return;
  }

  const module = getWidgetModule();
  if (!module) {
    const isExpoGo = Constants.appOwnership === 'expo';
    const errorMessage = isExpoGo
      ? 'Widgets are not supported in Expo Go. Please create a development build to test widgets.'
      : 'Widget module is not available';
    throw new Error(errorMessage);
  }

  try {
    const payload: WidgetEventPayload | null = event
      ? {
          id: event.id,
          title: event.title,
          emoji: event.emoji ?? '🕯️',
          dateTime: event.dateTime,
          mode: event.mode,
          format: event.format,
          mood: event.mood,
          createdAt: event.createdAt,
          progressEnabled: event.progressEnabled
        }
      : null;

    if (payload) {
      await module.setItemAsync(STORAGE_KEY, JSON.stringify(payload));
    } else {
      if (typeof module.deleteItemAsync === 'function') {
        await module.deleteItemAsync(STORAGE_KEY);
      } else {
        await module.setItemAsync(STORAGE_KEY, '');
      }
    }

    await module.updateTimelinesAsync({ kind: WIDGET_KIND });
  } catch (error) {
    console.error('Failed to sync widget:', error);
    throw new Error('Failed to update widget. Please try again.');
  }
};

export const autoSyncWidgetIfNeeded = async (
  event: CountdownEvent
): Promise<void> => {
  if (Platform.OS !== 'ios') {
    return;
  }

  try {
    const currentWidgetEventId = await getCurrentWidgetEventId();
    if (currentWidgetEventId === event.id) {
      await syncWidgetForEvent(event);
    }
  } catch (error) {
    console.error('Failed to auto-sync widget:', error);
    // Don't throw - this is a background operation
  }
};

export { WIDGET_KIND, STORAGE_KEY as WIDGET_STORAGE_KEY };
