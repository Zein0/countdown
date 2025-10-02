import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import EventForm, { EventFormState } from '@/components/EventForm';
import { useEventStore } from '@/store/eventStore';
import { useSettingsStore } from '@/store/settingsStore';
import { cancelExistingNotifications, scheduleEventNotifications } from '@/services/notificationService';
import { syncWidgetForEvent } from '@/services/widgetService';

export default function EditEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const event = useEventStore((state) => state.events.find((item) => item.id === id));
  const updateEvent = useEventStore((state) => state.updateEvent);
  const deleteEvent = useEventStore((state) => state.deleteEvent);
  const notifications = useSettingsStore((state) => state.notifications);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!event) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>This moment is gone.</Text>
          <Text style={styles.emptySubtitle}>Return home and try again.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const initialState: EventFormState = {
    title: event.title,
    emoji: event.emoji ?? '🕯️',
    dateTime: new Date(event.dateTime),
    mode: event.mode,
    quote: event.quote ?? '',
    mood: event.mood,
    backgroundColor: event.backgroundColor,
    backgroundImage: event.backgroundImage ?? null,
    format: event.format,
    progressEnabled: event.progressEnabled
  };

  const handleSubmit = async (draft: EventFormState) => {
    try {
      setSaving(true);
      const updated = {
        ...event,
        title: draft.title,
        emoji: draft.emoji,
        dateTime: draft.dateTime.toISOString(),
        mode: draft.mode,
        quote: draft.quote || undefined,
        mood: draft.mood,
        backgroundColor: draft.backgroundColor,
        backgroundImage: draft.backgroundImage ?? null,
        format: draft.format,
        progressEnabled: draft.progressEnabled,
        premiumFeatureUsed:
          Boolean(draft.backgroundImage) || draft.mood === 'Peaceful' || draft.mood === 'Silent'
      };
      const notificationIds = await scheduleEventNotifications(updated, notifications);
      updateEvent(event.id, { ...updated, notificationIds });
      await syncWidgetForEvent({ ...updated, notificationIds });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await cancelExistingNotifications(event.notificationIds);
      deleteEvent(event.id);
      await syncWidgetForEvent(null);
      router.replace('/');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <EventForm
          initialState={initialState}
          onSubmit={handleSubmit}
          submitting={saving}
          submitLabel="Update"
          onDelete={handleDelete}
          deleteDisabled={deleting}
        />
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
    gap: 16
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12
  },
  emptyTitle: {
    color: '#EAF3F1',
    fontSize: 22,
    fontWeight: '600'
  },
  emptySubtitle: {
    color: '#9AA5B6',
    fontSize: 16
  }
});

