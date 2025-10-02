// Time helpers for formatting countdown strings, progress, and notifications.
import { CountdownEvent, CountdownFormat } from '@/store/eventStore';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

const pad = (value: number) => value.toString().padStart(2, '0');

export const parseDate = (value: string) => new Date(value);

export const isFuture = (event: CountdownEvent, now = new Date()) =>
  parseDate(event.dateTime).getTime() >= now.getTime();

export const getTimeParts = (target: Date, now = new Date()) => {
  const diff = Math.abs(target.getTime() - now.getTime());

  const years = Math.floor(diff / YEAR);
  const months = Math.floor((diff % YEAR) / MONTH);
  const days = Math.floor((diff % MONTH) / DAY);
  const hours = Math.floor((diff % DAY) / HOUR);
  const minutes = Math.floor((diff % HOUR) / MINUTE);
  const seconds = Math.floor((diff % MINUTE) / SECOND);

  return { diff, years, months, days, hours, minutes, seconds };
};

const buildPreciseText = ({ years, months, days, hours, minutes, seconds }: ReturnType<typeof getTimeParts>) => {
  const segments = [
    years ? `${years} year${years === 1 ? '' : 's'}` : null,
    months ? `${months} month${months === 1 ? '' : 's'}` : null,
    days ? `${days} day${days === 1 ? '' : 's'}` : null,
    `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
  ].filter(Boolean);

  return segments.join(' · ');
};

const buildRelativeText = ({ years, months, days, hours, minutes }: ReturnType<typeof getTimeParts>) => {
  if (years) return `${years} year${years === 1 ? '' : 's'}`;
  if (months) return `${months} month${months === 1 ? '' : 's'}`;
  if (days) return `${days} day${days === 1 ? '' : 's'}`;
  if (hours) return `${hours} hour${hours === 1 ? '' : 's'}`;
  if (minutes) return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  return 'moments';
};

export const formatCountdownText = (event: CountdownEvent, format: CountdownFormat, now = new Date()) => {
  const target = parseDate(event.dateTime);
  const { diff, ...parts } = getTimeParts(target, now);
  const direction = event.mode === 'countdown' && target.getTime() >= now.getTime() ? 'left' : 'since';

  if (format === 'seconds') {
    const totalSeconds = Math.floor(diff / SECOND);
    return `${totalSeconds.toLocaleString()} seconds ${direction}`;
  }

  if (format === 'relative') {
    const text = buildRelativeText({ diff, ...parts });
    return `${text} ${direction}`;
  }

  const text = buildPreciseText({ diff, ...parts });
  return `${text} ${direction}`;
};

export const calculateProgress = (event: CountdownEvent, now = new Date()) => {
  if (typeof event.progressOverride === 'number') {
    return Math.max(0, Math.min(1, event.progressOverride));
  }

  const target = parseDate(event.dateTime);
  if (event.mode === 'countup' && target.getTime() <= now.getTime()) {
    return 1;
  }

  const total = target.getTime() - parseDate(event.createdAt).getTime();
  if (total <= 0) {
    return 0;
  }

  const elapsed = Math.max(0, now.getTime() - parseDate(event.createdAt).getTime());
  return Math.max(0, Math.min(1, elapsed / total));
};

export const buildNotificationLine = (event: CountdownEvent, now = new Date()) =>
  formatCountdownText(event, 'relative', now);
