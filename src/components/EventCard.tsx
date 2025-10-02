// Home feed card summarising a countdown snapshot.
import { memo, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { CountdownEvent } from '@/store/eventStore';
import { calculateProgress, formatCountdownText } from '@/utils/time';

interface EventCardProps {
  event: CountdownEvent;
  index: number;
  onPress: () => void;
  onTogglePin: () => void;
}

const moodPalette: Record<string, string[]> = {
  Hopeful: ['#0B0C0F', '#1F3C3A'],
  Melancholy: ['#0B0C0F', '#2C2135'],
  Peaceful: ['#0B0C0F', '#1F2A3A'],
  Silent: ['#0B0C0F', '#1A1A1A']
};

export const EventCard = memo(({ event, index, onPress, onTogglePin }: EventCardProps) => {
  const gradient = event.backgroundColor
    ? [event.backgroundColor, '#0B0C0F']
    : moodPalette[event.mood] ?? moodPalette.Melancholy;

  const countdownText = useMemo(
    () => formatCountdownText(event, event.format),
    [event.dateTime, event.format, event.mode, event.createdAt]
  );
  const progress = calculateProgress(event);

  return (
    <Animated.View
      entering={FadeIn.delay(index * 80).duration(500)}
      exiting={FadeOut.duration(300)}
      style={styles.shadow}
    >
      <Pressable onPress={onPress} style={styles.pressable} accessibilityRole="button">
        <LinearGradient colors={gradient} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.headerRow}>
            <Text style={styles.emoji}>{event.emoji ?? '🕯️'}</Text>
            <Pressable accessibilityRole="button" onPress={onTogglePin} hitSlop={12}>
              <Text style={[styles.pin, event.pinned && styles.pinActive]}>{event.pinned ? 'Pinned' : 'Pin'}</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.countdown}>{countdownText}</Text>
          <View style={styles.progressWrapper}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, progress * 100))}%` }]} />
            </View>
            <Text style={styles.mood}>{event.mood}</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 28,
    overflow: 'hidden'
  },
  pressable: {
    borderRadius: 28
  },
  card: {
    padding: 24,
    borderRadius: 28,
    borderColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    backgroundColor: '#121317',
    gap: 12
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  emoji: {
    fontSize: 32
  },
  pin: {
    color: '#757986',
    fontSize: 13,
    letterSpacing: 1.2
  },
  pinActive: {
    color: '#B5F5EC'
  },
  title: {
    fontSize: 22,
    fontFamily: 'serif',
    color: '#F7F7F7'
  },
  countdown: {
    fontSize: 16,
    color: '#C1C5D0'
  },
  progressWrapper: {
    marginTop: 6,
    gap: 6
  },
  progressBar: {
    height: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#47C2B1'
  },
  mood: {
    fontSize: 12,
    color: '#8F95A5',
    letterSpacing: 2,
    textTransform: 'uppercase'
  }
});

export default EventCard;
