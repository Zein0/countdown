// Card used on the home screen to present a single countdown in the list.
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CountdownEvent } from '../types';
import { getCountdownText, getProgressToEvent } from '../utils/time';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';

interface Props {
  event: CountdownEvent;
  onPress: () => void;
}

export const EventCard: React.FC<Props> = ({ event, onPress }) => {
  const progress = getProgressToEvent(event.createdAt, event.date, event.mode);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true
    }).start();
  }, [fadeAnim]);

  const moodAccent = event.mood === 'Hopeful'
    ? palette.accentEmerald
    : event.mood === 'Melancholy'
      ? palette.accentMist
      : event.mood === 'Peaceful'
        ? palette.accentGold
        : palette.accentMist;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}> 
      <Pressable style={styles.pressable} onPress={onPress} android_ripple={{ color: 'rgba(255,255,255,0.05)' }}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: palette.textPrimaryDark }]} numberOfLines={1}>
              {event.title}
            </Text>
            {event.pinned && <Text style={styles.pinned}>Pinned</Text>}
          </View>
          <Text style={[styles.countdown, { color: moodAccent }]}>{getCountdownText(event.date, event.mode)}</Text>
        </View>
        <View style={styles.progressBar}> 
          <LinearGradient
            colors={[moodAccent, 'rgba(255,255,255,0.05)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFill, { width: `${Math.max(progress * 100, 2)}%`, borderRadius: 6 }]}
          />
        </View>
        {event.quote ? (
          <Text style={styles.quote} numberOfLines={2}>
            “{event.quote}”
          </Text>
        ) : null}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surfaceDark,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4
  },
  pressable: {
    gap: 16
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12
  },
  title: {
    ...typography.titleSerif
  },
  pinned: {
    marginTop: 4,
    fontSize: 12,
    letterSpacing: 1,
    color: palette.textSecondaryDark,
    textTransform: 'uppercase'
  },
  countdown: {
    fontFamily: 'System',
    fontSize: 16,
    textAlign: 'right'
  },
  progressBar: {
    height: 8,
    backgroundColor: palette.divider,
    borderRadius: 6,
    overflow: 'hidden'
  },
  quote: {
    ...typography.body,
    color: palette.textSecondaryDark,
    fontStyle: 'italic'
  }
});
