import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import TextField from '@/components/TextField';
import MoodSelector from '@/components/MoodSelector';
import FormatSelector from '@/components/FormatSelector';
import PrimaryButton from '@/components/PrimaryButton';
import OptionButton from '@/components/OptionButton';
import ColorSwatch from '@/components/ColorSwatch';
import { CountdownFormat, CountdownMode, Mood } from '@/store/eventStore';
import { useSettingsStore } from '@/store/settingsStore';

const backgroundColors = ['#1F3C3A', '#2C2135', '#1F2A3A', '#1A1A1A', '#3D2F2F'];

export interface EventFormState {
  title: string;
  emoji?: string;
  dateTime: Date;
  mode: CountdownMode;
  quote?: string;
  mood: Mood;
  backgroundColor?: string;
  backgroundImage?: string | null;
  format: CountdownFormat;
  progressEnabled: boolean;
}

interface EventFormProps {
  initialState?: Partial<EventFormState>;
  onSubmit: (draft: EventFormState) => Promise<void> | void;
  submitting?: boolean;
  submitLabel?: string;
  onDelete?: (() => Promise<void> | void) | null;
  deleteLabel?: string;
  deleteDisabled?: boolean;
}

const defaultState: EventFormState = {
  title: '',
  emoji: '🕯️',
  dateTime: new Date(),
  mode: 'countdown',
  quote: '',
  mood: 'Hopeful',
  backgroundColor: undefined,
  backgroundImage: null,
  format: 'precise',
  progressEnabled: true
};

