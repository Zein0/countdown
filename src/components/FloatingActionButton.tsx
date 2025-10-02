// Floating action button used for composing a new countdown.
import { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface FloatingActionButtonProps {
  onPress?: () => void;
}

export const FloatingActionButton = forwardRef<View, FloatingActionButtonProps>(
  ({ onPress }, ref) => (
    <Pressable ref={ref} accessibilityRole="button" style={styles.button} onPress={onPress}>
      <Text style={styles.label}>＋</Text>
    </Pressable>
  )
);
FloatingActionButton.displayName = 'FloatingActionButton';

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 24,
    bottom: 36,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#184741',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8
  },
  label: {
    color: '#E1F7F3',
    fontSize: 34,
    fontWeight: '600'
  }
});

export default FloatingActionButton;
