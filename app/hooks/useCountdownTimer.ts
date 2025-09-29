// useCountdownTimer creates a live-updating breakdown for the selected event.
import { useEffect, useMemo, useState } from 'react';
import { CountdownEvent } from '@/types';

const SECOND = 1000;

export function useCountdownTimer(event: CountdownEvent | null) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, SECOND);
    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    if (!event) {
      return {
        segments: '0 seconds',
        summary: '0 days',
        isFuture: false,
        now
      };
    }
    const target = new Date(event.date);
    const diff = target.getTime() - now.getTime();
    const absDiff = Math.abs(diff);
    const isFuture = diff >= 0;

    const days = Math.floor(absDiff / (SECOND * 60 * 60 * 24));
    const hours = Math.floor((absDiff / (SECOND * 60 * 60)) % 24);
    const minutes = Math.floor((absDiff / (SECOND * 60)) % 60);
    const seconds = Math.floor((absDiff / SECOND) % 60);

    const segments = [
      { value: days, label: 'day' },
      { value: hours, label: 'hour' },
      { value: minutes, label: 'minute' },
      { value: seconds, label: 'second' }
    ]
      .filter((segment) => segment.value > 0 || segment.label === 'second')
      .slice(0, 3)
      .map((segment) => `${segment.value} ${segment.label}${segment.value === 1 ? '' : 's'}`)
      .join(' ');

    const summary = event.mode === 'countup'
      ? `${days} day${days === 1 ? '' : 's'} since`
      : diff <= 0
        ? `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} since`
        : `${days} day${days === 1 ? '' : 's'} left`;

    return {
      segments,
      summary,
      isFuture,
      now
    };
  }, [event?.date, event?.mode, now]);
}
