// App configuration constants

export const WIDGET_CONFIG = {
  KIND: 'stillness.countdown',
  STORAGE_KEY: 'stillness.widget.event',
  TIMELINE_ENTRIES: 60, // Number of timeline entries to generate (minutes)
  TIMELINE_INTERVAL: 60 * 1000 // 1 minute in milliseconds
} as const;

export const NOTIFICATION_CONFIG = {
  IOS_LIMIT: 64,
  MAX_PER_EVENT: 3,
  DEFAULT_HOUR: 9,
  DEFAULT_MINUTE: 0
} as const;

export const PERFORMANCE_CONFIG = {
  FLATLIST_MAX_TO_RENDER: 10,
  FLATLIST_UPDATE_CELLS_PERIOD: 50,
  FLATLIST_WINDOW_SIZE: 10,
  COUNTDOWN_UPDATE_INTERVAL: 1000 // 1 second
} as const;

export const STORAGE_CONFIG = {
  EVENTS_KEY: 'countdown-events',
  SETTINGS_KEY: 'countdown-settings',
  VERSION: 1
} as const;

export const PREMIUM_MOODS = ['Peaceful', 'Silent'] as const;
export const FREE_MOODS = ['Hopeful', 'Melancholy'] as const;
export const ALL_MOODS = [...FREE_MOODS, ...PREMIUM_MOODS] as const;

export const COUNTDOWN_FORMATS = ['relative', 'precise', 'seconds'] as const;
export const COUNTDOWN_MODES = ['countdown', 'countup'] as const;

export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000
} as const;
