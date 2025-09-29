// CountdownCard renders a compact preview of a countdown in the list.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import { CountdownEvent } from '@/types';
import { palette, moodPalette } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';

interface CountdownCardProps {
  event: CountdownEvent;
  onPress: () => void;
  onLongPress?: () => void;
}

export const CountdownCard: React.FC<CountdownCardProps> = ({ event, onPress, onLongPress }) => {
  const { summary } = useCountdownTimer(event);
  const accent = event.backgroundColor || moodPalette[event.mood] || palette.accentEmerald;

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(18)}
      exiting={FadeOut.duration(200)}
      style={[styles.container, { borderColor: accent }]}
    >
      <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.pressable}>
        <View style={styles.headerRow}>
          <View style={[styles.pill, { backgroundColor: `${accent}22` }]}
          >
            <Text style={[styles.title, { color: accent }]} numberOfLines={1}>
              {event.title}
            </Text>
          </View>
          {event.pinned && <Text style={styles.pin}>PINNED</Text>}
        </View>
        <Text style={styles.summary}>{summary}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16
  },
  pressable: {
    gap: 12
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
    maxWidth: '70%'
  },
  title: {
    ...typography.headlineSerif,
    color: palette.textPrimary
  },
  summary: {
    ...typography.body,
    fontSize: 18,
    color: palette.textSecondary
  },
  pin: {
    ...typography.caption,
    color: palette.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase'
  }
});
