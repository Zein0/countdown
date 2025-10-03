import { Platform } from 'react-native';
import type { CountdownEvent } from '@/store/eventStore';

type WidgetModule = typeof import('expo-widget');

const WIDGET_KIND = 'stillness.countdown';
const STORAGE_KEY = 'stillness.widget.event';

type WidgetModuleErrorReason = 'platform' | 'module' | 'native' | 'error';

type WidgetModuleSuccess = {
  ok: true;
  module: ExtendedWidgetModule;
};

type WidgetModuleFailure = {
  ok: false;
  reason: WidgetModuleErrorReason;
  message?: string;
};

export type WidgetSyncResult = WidgetModuleSuccess | WidgetModuleFailure;

type WidgetPreparationResult =
  | {
      ok: true;
      presented: boolean;
    }
  | WidgetModuleFailure;

type WidgetPresenter = (options: { kind: string }) => Promise<boolean | void>;

type ExtendedWidgetModule = WidgetModule & {
  isWidgetAvailableAsync?: () => Promise<boolean>;
  requestWidgetConfigurationAsync?: WidgetPresenter;
  presentWidgetGalleryAsync?: WidgetPresenter;
  showAddWidgetSheetAsync?: WidgetPresenter;
  openWidgetGalleryAsync?: WidgetPresenter;
};

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

const ensureWidgetModule = async (): Promise<WidgetSyncResult> => {
  if (Platform.OS !== 'ios') {
    return { ok: false, reason: 'platform' };
  }

  const module = getWidgetModule();
  if (!module) {
    return { ok: false, reason: 'module' };
  }

  const extended = module as ExtendedWidgetModule;

  if (typeof extended.isWidgetAvailableAsync === 'function') {
    try {
      const available = await extended.isWidgetAvailableAsync();
      if (!available) {
        return { ok: false, reason: 'native' };
      }
    } catch (error) {
      return normalizeWidgetError(error);
    }
  }

  return { ok: true, module: extended };
};

const normalizeWidgetError = (error: unknown): WidgetModuleFailure => {
  if (error instanceof Error) {
    if (error.message.includes('ExpoWidgets')) {
      return { ok: false, reason: 'native', message: error.message };
    }
    return { ok: false, reason: 'error', message: error.message };
  }
  return { ok: false, reason: 'error', message: String(error) };
};

const persistWidgetPayload = async (module: ExtendedWidgetModule, event: CountdownEvent | null) => {
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
    return;
  }

  if (typeof module.deleteItemAsync === 'function') {
    await module.deleteItemAsync(STORAGE_KEY);
  } else {
    await module.setItemAsync(STORAGE_KEY, '');
  }
};

const presentWidgetSheet = async (module: ExtendedWidgetModule): Promise<WidgetPreparationResult> => {
  const presenters: WidgetPresenter[] = [];

  if (typeof module.requestWidgetConfigurationAsync === 'function') {
    presenters.push(module.requestWidgetConfigurationAsync.bind(module));
  }
  if (typeof module.presentWidgetGalleryAsync === 'function') {
    presenters.push(module.presentWidgetGalleryAsync.bind(module));
  }
  if (typeof module.showAddWidgetSheetAsync === 'function') {
    presenters.push(module.showAddWidgetSheetAsync.bind(module));
  }
  if (typeof module.openWidgetGalleryAsync === 'function') {
    presenters.push(module.openWidgetGalleryAsync.bind(module));
  }

  for (const present of presenters) {
    try {
      const result = await present({ kind: WIDGET_KIND });
      if (result === undefined || result === null || result === true) {
        return { ok: true, presented: true };
      }
    } catch (error) {
      return normalizeWidgetError(error);
    }
  }

  return { ok: true, presented: false };
};

export const syncWidgetForEvent = async (event: CountdownEvent | null): Promise<WidgetSyncResult> => {
  const status = await ensureWidgetModule();
  if (!status.ok) {
    return status;
  }

  try {
    await persistWidgetPayload(status.module, event);
    await status.module.updateTimelinesAsync({ kind: WIDGET_KIND });
    return status;
  } catch (error) {
    return normalizeWidgetError(error);
  }
};

export const prepareAndPresentWidget = async (event: CountdownEvent | null): Promise<WidgetPreparationResult> => {
  const syncResult = await syncWidgetForEvent(event);
  if (!syncResult.ok) {
    return syncResult;
  }

  return presentWidgetSheet(syncResult.module);
};

export { WIDGET_KIND, STORAGE_KEY as WIDGET_STORAGE_KEY };
