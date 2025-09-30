// Utilities for formatting countdown text and calculating progress toward an event.
import { differenceInDays, differenceInHours, differenceInMinutes, formatDistanceToNowStrict, isPast } from 'date-fns';
import { EventMode } from '../types';

export const getCountdownText = (date: string, mode: EventMode): string => {
  const target = new Date(date);
  if (mode === 'countup') {
    const distance = formatDistanceToNowStrict(target, { addSuffix: false });
    return `${distance} since`;
  }

  if (isPast(target)) {
    const distance = formatDistanceToNowStrict(target, { addSuffix: false });
    return `${distance} ago`;
  }

  const distance = formatDistanceToNowStrict(target, { addSuffix: false });
  return `${distance} left`;
};

export const getProgressToEvent = (createdAt: string, date: string, mode: EventMode): number => {
  if (mode === 'countup') {
    return 1; // Count ups are always considered complete in terms of progress bar.
  }

  const created = new Date(createdAt);
  const target = new Date(date);
  const now = new Date();
  if (target.getTime() <= created.getTime()) {
    return 1;
  }
  const totalDuration = target.getTime() - created.getTime();
  const elapsed = Math.min(Math.max(now.getTime() - created.getTime(), 0), totalDuration);
  return elapsed / totalDuration;
};

export const describeTimeDelta = (date: string, mode: EventMode): string => {
  const target = new Date(date);
  const now = new Date();
  if (mode === 'countup') {
    const days = Math.abs(differenceInDays(now, target));
    return days === 0 ? 'Today' : `${days} day${days === 1 ? '' : 's'} since`;
  }
  const minutes = differenceInMinutes(target, now);
  if (minutes <= 0) {
    const hours = Math.abs(differenceInHours(now, target));
    return hours <= 24 ? 'Moments ago' : `${Math.abs(differenceInDays(now, target))} days ago`;
  }
  const hours = Math.ceil(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} left`;
  }
  const days = Math.ceil(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} left`;
};
