import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { nanoid } from 'nanoid/non-secure';
import EventForm, { EventFormState } from '@/components/EventForm';
import { CountdownEvent, useEventStore } from '@/store/eventStore';
import { useSettingsStore } from '@/store/settingsStore';
import { scheduleEventNotifications } from '@/services/notificationService';

export default function AddEventScreen() {
  const router = useRouter();
  const addEvent = useEventStore((state) => state.addEvent);
  const notifications = useSettingsStore((state) => state.notifications);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (draft: EventFormState) => {
    const event: CountdownEvent = {
      id: nanoid(),
      title: draft.title,
      emoji: draft.emoji,
      dateTime: draft.dateTime.toISOString(),
      mode: draft.mode,
      quote: draft.quote || undefined,
      mood: draft.mood,
      pinned: false,
      backgroundColor: draft.backgroundColor,
      backgroundImage: draft.backgroundImage ?? null,
      format: draft.format,
      createdAt: new Date().toISOString(),
      progressEnabled: draft.progressEnabled,
      premiumFeatureUsed:
        Boolean(draft.backgroundImage) || draft.mood === 'Peaceful' || draft.mood === 'Silent',
      notificationIds: []
    };

    try {
      setSaving(true);
      const ids = await scheduleEventNotifications(event, notifications);
      const persisted = { ...event, notificationIds: ids };
      addEvent(persisted);
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <EventForm onSubmit={handleSubmit} submitting={saving} />
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
  }
});
