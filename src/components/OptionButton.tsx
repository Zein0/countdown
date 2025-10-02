// Generic pill-style option used for toggles like mode selection.
import { Pressable, StyleSheet, Text } from 'react-native';

interface OptionButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export const OptionButton = ({ label, active, onPress }: OptionButtonProps) => (
  <Pressable accessibilityRole="button" onPress={onPress} style={[styles.base, active && styles.active]}>
    <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#10141A'
  },
  active: {
    backgroundColor: '#1E4F4A',
    borderColor: '#3C7C72'
  },
  label: {
    color: '#A2ABB8',
    fontSize: 15
  },
  activeLabel: {
    color: '#EAF3F1',
    fontWeight: '600'
  }
});

export default OptionButton;
