// Mood selector chips highlighting available ambience choices.
import { Mood } from '@/store/eventStore';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface MoodSelectorProps {
  value: Mood;
  onChange: (mood: Mood) => void;
  disabledMoods?: Mood[];
}

const moods: Mood[] = ['Hopeful', 'Melancholy', 'Peaceful', 'Silent'];

export const MoodSelector = ({ value, onChange, disabledMoods = [] }: MoodSelectorProps) => (
  <View style={styles.container}>
    {moods.map((mood) => {
      const disabled = disabledMoods.includes(mood);
      return (
        <Pressable
          key={mood}
          onPress={() => (disabled ? undefined : onChange(mood))}
          style={[styles.pill, value === mood && styles.active, disabled && styles.disabled]}
        >
          <Text style={[styles.label, value === mood && styles.activeLabel]}>{mood}</Text>
          {disabled && <Text style={styles.locked}>Premium</Text>}
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#171A1F',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center'
  },
  active: {
    backgroundColor: '#1E4F4A',
    borderColor: '#3C7C72'
  },
  disabled: {
    opacity: 0.4
  },
  label: {
    color: '#B7BDC9',
    fontSize: 14
  },
  activeLabel: {
    color: '#E6F6F2'
  },
  locked: {
    color: '#84929F',
    fontSize: 10,
    marginTop: 4,
    letterSpacing: 1,
    textTransform: 'uppercase'
  }
});

export default MoodSelector;
