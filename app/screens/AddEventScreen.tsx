// AddEventScreen allows users to craft a new countdown or count-up memory with moods.
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { palette, moodPalette } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { CountdownMode, Mood } from '@/types';
import { useCountdowns } from '@/context/CountdownContext';

const moods: Mood[] = ['Hopeful', 'Melancholy', 'Peaceful', 'Silent'];

type Props = NativeStackScreenProps<RootStackParamList, 'AddEvent'>;

const AddEventScreen: React.FC<Props> = ({ navigation }) => {
  const { addEvent, settings } = useCountdowns();
  const [title, setTitle] = useState('');
  const [quote, setQuote] = useState('');
  const [mode, setMode] = useState<CountdownMode>('countdown');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mood, setMood] = useState<Mood>('Hopeful');
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  const [backgroundImageUri, setBackgroundImageUri] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const availableMoods = useMemo(() => {
    if (settings.premiumUnlocked) return moods;
    return moods.slice(0, 2);
  }, [settings.premiumUnlocked]);

  const chooseImage = async () => {
    if (!settings.premiumUnlocked) {
      Alert.alert('Premium required', 'Custom backgrounds are part of Premium.');
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow photo library access.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8
    });
    if (!result.canceled && result.assets.length > 0) {
      setBackgroundImageUri(result.assets[0].uri);
    }
  };

  const onSave = async () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please give this moment a name.');
      return;
    }
    setSaving(true);
    try {
      await addEvent({
        title: title.trim(),
        quote: quote.trim() || undefined,
        date,
        mode,
        mood,
        backgroundColor: backgroundColor.trim() || undefined,
        backgroundImageUri,
        premiumRequired: Boolean(!settings.premiumUnlocked && (backgroundImageUri || mood === 'Peaceful' || mood === 'Silent'))
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Save failed', 'We could not save this memory. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.safeArea}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          placeholder="A moment to remember"
          placeholderTextColor={palette.textSecondary}
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Date & time</Text>
        <Pressable onPress={() => setShowPicker(true)} style={styles.pickerButton}>
          <Text style={styles.pickerText}>{date.toLocaleString()}</Text>
        </Pressable>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display={Platform.select({ ios: 'spinner', android: 'default' })}
            onChange={(_, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}

        <Text style={styles.label}>Mode</Text>
        <View style={styles.modeRow}>
          {(['countdown', 'countup'] as CountdownMode[]).map((item) => (
            <Pressable
              key={item}
              onPress={() => setMode(item)}
              style={[styles.modeButton, mode === item && styles.modeButtonActive]}
            >
              <Text style={[styles.modeText, mode === item && styles.modeTextActive]}>
                {item === 'countdown' ? 'Counting down' : 'Counting up'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Quote (optional)</Text>
        <TextInput
          placeholder="Whisper something to remember."
          placeholderTextColor={palette.textSecondary}
          style={[styles.input, styles.multiline]}
          value={quote}
          multiline
          numberOfLines={3}
          onChangeText={setQuote}
        />

        <Text style={styles.label}>Mood</Text>
        <View style={styles.moodGrid}>
          {moods.map((item) => {
            const locked = !settings.premiumUnlocked && !availableMoods.includes(item);
            const selected = mood === item;
            return (
              <Pressable
                key={item}
                onPress={() => {
                  if (locked) {
                    Alert.alert('Premium required', 'Unlock Premium to access this mood.');
                    return;
                  }
                  setMood(item);
                }}
                style={[styles.moodCard, selected && { borderColor: moodPalette[item] }]}
              >
                <View style={[styles.moodSwatch, { backgroundColor: moodPalette[item] }]} />
                <Text style={styles.moodText}>{item}</Text>
                {locked && <Text style={styles.locked}>Premium</Text>}
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Background color (optional)</Text>
        <TextInput
          placeholder="#1A1F24"
          placeholderTextColor={palette.textSecondary}
          style={styles.input}
          value={backgroundColor}
          onChangeText={setBackgroundColor}
        />

        <Pressable onPress={chooseImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>
            {backgroundImageUri ? 'Change background image' : 'Select background image'}
          </Text>
        </Pressable>
        {backgroundImageUri && <Text style={styles.imageInfo}>{backgroundImageUri}</Text>}

        <Pressable onPress={onSave} style={[styles.saveButton, saving && { opacity: 0.6 }]} disabled={saving}>
          <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save memory'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background
  },
  container: {
    padding: 24,
    paddingBottom: 120
  },
  label: {
    ...typography.caption,
    color: palette.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8
  },
  input: {
    ...typography.body,
    backgroundColor: palette.surface,
    color: palette.textPrimary,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 24
  },
  multiline: {
    height: 120,
    textAlignVertical: 'top'
  },
  pickerButton: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    marginBottom: 24
  },
  pickerText: {
    ...typography.body,
    color: palette.textPrimary
  },
  modeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24
  },
  modeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface
  },
  modeButtonActive: {
    borderColor: palette.accentMist,
    backgroundColor: palette.surfaceAlt
  },
  modeText: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center'
  },
  modeTextActive: {
    color: palette.textPrimary
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  moodCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    marginBottom: 12,
    alignItems: 'center',
    gap: 8
  },
  moodSwatch: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  moodText: {
    ...typography.body,
    color: palette.textPrimary
  },
  locked: {
    ...typography.caption,
    color: palette.textSecondary
  },
  imageButton: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    marginBottom: 8
  },
  imageButtonText: {
    ...typography.body,
    color: palette.textPrimary,
    textAlign: 'center'
  },
  imageInfo: {
    ...typography.caption,
    color: palette.textSecondary,
    marginBottom: 32
  },
  saveButton: {
    padding: 18,
    borderRadius: 999,
    backgroundColor: palette.accentMist,
    alignItems: 'center'
  },
  saveText: {
    ...typography.body,
    fontSize: 18,
    color: palette.textPrimary
  }
});

export default AddEventScreen;
