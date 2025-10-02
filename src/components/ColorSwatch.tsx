// Circular swatch for choosing accent background colors.
import { Pressable, StyleSheet } from 'react-native';

interface ColorSwatchProps {
  color: string;
  active: boolean;
  onPress: () => void;
}

export const ColorSwatch = ({ color, active, onPress }: ColorSwatchProps) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={[styles.base, { backgroundColor: color }, active && styles.active]}
  />
);

const styles = StyleSheet.create({
  base: {
    width: 44,
    height: 44,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  active: {
    borderColor: '#EAF3F1',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  }
});

export default ColorSwatch;
