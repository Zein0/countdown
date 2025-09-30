// Screen containing the form for creating or editing a countdown event.
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BackgroundSelector } from '../components/BackgroundSelector';
import { MoodSelector } from '../components/MoodSelector';
import { useApp, usePremiumUnlocked } from '../context/AppContext';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { EventBackground, EventMode, Mood } from '../types';
import { RootStackParamList } from '../navigation/types';

export type AddEventScreenProps = NativeStackScreenProps<RootStackParamList, 'AddEvent'>;

export const AddEventScreen: React.FC<AddEventScreenProps> = ({ navigation, route }) => {
  const { event } = route.params ?? {};
  const { addEvent, updateEvent, availableMoods } = useApp();
  const premiumUnlocked = usePremiumUnlocked();
  const [title, setTitle] = useState(event?.title ?? '');
  const [quote, setQuote] = useState(event?.quote ?? '');
  const [date, setDate] = useState(() => (event ? new Date(event.date) : new Date()));
  const [mode, setMode] = useState<EventMode>(event?.mode ?? 'countdown');
  const [mood, setMood] = useState<Mood>(event?.mood ?? availableMoods[0]);
  const [background, setBackground] = useState<EventBackground | undefined>(event?.background);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const canUseImages = premiumUnlocked;

  useEffect(() => {
    if (!availableMoods.includes(mood)) {
      setMood(availableMoods[0]);
    }
  }, [availableMoods, mood]);

  const titleLabel = useMemo(() => (event ? 'Update Countdown' : 'New Countdown'), [event]);

  const onChangeDate = (_: DateTimePickerEvent, selected?: Date) => {
    if (selected) {
      setDate(selected);
    }
    setShowDatePicker(false);
  };

  const onChangeTime = (_: DateTimePickerEvent, selected?: Date) => {
    if (selected) {
      const newDate = new Date(date);
      newDate.setHours(selected.getHours());
      newDate.setMinutes(selected.getMinutes());
      setDate(newDate);
    }
    setShowTimePicker(false);
  };

  const handleSelectImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission required', 'Allow photo access to set a background image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled && result.assets?.length) {
      setBackground({ type: 'image', value: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Title missing', 'Name this moment so it can be remembered.');
      return;
    }
    const payload = {
      title: title.trim(),
      quote: quote.trim() ? quote.trim() : undefined,
      date: date.toISOString(),
      mode,
      mood,
      background
    };
    if (event) {
      await updateEvent(event.id, { ...payload, createdAt: event.createdAt });
    } else {
      await addEvent(payload);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>{titleLabel}</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="A birth, a goodbye, a quiet change..."
            placeholderTextColor={'rgba(255,255,255,0.3)'}
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <View style={styles.inlineRow}>
          <View style={[styles.field, styles.inlineItem]}>
            <Text style={styles.label}>Date</Text>
            <Pressable style={styles.selector} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.selectorText}>{date.toDateString()}</Text>
            </Pressable>
          </View>
          <View style={[styles.field, styles.inlineItem]}>
            <Text style={styles.label}>Time</Text>
            <Pressable style={styles.selector} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.selectorText}>
                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </Pressable>
          </View>
        </View>
        {(showDatePicker || showTimePicker) && (
          <DateTimePicker
            value={date}
            mode={showDatePicker ? 'date' : 'time'}
            onChange={showDatePicker ? onChangeDate : onChangeTime}
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
          />
        )}
        <View style={styles.field}>
          <Text style={styles.label}>Mode</Text>
          <View style={styles.modeRow}>
            {(['countdown', 'countup'] as EventMode[]).map(option => (
              <Pressable
                key={option}
                style={[styles.modeButton, mode === option && styles.modeButtonActive]}
                onPress={() => setMode(option)}
              >
                <Text style={[styles.modeText, mode === option && styles.modeTextActive]}>
                  {option === 'countdown' ? 'Counting down' : 'Counting up'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Quote (optional)</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Words that stay with you"
            placeholderTextColor={'rgba(255,255,255,0.3)'}
            value={quote}
            onChangeText={setQuote}
            multiline
            numberOfLines={3}
          />
        </View>
        <BackgroundSelector
          value={background}
          onSelectColor={color => setBackground({ type: 'color', value: color })}
          onSelectImage={canUseImages ? handleSelectImage : undefined}
          canUseImages={canUseImages}
        />
        <View style={styles.field}>
          <Text style={styles.label}>Mood</Text>
          <MoodSelector moods={availableMoods} selected={mood} onSelect={setMood} />
        </View>
        <Pressable style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>{event ? 'Save changes' : 'Save countdown'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.backgroundDark
  },
  container: {
    padding: 24,
    paddingBottom: 120,
    gap: 24
  },
  heading: {
    ...typography.headlineSerif,
    color: palette.textPrimaryDark
  },
  field: {
    gap: 12
  },
  label: {
    color: palette.textSecondaryDark,
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  input: {
    backgroundColor: palette.surfaceDark,
    borderRadius: 16,
    padding: 16,
    color: palette.textPrimaryDark,
    ...typography.body
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top'
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 12
  },
  inlineItem: {
    flex: 1
  },
  selector: {
    backgroundColor: palette.surfaceDark,
    borderRadius: 16,
    padding: 16
  },
  selectorText: {
    color: palette.textPrimaryDark
  },
  modeRow: {
    flexDirection: 'row',
    gap: 12
  },
  modeButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: palette.surfaceDark
  },
  modeButtonActive: {
    backgroundColor: '#242933'
  },
  modeText: {
    textAlign: 'center',
    color: palette.textSecondaryDark
  },
  modeTextActive: {
    color: palette.textPrimaryDark,
    fontWeight: '600'
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: palette.accentMist,
    borderRadius: 18,
    paddingVertical: 18
  },
  saveButtonText: {
    textAlign: 'center',
    color: palette.backgroundDark,
    fontSize: 16,
    letterSpacing: 1.2
  }
});
