// Notification helpers to register permissions and schedule per-event reminders.
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { CountdownEvent } from '@/store/eventStore';
import { NotificationPreferences } from '@/store/settingsStore';
import { buildNotificationLine, parseDate } from '@/utils/time';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export const requestNotificationPermissions = async () => {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return settings;
  }
  return Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true
    }
  });
};

export const cancelExistingNotifications = async (identifiers?: string[]) => {
  if (!identifiers?.length) return;
  await Promise.all(identifiers.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
};

const scheduleSingleNotification = async (
  event: CountdownEvent,
  secondsFromNow: number,
  body: string
) => {
  if (secondsFromNow <= 0) return undefined;
  return Notifications.scheduleNotificationAsync({
    content: {
      title: event.title,
      body,
      sound: Platform.OS === 'android' ? undefined : 'default'
    },
    trigger: { seconds: secondsFromNow }
  });
};

const scheduleAnniversaryNotification = async (event: CountdownEvent) => {
  const target = parseDate(event.dateTime);
  const nextAnniversary = new Date();
  nextAnniversary.setMonth(target.getMonth(), target.getDate());
  nextAnniversary.setHours(9, 0, 0, 0);
  if (nextAnniversary.getTime() <= Date.now()) {
    nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1);
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: event.title,
      body: `It has been ${buildNotificationLine(event)}. Time moves quietly.`,
      sound: Platform.OS === 'android' ? undefined : 'default'
    },
    trigger: {
      channelId: undefined,
      year: nextAnniversary.getFullYear(),
      month: nextAnniversary.getMonth() + 1,
      day: nextAnniversary.getDate(),
      hour: nextAnniversary.getHours(),
      minute: nextAnniversary.getMinutes(),
      repeats: true
    }
  });
};

const IOS_NOTIFICATION_LIMIT = 64;

const getScheduledNotificationCount = async (): Promise<number> => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.length;
};

export const scheduleEventNotifications = async (
  event: CountdownEvent,
  preferences: NotificationPreferences
) => {
  await requestNotificationPermissions();
  await cancelExistingNotifications(event.notificationIds);

  // Check iOS notification limit
  if (Platform.OS === 'ios') {
    const currentCount = await getScheduledNotificationCount();
    const potentialNewCount = currentCount + 3; // Max 3 notifications per event

    if (potentialNewCount > IOS_NOTIFICATION_LIMIT) {
      console.warn(
        `Notification limit approaching: ${currentCount}/${IOS_NOTIFICATION_LIMIT}. Some notifications may not be scheduled.`
      );
    }
  }

  const identifiers: string[] = [];
  const now = Date.now();
  const target = parseDate(event.dateTime).getTime();
  const secondsUntil = Math.max(0, Math.floor((target - now) / 1000));

  if (preferences.finalDay && target > now) {
    const id = await scheduleSingleNotification(
      event,
      secondsUntil,
      `It is today. ${event.quote ?? 'Breathe.'}`
    );
    if (id) identifiers.push(id);
  }

  if (preferences.daily && target > now) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: event.title,
        body: `${buildNotificationLine(event)}. Time moves quietly.`,
        sound: Platform.OS === 'android' ? undefined : 'default'
      },
      trigger: { hour: 9, minute: 0, repeats: true }
    });
    identifiers.push(id);
  }

  if (preferences.anniversary && target < now) {
    const id = await scheduleAnniversaryNotification(event);
    if (id) identifiers.push(id);
  }

  // Final check after scheduling
  if (Platform.OS === 'ios') {
    const finalCount = await getScheduledNotificationCount();
    if (finalCount >= IOS_NOTIFICATION_LIMIT) {
      console.warn(
        `iOS notification limit reached: ${finalCount}/${IOS_NOTIFICATION_LIMIT}. No more notifications can be scheduled.`
      );
    }
  }

  return identifiers;
};
