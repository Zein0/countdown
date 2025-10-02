// Shared primary action button with optional leading/trailing adornments.
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, StyleProp } from 'react-native';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  leading?: ReactNode;
  trailing?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const PrimaryButton = ({ label, onPress, leading, trailing, disabled, style }: PrimaryButtonProps) => (
  <Pressable
    accessibilityRole="button"
    onPress={disabled ? undefined : onPress}
    style={({ pressed }) => [
      styles.container,
      style,
      pressed && !disabled ? styles.pressed : null,
      disabled ? styles.disabled : null
    ]}
  >
    {leading}
    <Text style={styles.label}>{label}</Text>
    {trailing}
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E4F4A',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8
  },
  pressed: {
    opacity: 0.85
  },
  disabled: {
    opacity: 0.5
  },
  label: {
    color: '#E4F2F0',
    fontSize: 18,
    fontWeight: '600'
  }
});

export default PrimaryButton;
