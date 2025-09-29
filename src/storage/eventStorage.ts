// AsyncStorage helpers dedicated to storing and retrieving countdown events.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CountdownEvent } from '../types';
import { STORAGE_KEYS } from './storageKeys';

export const loadEvents = async (): Promise<CountdownEvent[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as CountdownEvent[];
    return parsed;
  } catch (error) {
    console.warn('Failed to parse stored events', error);
    return [];
  }
};

export const saveEvents = async (events: CountdownEvent[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
};
