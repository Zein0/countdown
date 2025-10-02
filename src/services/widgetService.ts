import { Platform } from 'react-native';
import type { CountdownEvent } from '@/store/eventStore';

type WidgetModule = typeof import('expo-widget');

const WIDGET_KIND = 'stillness.countdown';
const STORAGE_KEY = 'stillness.widget.event';

let widgetModule: WidgetModule | null = null;

const getWidgetModule = (): WidgetModule | null => {
  if (widgetModule !== null) {
    return widgetModule;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    widgetModule = require('expo-widget');
    return widgetModule;
  } catch (error) {
    widgetModule = null;
    return null;
  }
};

export const syncWidgetForEvent = async (event: CountdownEvent | null) => {
  if (Platform.OS !== 'ios') return;
  const module = getWidgetModule();
  if (!module) return;

  const payload = event
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
};

export { WIDGET_KIND, STORAGE_KEY as WIDGET_STORAGE_KEY };
