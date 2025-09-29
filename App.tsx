// Entry point for the Countdown app. Sets up fonts, providers, and navigation.
import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { AppProvider, useApp, useThemeMode } from './src/context/AppContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { AddEventScreen } from './src/screens/AddEventScreen';
import { EventScreen } from './src/screens/EventScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { RootStackParamList } from './src/navigation/types';
import { palette } from './src/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isBootstrapping } = useApp();
  const themeMode = useThemeMode();

  if (isBootstrapping) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={palette.accentMist} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={themeMode === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom'
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddEvent" component={AddEventScreen} />
        <Stack.Screen name="Event" component={EventScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AppContent = () => {
  const [fontsLoaded] = useFonts({ PlayfairDisplay_700Bold });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={palette.accentMist} />
      </View>
    );
  }

  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: palette.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
