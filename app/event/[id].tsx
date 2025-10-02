import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Alert, ImageBackground, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useEventStore } from '@/store/eventStore';
import { calculateProgress, formatCountdownText } from '@/utils/time';
import PrimaryButton from '@/components/PrimaryButton';
import QuoteBlock from '@/components/QuoteBlock';
import { BookmarkIcon, PencilIcon, ShareIcon, WidgetIcon } from '@/components/icons';
import { useSettingsStore } from '@/store/settingsStore';
import { syncWidgetForEvent } from '@/services/widgetService';

export default function EventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const togglePin = useEventStore((state) => state.togglePin);
  const event = useEventStore((state) => state.events.find((item) => item.id === id));
  const premiumUnlocked = useSettingsStore((state) => state.premiumUnlocked);
  const [now, setNow] = useState(() => new Date());
  const viewRef = useRef<ScrollView | null>(null);

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

  const handleWidget = async () => {
    if (!premiumUnlocked) {
      Alert.alert('Premium required', 'Unlock Premium to place widgets on your Home or Lock Screen.');
      return;
    }

    if (Platform.OS !== 'ios') {
      Alert.alert('Widgets unavailable', 'Home and Lock Screen widgets are currently supported on iOS devices.');
      return;
    }

    try {
      await syncWidgetForEvent(event);
      Alert.alert('Widget updated', 'Add the Stillness widget from your device widget gallery.');
    } catch (error) {
      Alert.alert('Unable to update widget', 'Something went wrong while preparing the widget.');
    }
  };

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
          {event.progressEnabled && (
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, progress * 100))}%` }]}
              />
            </View>
          )}
          <Text style={styles.moodLabel}>{event.mood}</Text>
          <Text style={styles.timestamp}>{new Date(event.dateTime).toLocaleString()}</Text>
          <QuoteBlock text={event.quote} />
          <View style={styles.actions}>
            <PrimaryButton
              label="Share"
              onPress={handleShare}
              leading={<ShareIcon size={20} color="#E4F2F0" strokeWidth={1.8} />}
            />
            <PrimaryButton
              label={event.pinned ? 'Unpin' : 'Pin'}
              onPress={handlePin}
              leading={
                <BookmarkIcon
                  size={20}
                  color="#E4F2F0"
                  strokeWidth={1.8}
                  fill={event.pinned ? 'rgba(228,242,240,0.18)' : 'none'}
                />
              }
            />
            <PrimaryButton
              label="Edit"
              onPress={() => router.push({ pathname: '/event/[id]/edit', params: { id: event.id } })}
              leading={<PencilIcon size={20} color="#E4F2F0" strokeWidth={1.8} />}
            />
            <PrimaryButton
              label="Widget"
              onPress={handleWidget}
              leading={<WidgetIcon size={20} color="#E4F2F0" strokeWidth={1.8} />}
            />
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
    fontWeight: '600'
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
  moodLabel: {
    color: '#8F95A5',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  timestamp: {
    color: '#9AA5B6',
    fontSize: 14
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  }
});
