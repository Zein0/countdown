// EventScreen presents a single memory full-screen with sharing and pinning controls.
import React, { useCallback, useMemo, useRef } from 'react';
import {
  Alert,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { useCountdowns } from '@/context/CountdownContext';
import { palette, moodPalette } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';


type Props = NativeStackScreenProps<RootStackParamList, 'Event'>;

const EventScreen: React.FC<Props> = ({ route, navigation }) => {
  const { eventId } = route.params;
  const { events, togglePinned } = useCountdowns();
  const viewRef = useRef<View | null>(null);

  const event = useMemo(() => events.find((item) => item.id === eventId), [events, eventId]);
  const timer = event ? useCountdownTimer(event) : null;

  const share = useCallback(async () => {
    if (!event) return;
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Sharing unavailable', 'Sharing is not supported on this device.');
        return;
      }
      if (!viewRef.current) return;
      const uri = await captureRef(viewRef.current, {
        format: 'png',
        quality: 0.9
      });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Share failed', 'We could not share this memory.');
    }
  }, [event]);

  const pin = useCallback(async () => {
    if (!event) return;
    await togglePinned(event.id);
  }, [event, togglePinned]);

  if (!event || !timer) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <View style={styles.missingContainer}>
          <Text style={styles.missingText}>This memory faded away.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const accent = event.backgroundColor || moodPalette[event.mood];

  const content = (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: event.backgroundColor || palette.background }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Pressable onPress={pin} style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>{event.pinned ? 'Unpin' : 'Pin'}</Text>
        </Pressable>
      </View>
      <View style={styles.content} ref={viewRef}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={[styles.timerText, { color: accent }]}>{timer.segments}</Text>
        <Text style={styles.caption}>{timer.summary}</Text>
        {event.quote ? <Text style={styles.quote}>{event.quote}</Text> : null}
      </View>
      <Pressable onPress={share} style={styles.primaryButton}>
        <Text style={styles.primaryText}>Share</Text>
      </Pressable>
    </SafeAreaView>
  );

  if (event.backgroundImageUri) {
    return (
      <ImageBackground source={{ uri: event.backgroundImageUri }} style={styles.background}>
        {content}
      </ImageBackground>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background
  },
  background: {
    flex: 1
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16
  },
  backButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#00000033'
  },
  backText: {
    ...typography.caption,
    color: palette.textPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  secondaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#00000033'
  },
  secondaryText: {
    ...typography.caption,
    color: palette.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 24
  },
  title: {
    ...typography.titleSerif,
    fontSize: 42,
    textAlign: 'center',
    color: palette.textPrimary
  },
  timerText: {
    fontSize: 42,
    fontFamily: 'Georgia',
    letterSpacing: 1,
    textAlign: 'center'
  },
  caption: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center'
  },
  quote: {
    ...typography.body,
    fontStyle: 'italic',
    color: palette.textPrimary,
    textAlign: 'center'
  },
  primaryButton: {
    marginHorizontal: 24,
    marginBottom: 40,
    paddingVertical: 18,
    borderRadius: 999,
    backgroundColor: palette.accentMist,
    alignItems: 'center'
  },
  primaryText: {
    ...typography.body,
    fontSize: 18,
    color: palette.textPrimary
  },
  missingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  missingText: {
    ...typography.body,
    color: palette.textSecondary
  }
});

export default EventScreen;
