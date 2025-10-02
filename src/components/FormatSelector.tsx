// Format selector toggles between relative, detailed, or seconds renderings.
import { CountdownFormat } from '@/store/eventStore';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface FormatSelectorProps {
  value: CountdownFormat;
  onChange: (format: CountdownFormat) => void;
}

const formats: { label: string; value: CountdownFormat }[] = [
  { label: 'Relative', value: 'relative' },
  { label: 'Detailed', value: 'precise' },
  { label: 'Seconds', value: 'seconds' }
];

export const FormatSelector = ({ value, onChange }: FormatSelectorProps) => (
  <View style={styles.container}>
    {formats.map((option) => (
      <Pressable
        key={option.value}
        onPress={() => onChange(option.value)}
        style={[styles.item, value === option.value && styles.active]}
      >
        <Text style={[styles.label, value === option.value && styles.activeLabel]}>{option.label}</Text>
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 18,
    backgroundColor: '#121317',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden'
  },
  item: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center'
  },
  active: {
    backgroundColor: '#1A3C38'
  },
  label: {
    color: '#8B909F',
    fontSize: 14
  },
  activeLabel: {
    color: '#E0F4EF',
    fontWeight: '600'
  }
});

export default FormatSelector;
