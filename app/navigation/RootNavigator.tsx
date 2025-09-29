// RootNavigator wires together the stacked navigation across screens.
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/HomeScreen';
import AddEventScreen from '@/screens/AddEventScreen';
import EventScreen from '@/screens/EventScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import { palette } from '@/theme/colors';

export type RootStackParamList = {
  Home: undefined;
  AddEvent: undefined;
  Event: { eventId: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: palette.surface },
        headerTintColor: palette.textPrimary,
        contentStyle: { backgroundColor: palette.background },
        animation: 'fade'
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddEvent"
        component={AddEventScreen}
        options={{
          title: 'New Memory',
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="Event"
        component={EventScreen}
        options={{ headerShown: false, presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};
