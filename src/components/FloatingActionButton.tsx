// Minimal floating action button used for adding new events.
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { palette } from '../theme/colors';

interface Props {
  onPress: () => void;
}

export const FloatingActionButton: React.FC<Props> = ({ onPress }) => (
  <Pressable style={styles.button} onPress={onPress} android_ripple={{ color: 'rgba(0,0,0,0.2)', borderless: true }}>
    <Text style={styles.label}>＋</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: palette.accentMist,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 16,
    elevation: 6
  },
  label: {
    color: palette.backgroundDark,
    fontSize: 36,
    fontWeight: '600'
  }
});
