// Shared navigation type definitions for the stack navigator.
import { CountdownEvent } from '../types';

export type RootStackParamList = {
  Home: undefined;
  AddEvent: { event?: CountdownEvent } | undefined;
  Event: { eventId: string };
  Settings: undefined;
};
