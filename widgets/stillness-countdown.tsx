import React from 'react';
import { defineWidget } from 'expo-widget/defineWidget';
import { StyleSheet, Text, View } from 'react-native';
import { WIDGET_KIND, WIDGET_STORAGE_KEY } from '@/services/widgetService';

type StoredEvent = {
  id: string;
  title: string;
  emoji: string;
  dateTime: string;
  mode: 'countdown' | 'countup';
  format: 'relative' | 'precise' | 'seconds';
  mood: string;
  createdAt: string;
  progressEnabled: boolean;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const pad = (value: number) => value.toString().padStart(2, '0');

const buildCountdown = (event: StoredEvent, now: Date) => {
  const target = new Date(event.dateTime);
  const diff = Math.abs(target.getTime() - now.getTime());
  const direction = event.mode === 'countdown' && target.getTime() >= now.getTime() ? 'left' : 'since';

  if (event.format === 'seconds') {
    const totalSeconds = Math.floor(diff / SECOND);
    return `${totalSeconds.toLocaleString()} seconds ${direction}`;
  }

  const days = Math.floor(diff / DAY);
  const hours = Math.floor((diff % DAY) / HOUR);
  const minutes = Math.floor((diff % HOUR) / MINUTE);
  const seconds = Math.floor((diff % MINUTE) / SECOND);

  if (event.format === 'relative') {
    if (days) return `${days} day${days === 1 ? '' : 's'} ${direction}`;
    if (hours) return `${hours} hour${hours === 1 ? '' : 's'} ${direction}`;
    if (minutes) return `${minutes} minute${minutes === 1 ? '' : 's'} ${direction}`;
    return 'moments';
  }

  return `${days}d · ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s ${direction}`;
};

const calculateProgress = (event: StoredEvent, now: Date) => {
  if (!event.progressEnabled) return 0;
  const createdAt = new Date(event.createdAt);
  const target = new Date(event.dateTime);
  const total = target.getTime() - createdAt.getTime();
  if (total <= 0) return 0;
  const elapsed = Math.max(0, now.getTime() - createdAt.getTime());
  return Math.max(0, Math.min(1, elapsed / total));
};

const WidgetContent = ({ event }: { event: StoredEvent | null }) => {
  const now = new Date();

  if (!event) {
    return (
      <View style={[styles.container, styles.empty]}> 
        <Text style={styles.emptyTitle}>Stillness</Text>
        <Text style={styles.emptySubtitle}>Open the app to pin a moment.</Text>
      </View>
    );
  }

  const countdown = buildCountdown(event, now);
  const progress = calculateProgress(event, now);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{event.emoji}</Text>
      <Text style={styles.title} numberOfLines={1}>
        {event.title}
      </Text>
      <Text style={styles.countdown} numberOfLines={2}>
        {countdown}
      </Text>
      {event.progressEnabled && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
      )}
    </View>
  );
};

export default defineWidget(async (context) => {
  const stored = await context.getItemAsync?.(WIDGET_STORAGE_KEY);
  const event: StoredEvent | null = stored ? JSON.parse(stored) : null;

  // Generate timeline entries for the next 24 hours with updates every minute
  const now = new Date();
  const timeline = [];

  // Create timeline entries every minute for smoother updates
  for (let i = 0; i < 60; i++) {
    const entryDate = new Date(now.getTime() + i * 60 * 1000);
    timeline.push({
      date: entryDate,
      content: () => <WidgetContent event={event} />
    });
  }

  return {
    name: 'stillness-countdown',
    displayName: 'Stillness Countdown',
    description: 'Keep your quiet moment on the Home and Lock Screen.',
    kind: WIDGET_KIND,
    supportedFamilies: ['systemSmall', 'systemMedium'],
    timeline
  };
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10141A',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    gap: 8
  },
  emoji: {
    fontSize: 32
  },
  title: {
    color: '#F7F8FA',
    fontSize: 16,
    fontWeight: '600'
  },
  countdown: {
    color: '#C8D2E0',
    fontSize: 14
  },
  progressBar: {
    height: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#47C2B1'
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyTitle: {
    color: '#F7F8FA',
    fontSize: 18,
    fontWeight: '600'
  },
  emptySubtitle: {
    color: '#A5AEBC',
    fontSize: 13
  }
});
