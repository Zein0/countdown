import { Platform, Alert } from 'react-native';
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
    console.log('[Widget] Returning cached module');
    return widgetModule;
  }

  try {
    console.log('[Widget] Attempting to load expo-widget module...');
    console.log('[Widget] Platform:', Platform.OS);
    console.log('[Widget] App ownership:', Constants.appOwnership);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const module = require('expo-widget') as WidgetModule;
    console.log('[Widget] Module loaded successfully');
    console.log('[Widget] Module keys:', Object.keys(module));
    console.log('[Widget] Module.setItemAsync type:', typeof module.setItemAsync);
    console.log('[Widget] Module.deleteItemAsync type:', typeof module.deleteItemAsync);
    console.log('[Widget] Module.updateTimelinesAsync type:', typeof module.updateTimelinesAsync);

    widgetModule = module;
    return widgetModule;
  } catch (error) {
    console.error('[Widget] Failed to load expo-widget module');
    console.error('[Widget] Error type:', typeof error);
    console.error('[Widget] Error:', error);
    if (error instanceof Error) {
      console.error('[Widget] Error name:', error.name);
      console.error('[Widget] Error message:', error.message);
      console.error('[Widget] Error stack:', error.stack);
    }
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
  console.log('[Widget] syncWidgetForEvent called with event:', event?.id);
  console.log('[Widget] Platform:', Platform.OS);
  console.log('[Widget] App ownership:', Constants.appOwnership);

  if (Platform.OS !== 'ios') {
    console.warn('[Widget] Widget sync is only supported on iOS');
    return;
  }

  const module = getWidgetModule();
  console.log('[Widget] Module retrieved:', module ? 'Available' : 'Not available');

  if (!module) {
    const isExpoGo = Constants.appOwnership === 'expo';
    const errorMessage = isExpoGo
      ? 'Widgets are not supported in Expo Go. Please create a development build to test widgets.'
      : 'Widget module is not available';
    console.error('[Widget] Module not available. Is Expo Go:', isExpoGo);
    Alert.alert('Debug Info', `Module: null, IsExpoGo: ${isExpoGo}, Platform: ${Platform.OS}`);
    throw new Error(errorMessage);
  }

  try {
    console.log('[Widget] Creating payload...');
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

    console.log('[Widget] Payload created:', payload);
    console.log('[Widget] Storage key:', STORAGE_KEY);
    console.log('[Widget] Widget kind:', WIDGET_KIND);

    if (payload) {
      console.log('[Widget] Calling setItemAsync...');
      await module.setItemAsync(STORAGE_KEY, JSON.stringify(payload));
      console.log('[Widget] setItemAsync completed');
    } else {
      console.log('[Widget] Deleting widget data...');
      if (typeof module.deleteItemAsync === 'function') {
        await module.deleteItemAsync(STORAGE_KEY);
      } else {
        await module.setItemAsync(STORAGE_KEY, '');
      }
      console.log('[Widget] Delete completed');
    }

    console.log('[Widget] Calling updateTimelinesAsync...');
    await module.updateTimelinesAsync({ kind: WIDGET_KIND });
    console.log('[Widget] updateTimelinesAsync completed');

    Alert.alert('Debug Success', `Widget updated successfully. Storage: ${STORAGE_KEY}, Kind: ${WIDGET_KIND}`);
  } catch (error) {
    console.error('[Widget] Error during sync:', error);
    console.error('[Widget] Error name:', (error as Error).name);
    console.error('[Widget] Error message:', (error as Error).message);
    console.error('[Widget] Error stack:', (error as Error).stack);

    Alert.alert('Debug Error', `${(error as Error).name}: ${(error as Error).message}`);
    throw new Error(`Failed to update widget: ${(error as Error).message}`);
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
