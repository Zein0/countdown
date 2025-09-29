// Notification helpers handle scheduling reflective reminders for events.
import * as Notifications from 'expo-notifications';
import { CountdownEvent } from '@/types';

type NotificationPreferences = {
  daily: boolean;
  finalDay: boolean;
  anniversary: boolean;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
    shouldSetBadge: false
  })
});

export async function scheduleCountdownNotifications(
  event: CountdownEvent,
  preferences: NotificationPreferences
): Promise<void> {
  const permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) {
    const status = await Notifications.requestPermissionsAsync();
    if (!status.granted) {
      return;
    }
  }
  await cancelNotificationsForEvent(event.id);

  const triggerDate = new Date(event.date);
  const now = new Date();
  const isFuture = triggerDate.getTime() > now.getTime();

  if (preferences.finalDay && isFuture) {
    const finalDay = new Date(triggerDate);
    finalDay.setDate(finalDay.getDate() - 1);
    if (finalDay.getTime() > now.getTime()) {
      await Notifications.scheduleNotificationAsync({
        identifier: `${event.id}-final`,
        content: {
          title: event.title,
          body: formatMessage(event, finalDay)
        },
        trigger: finalDay
      });
    }
  }

  if (preferences.daily && isFuture) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    await Notifications.scheduleNotificationAsync({
      identifier: `${event.id}-daily`,
      content: {
        title: event.title,
        body: formatMessage(event, new Date())
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true
      }
    });
  }

  if (preferences.anniversary) {
    const anniversary = new Date(triggerDate);
    if (!isFuture) {
      const next = new Date();
      next.setFullYear(next.getFullYear() + 1);
      next.setMonth(triggerDate.getMonth());
      next.setDate(triggerDate.getDate());
      next.setHours(9, 0, 0, 0);
      await Notifications.scheduleNotificationAsync({
        identifier: `${event.id}-anniversary`,
        content: {
          title: event.title,
          body: `It's been ${formatAnniversary(next, triggerDate)}.`
        },
        trigger: next
      });
    }
  }
}

export async function cancelNotificationsForEvent(eventId: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => item.identifier.startsWith(eventId))
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier))
  );
}

function formatMessage(event: CountdownEvent, reference: Date): string {
  const target = new Date(event.date);
  const diff = target.getTime() - reference.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (event.mode === 'countup') {
    const pastDays = Math.abs(days);
    return `${pastDays} day${pastDays === 1 ? '' : 's'} since. Breathe.`;
  }
  if (days <= 0) {
    return `Today is the day. Time moves quietly.`;
  }
  return `${days} day${days === 1 ? '' : 's'} left. Breathe.`;
}

function formatAnniversary(now: Date, original: Date): string {
  const years = now.getFullYear() - original.getFullYear();
  if (years <= 1) {
    return '1 year today';
  }
  return `${years} years today`;
}
