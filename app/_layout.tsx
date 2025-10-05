// Root layout wires the Expo Router stack with app-wide theming & notification bootstrap.
import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useSettingsStore } from '@/store/settingsStore';
import { requestNotificationPermissions } from '@/services/notificationService';
import ErrorBoundary from '@/components/ErrorBoundary';

const darkPalette = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#050608',
    card: '#0C0F14',
    border: '#161922',
    text: '#F5F6F9'
  }
};

const lightPalette = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F2F4F7',
    card: '#FFFFFF',
    border: '#DDE2EA',
    text: '#12141A'
  }
};

export default function RootLayout() {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    requestNotificationPermissions().catch(() => null);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider value={theme === 'dark' ? darkPalette : lightPalette}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme === 'dark' ? '#050608' : '#FFFFFF' },
            headerShadowVisible: false,
            headerTintColor: theme === 'dark' ? '#F6F8FA' : '#1A1D21',
            contentStyle: { backgroundColor: theme === 'dark' ? '#050608' : '#F2F4F7' }
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Moments' }} />
          <Stack.Screen name="add" options={{ presentation: 'modal', title: 'New Countdown' }} />
          <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="event/[id]/edit" options={{ title: 'Edit Countdown', presentation: 'modal' }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        </Stack>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
