// Mood selector component used in the add event form.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Mood } from '../types';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';

interface Props {
  moods: Mood[];
  selected: Mood;
  onSelect: (mood: Mood) => void;
}

const moodLabels: Record<Mood, string> = {
  Hopeful: 'Hopeful',
  Melancholy: 'Melancholy',
  Peaceful: 'Peaceful',
  Silent: 'Silent'
};

export const MoodSelector: React.FC<Props> = ({ moods, selected, onSelect }) => (
  <View style={styles.container}>
    {(['Hopeful', 'Melancholy', 'Peaceful', 'Silent'] as Mood[]).map(mood => {
      const enabled = moods.includes(mood);
      const isActive = selected === mood;
      const backgroundColor = isActive ? palette.surfaceDark : 'transparent';
      const borderColor = enabled ? palette.accentMist : 'rgba(255,255,255,0.15)';
      const textColor = enabled ? palette.textPrimaryDark : palette.textSecondaryDark;
      return (
        <Pressable
          key={mood}
          disabled={!enabled}
          onPress={() => onSelect(mood)}
          style={[styles.pill, { borderColor, backgroundColor, opacity: enabled ? 1 : 0.4 }]}
        >
          <Text style={[styles.label, { color: textColor }]}>{moodLabels[mood]}</Text>
          {!enabled && <Text style={styles.locked}>Premium</Text>}
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  pill: {
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
    minWidth: '42%'
  },
  label: {
    ...typography.body,
    textAlign: 'center'
  },
  locked: {
    marginTop: 4,
    fontSize: 10,
    color: palette.textSecondaryDark,
    textAlign: 'center'
  }
});