export const EventForm = ({
  initialState,
  onSubmit,
  submitting,
  submitLabel = 'Save',
  onDelete,
  deleteLabel = 'Delete',
  deleteDisabled
}: EventFormProps) => {
  const [state, setState] = useState<EventFormState>({ ...defaultState, ...initialState });
  const [showPicker, setShowPicker] = useState(false);
  const premiumUnlocked = useSettingsStore((form) => form.premiumUnlocked);

  useEffect(() => {
    setState({ ...defaultState, ...initialState });
    setShowPicker(false);
  }, [initialState?.title, initialState?.emoji, initialState?.dateTime?.getTime(), initialState?.mode, initialState?.quote, initialState?.mood, initialState?.backgroundColor, initialState?.backgroundImage, initialState?.format, initialState?.progressEnabled]);

  const disabledMoods = premiumUnlocked ? [] : ['Peaceful', 'Silent'];
  const premiumFeatureUsed = useMemo(
    () =>
      state.backgroundImage != null ||
      state.mood === 'Peaceful' ||
      state.mood === 'Silent',
    [state.backgroundImage, state.mood]
  );

  const handleDateChange = (_event: DateTimePickerEvent, value?: Date) => {
    if (!value) return;
    setState((prev) => ({ ...prev, dateTime: value }));
  };

  const openAndroidPicker = () => {
    DateTimePickerAndroid.open({
      mode: 'date',
      value: state.dateTime,
      onChange: (event, selectedDate) => {
        if (event.type !== 'set' || !selectedDate) return;

        const currentDate = new Date(selectedDate);

        DateTimePickerAndroid.open({
          mode: 'time',
          value: currentDate,
          onChange: (timeEvent, selectedTime) => {
            if (timeEvent.type !== 'set' || !selectedTime) return;

            const finalDate = new Date(currentDate);
            finalDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
            setState((prev) => ({ ...prev, dateTime: finalDate }));
          }
        });
      }
    });
  };

  const handleSubmit = async () => {
    if (!state.title.trim()) {
      Alert.alert('Title required', 'Name the moment before saving.');
      return;
    }

    if (!premiumUnlocked && premiumFeatureUsed) {
      Alert.alert('Premium required', 'Unlock Premium to use this mood or background.');
      return;
    }

    await onSubmit({ ...state, title: state.title.trim(), emoji: state.emoji?.trim() || '🕯️', quote: state.quote?.trim() || '' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Name the moment</Text>
      <TextField label="Title" value={state.title} onChangeText={(title) => setState((prev) => ({ ...prev, title }))} placeholder="When we met" />
      <TextField label="Emoji" value={state.emoji ?? ''} onChangeText={(emoji) => setState((prev) => ({ ...prev, emoji }))} maxLength={2} />
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Mode</Text>
        <View style={styles.modeRow}>
          {(['countdown', 'countup'] as CountdownMode[]).map((item) => (
            <OptionButton key={item} label={item === 'countdown' ? 'Countdown' : 'Count Up'} active={state.mode === item} onPress={() => setState((prev) => ({ ...prev, mode: item }))} />
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Date & time</Text>
        <PrimaryButton
          label={state.dateTime.toLocaleString()}
          onPress={() => {
            if (Platform.OS === 'android') {
              openAndroidPicker();
              return;
            }
            setShowPicker((prev) => !prev);
          }}
        />
        {Platform.OS === 'ios' && showPicker && (
          <DateTimePicker value={state.dateTime} mode="datetime" onChange={handleDateChange} display={Platform.OS === 'ios' ? 'inline' : 'default'} />
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Format</Text>
        <FormatSelector value={state.format} onChange={(format) => setState((prev) => ({ ...prev, format }))} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Progress</Text>
        <View style={styles.modeRow}>
          <OptionButton label="Visible" active={state.progressEnabled} onPress={() => setState((prev) => ({ ...prev, progressEnabled: true }))} />
          <OptionButton label="Hidden" active={!state.progressEnabled} onPress={() => setState((prev) => ({ ...prev, progressEnabled: false }))} />
        </View>
        <Text style={styles.helper}>Progress fills based on time between the day you added this moment and the target date.</Text>
      </View>
      <TextField label="Quote" value={state.quote ?? ''} onChangeText={(quote) => setState((prev) => ({ ...prev, quote }))} placeholder="Time moves quietly." />
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Mood</Text>
        <MoodSelector value={state.mood} onChange={(mood) => setState((prev) => ({ ...prev, mood }))} disabledMoods={disabledMoods} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Background color</Text>
        <View style={styles.colorRow}>
          {backgroundColors.map((color) => (
            <ColorSwatch key={color} color={color} active={state.backgroundColor === color} onPress={() => setState((prev) => ({ ...prev, backgroundColor: color }))} />
          ))}
          <OptionButton label="Clear" active={!state.backgroundColor} onPress={() => setState((prev) => ({ ...prev, backgroundColor: undefined }))} />
        </View>
      </View>
      {!premiumUnlocked && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Custom background image</Text>
          <Text style={styles.helper}>Unlock Premium to set a custom image and serene soundscapes.</Text>
        </View>
      )}
      {!premiumUnlocked && premiumFeatureUsed && (
        <Text style={styles.premiumWarning}>Premium unlock required for selected mood or image.</Text>
      )}
      <PrimaryButton
        label={submitting ? 'Saving…' : submitLabel}
        onPress={handleSubmit}
        disabled={submitting || !state.title.trim()}
      />
      {onDelete && (
        <PrimaryButton
          label={deleteLabel}
          onPress={() => {
            Alert.alert('Delete this moment?', 'This action cannot be undone.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => onDelete()?.catch(() => undefined) }
            ]);
          }}
          style={styles.deleteButton}
          disabled={Boolean(deleteDisabled)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24
  },
  heading: {
    color: '#EAF3F1',
    fontSize: 32,
    fontWeight: '600'
  },
  section: {
    gap: 12
  },
  sectionLabel: {
    color: '#8B919F',
    fontSize: 14,
    letterSpacing: 1.1,
    textTransform: 'uppercase'
  },
  modeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  helper: {
    color: '#6F7A8C',
    fontSize: 14,
    lineHeight: 20
  },
  premiumWarning: {
    color: '#E4B87A',
    fontSize: 14,
    lineHeight: 20
  },
  deleteButton: {
    backgroundColor: 'rgba(212,64,64,0.22)',
    borderColor: 'rgba(212,64,64,0.4)'
  }
});

export default EventForm;
