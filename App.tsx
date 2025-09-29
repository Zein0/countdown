// App bootstraps providers and navigation for Countdown.
import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CountdownProvider, useCountdowns } from '@/context/CountdownContext';
import { RootNavigator } from '@/navigation/RootNavigator';
import { palette } from '@/theme/colors';

const AppContent = () => {
  const { settings } = useCountdowns();
  const theme = settings.theme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      theme={{
        ...theme,
        colors: {
          ...theme.colors,
          background: settings.theme === 'dark' ? palette.background : '#F5F5F5',
          text: settings.theme === 'dark' ? palette.textPrimary : '#1B1B1B'
        }
      }}
    >
      <StatusBar style={settings.theme === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: palette.background }}>
      <CountdownProvider>
        <AppContent />
      </CountdownProvider>
    </GestureHandlerRootView>
  );
}
