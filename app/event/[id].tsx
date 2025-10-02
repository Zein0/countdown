// EventScreen: immersive display of a single countdown with sharing and pinning controls.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Alert, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useEventStore } from '@/store/eventStore';
import { calculateProgress, formatCountdownText } from '@/utils/time';
import PrimaryButton from '@/components/PrimaryButton';
import QuoteBlock from '@/components/QuoteBlock';

export default function EventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const togglePin = useEventStore((state) => state.togglePin);
  const event = useEventStore((state) => state.events.find((item) => item.id === id));
  const [now, setNow] = useState(() => new Date());
  const viewRef = useRef<View | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const countdown = useMemo(() => (event ? formatCountdownText(event, event.format, now) : ''), [event, now]);
  const progress = event ? calculateProgress(event, now) : 0;

  if (!event) {
    return (
      <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#F6F7FA', fontSize: 18 }}>Event not found.</Text>
      </SafeAreaView>
    );
  }

  const gradient = event.backgroundColor ?? '#10141A';

  const handleShare = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        result: 'tmpfile',
        quality: 1
      });
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Share unavailable', 'Sharing is not available on this device.');
        return;
      }
      await Sharing.shareAsync(uri, { dialogTitle: event.title });
    } catch (error) {
      Alert.alert('Unable to share', 'Something went wrong while preparing the countdown.');
    }
  };

  const handlePin = () => togglePin(event.id);

  const content = (
    <View style={[styles.overlay, { backgroundColor: event.backgroundImage ? 'rgba(5,7,12,0.65)' : 'transparent' }]}>
      <ScrollView contentContainerStyle={styles.container} ref={viewRef}>
        <Animated.View entering={FadeInUp.duration(900).springify()} style={[styles.card, { backgroundColor: gradient }]}
        >
          <Text style={styles.emoji}>{event.emoji ?? '🕯️'}</Text>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.mode}>{event.mode === 'countdown' ? 'Counting down' : 'Counting the days since'}</Text>
          <Animated.Text entering={FadeInUp.delay(200)} style={styles.countdown}>
            {countdown}
          </Animated.Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, progress * 100))}%` }]}
            />
          </View>
          <Text style={styles.timestamp}>{new Date(event.dateTime).toLocaleString()}</Text>
          <QuoteBlock text={event.quote} />
          <View style={styles.actions}>
            <PrimaryButton label="Share" onPress={handleShare} leading={<Ionicons name="share-outline" size={18} color="#E4F2F0" />} />
            <PrimaryButton label={event.pinned ? 'Unpin' : 'Pin'} onPress={handlePin} leading={<Ionicons name="bookmark-outline" size={18} color="#E4F2F0" />} />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {event.backgroundImage ? (
        <ImageBackground source={{ uri: event.backgroundImage }} style={styles.background}>
          {content}
        </ImageBackground>
      ) : (
        <View style={[styles.background, { backgroundColor: '#050608' }]}>{content}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#050608'
  },
  background: {
    flex: 1
  },
  overlay: {
    flex: 1
  },
  container: {
    padding: 24,
    alignItems: 'center',
    gap: 24
  },
  card: {
    width: '100%',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 16,
    backgroundColor: '#10141A'
  },
  emoji: {
    fontSize: 48
  },
  title: {
    fontSize: 34,
    color: '#F7F8FA',
    fontFamily: 'serif'
  },
  mode: {
    color: '#95A0B2',
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  countdown: {
    fontSize: 28,
    color: '#D5E4E0'
  },
  progressBar: {
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)'
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#47C2B1'
  },
  timestamp: {
    color: '#9AA5B6',
    fontSize: 14
  },
  actions: {
    flexDirection: 'row',
    gap: 12
  }
});
