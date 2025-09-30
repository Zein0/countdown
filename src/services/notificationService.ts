// Wrapper functions around Expo Notifications for scheduling emotional reminders.
import * as Notifications from 'expo-notifications';
import { differenceInDays, isAfter } from 'date-fns';
import { CountdownEvent, NotificationPreference } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowAlert: true
  })
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }
  const response = await Notifications.requestPermissionsAsync();
  return response.granted || response.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
};

const createMessage = (event: CountdownEvent): string => {
  const now = new Date();
  const target = new Date(event.date);
  if (event.mode === 'countup') {
    const days = Math.abs(differenceInDays(now, target));
    if (days === 0) {
      return 'Today it began. Breathe.';
    }
    return `It has been ${days} day${days === 1 ? '' : 's'} now.`;
  }
  if (isAfter(now, target)) {
    return 'Time moves quietly.';
  }
  const daysLeft = differenceInDays(target, now);
  if (daysLeft <= 0) {
    return 'Moments remain. Stay with it.';
  }
  return `${daysLeft} day${daysLeft === 1 ? '' : 's'} left. Breathe.`;
};

export const cancelNotificationsForEvent = async (eventId: string) => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const relevant = scheduled.filter(item => item.content.data?.eventId === eventId);
  await Promise.all(relevant.map(item => Notifications.cancelScheduledNotificationAsync(item.identifier)));
};

export const scheduleNotificationsForEvent = async (
  event: CountdownEvent,
  preference: NotificationPreference
) => {
  await cancelNotificationsForEvent(event.id);
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission || preference === 'none') {
    return;
  }
  const target = new Date(event.date);
  const now = new Date();
  if (preference === 'daily') {
    // Send a daily reminder at 9am local time leading to the event.
    const trigger = new Date();
    trigger.setHours(9, 0, 0, 0);
    if (trigger < now) {
      trigger.setDate(trigger.getDate() + 1);
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: event.title,
        body: createMessage(event),
        data: { eventId: event.id }
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true
      }
    });
  } else if (preference === 'final') {
    if (target > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: event.title,
          body: 'Final day. Hold this moment.',
          data: { eventId: event.id }
        },
        trigger: target
      });
    }
  } else if (preference === 'anniversary') {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: event.title,
        body: createMessage(event),
        data: { eventId: event.id }
      },
      trigger: {
        month: target.getMonth() + 1,
        day: target.getDate(),
        hour: 9,
        minute: 0,
        repeats: true
      }
    });
  }
};
