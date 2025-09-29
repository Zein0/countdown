// Detailed view of a single event with animated countdown text and sharing capabilities.
import React, { useMemo, useRef } from 'react';
import { ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useApp } from '../context/AppContext';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { RootStackParamList } from '../navigation/types';
import { useCountdownTimer } from '../hooks/useCountdownTimer';

export type EventScreenProps = NativeStackScreenProps<RootStackParamList, 'Event'>;

export const EventScreen: React.FC<EventScreenProps> = ({ route }) => {
  const { eventId } = route.params;
  const { events, togglePin } = useApp();
  const event = useMemo(() => events.find(item => item.id === eventId), [events, eventId]);
  const viewShotRef = useRef<ViewShot | null>(null);

  const { primaryText, secondaryText } = useCountdownTimer(event?.date ?? new Date().toISOString(), event?.mode ?? 'countdown');

  if (!event) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={styles.missing}>This moment could not be found.</Text>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.warn('Failed to share countdown', error);
    }
  };

  const backgroundStyle = event.background?.type === 'color'
    ? { backgroundColor: event.background.value }
    : { backgroundColor: palette.backgroundDark };

  const content = (
    <ViewShot ref={viewShotRef} style={styles.captureArea} options={{ format: 'png', quality: 0.9 }}>
      <View style={[styles.content, backgroundStyle]}>
        {event.background?.type === 'image' ? (
          <ImageBackground source={{ uri: event.background.value }} style={styles.imageBackground} imageStyle={{ opacity: 0.8 }}>
            <View style={styles.overlay}>
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.primary}>{primaryText}</Text>
              <Text style={styles.secondary}>{secondaryText}</Text>
              {event.quote ? <Text style={styles.quote}>“{event.quote}”</Text> : null}
            </View>
          </ImageBackground>
        ) : (
          <View style={styles.overlay}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.primary}>{primaryText}</Text>
            <Text style={styles.secondary}>{secondaryText}</Text>
            {event.quote ? <Text style={styles.quote}>“{event.quote}”</Text> : null}
          </View>
        )}
      </View>
    </ViewShot>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {content}
      <View style={styles.footerActions}>
        <Pressable style={styles.footerButton} onPress={handleShare}>
          <Text style={styles.footerButtonText}>Share</Text>
        </Pressable>
        <Pressable style={styles.footerButton} onPress={() => togglePin(event.id)}>
          <Text style={styles.footerButtonText}>{event.pinned ? 'Unpin' : 'Pin'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.backgroundDark
  },
  captureArea: {
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  overlay: {
    backgroundColor: 'rgba(15, 17, 21, 0.55)',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    gap: 16
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...typography.headlineSerif,
    color: palette.textPrimaryDark,
    textAlign: 'center'
  },
  primary: {
    fontSize: 48,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: palette.textPrimaryDark,
    textAlign: 'center'
  },
  secondary: {
    ...typography.bodyLarge,
    color: palette.textSecondaryDark,
    textAlign: 'center'
  },
  quote: {
    ...typography.body,
    fontStyle: 'italic',
    color: palette.textSecondaryDark,
    textAlign: 'center'
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 24,
    gap: 16
  },
  footerButton: {
    flex: 1,
    backgroundColor: palette.surfaceDark,
    borderRadius: 18,
    paddingVertical: 16
  },
  footerButtonText: {
    textAlign: 'center',
    color: palette.textPrimaryDark,
    fontSize: 16,
    letterSpacing: 1.1
  },
  missing: {
    color: palette.textSecondaryDark,
    ...typography.body
  }
});
