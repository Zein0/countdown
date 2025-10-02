import { useState } from 'react';
import { useRouter } from 'expo-router';
import { nanoid } from 'nanoid/non-secure';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import TextField from '@/components/TextField';
import MoodSelector from '@/components/MoodSelector';
import FormatSelector from '@/components/FormatSelector';
import PrimaryButton from '@/components/PrimaryButton';
import { CountdownEvent, CountdownFormat, CountdownMode, Mood, useEventStore } from '@/store/eventStore';
import { useSettingsStore } from '@/store/settingsStore';
import { scheduleEventNotifications } from '@/services/notificationService';
import OptionButton from '@/components/OptionButton';
import ColorSwatch from '@/components/ColorSwatch';

const backgroundColors = ['#1F3C3A', '#2C2135', '#1F2A3A', '#1A1A1A', '#3D2F2F'];

export default function AddEventScreen() {
  const router = useRouter();
  const addEvent = useEventStore((state) => state.addEvent);
  const notifications = useSettingsStore((state) => state.notifications);
  const premiumUnlocked = useSettingsStore((state) => state.premiumUnlocked);

  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('🕯️');
  const [mode, setMode] = useState<CountdownMode>('countdown');
  const [quote, setQuote] = useState('');
  const [mood, setMood] = useState<Mood>('Hopeful');
  const [backgroundColor, setBackgroundColor] = useState<string | undefined>();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [format, setFormat] = useState<CountdownFormat>('precise');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(() => new Date());
  const [progress, setProgress] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const onChangeDate = (_event: DateTimePickerEvent, value?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (value) {
      setDate(value);
    }
  };

  const disabledMoods = premiumUnlocked ? [] : ['Peaceful', 'Silent'];

  const handleSave = async () => {
    if (!title.trim()) return;

    const numericProgress = Number(progress);
    const progressValue = progress && !Number.isNaN(numericProgress)
      ? Math.min(1, Math.max(0, numericProgress / 100))
      : undefined;

    const premiumFeatureUsed = Boolean(backgroundImage) || mood === 'Peaceful' || mood === 'Silent';

    const event: CountdownEvent = {
      id: nanoid(),
      title: title.trim(),
      emoji: emoji.trim() || undefined,
      dateTime: date.toISOString(),
      mode,
      quote: quote.trim() || undefined,
      mood,
      pinned: false,
      backgroundColor,
      backgroundImage,
      format,
      createdAt: new Date().toISOString(),
      progressOverride: progressValue,
      premiumFeatureUsed,
      notificationIds: []
    };

    if (!premiumUnlocked && premiumFeatureUsed) {
      Alert.alert('Premium required', 'Unlock Premium to use this mood or background.');
      setSaving(false);
      return;
    }

    try {
      setSaving(true);
      const ids = await scheduleEventNotifications(event, notifications);
      addEvent({ ...event, notificationIds: ids });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const premiumNotice = !premiumUnlocked && (mood === 'Peaceful' || mood === 'Silent' || backgroundImage);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Name the moment</Text>
        <TextField label="Title" value={title} onChangeText={setTitle} placeholder="When we met" />
        <TextField label="Emoji" value={emoji} onChangeText={setEmoji} maxLength={2} />
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Mode</Text>
          <View style={styles.modeRow}>
            {(['countdown', 'countup'] as CountdownMode[]).map((item) => (
              <OptionButton
                key={item}
                label={item === 'countdown' ? 'Countdown' : 'Count Up'}
                active={mode === item}
                onPress={() => setMode(item)}
              />
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Date & time</Text>
          <PrimaryButton label={date.toLocaleString()} onPress={() => setShowDatePicker(true)} />
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              onChange={onChangeDate}
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
            />
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Format</Text>
          <FormatSelector value={format} onChange={setFormat} />
        </View>
        <TextField
          label="Progress (%)"
          value={progress}
          onChangeText={setProgress}
          keyboardType="numeric"
          placeholder="Optional"
        />
        <TextField label="Quote" value={quote} onChangeText={setQuote} placeholder="Time moves quietly." />
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Mood</Text>
          <MoodSelector value={mood} onChange={setMood} disabledMoods={disabledMoods} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Background color</Text>
          <View style={styles.colorRow}>
            {backgroundColors.map((color) => (
              <ColorSwatch
                key={color}
                color={color}
                active={backgroundColor === color}
                onPress={() => setBackgroundColor(color)}
              />
            ))}
            <OptionButton label="Clear" active={!backgroundColor} onPress={() => setBackgroundColor(undefined)} />
          </View>
        </View>
        {!premiumUnlocked && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Custom background image</Text>
            <Text style={styles.helper}>Unlock Premium to set a custom image and serene soundscapes.</Text>
          </View>
        )}
        {premiumNotice && <Text style={styles.premiumWarning}>Premium unlock required for selected mood or image.</Text>}
        <PrimaryButton label={saving ? 'Saving...' : 'Save'} onPress={handleSave} disabled={saving || !title} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#050608'
  },
  container: {
    padding: 24,
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
    gap: 12
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  helper: {
    color: '#6F7A8C',
    fontSize: 14
  },
  premiumWarning: {
    color: '#E4B87A',
    fontSize: 14,
    lineHeight: 20
  }
});
