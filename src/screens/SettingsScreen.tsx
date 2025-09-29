// Settings screen to manage notifications, theme, and premium unlock.
import React from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp, usePremiumUnlocked } from '../context/AppContext';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { NotificationPreference } from '../types';
import { RootStackParamList } from '../navigation/types';

export type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const notificationOptions: { label: string; value: NotificationPreference; description: string }[] = [
  { label: 'Daily whisper', value: 'daily', description: 'A soft daily reminder at dawn.' },
  { label: 'Final day', value: 'final', description: 'Only when the last day arrives.' },
  { label: 'Anniversary', value: 'anniversary', description: 'Once each year when the date returns.' },
  { label: 'Silence', value: 'none', description: 'No notifications.' }
];

export const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const {
    settings,
    setNotificationPreference,
    toggleTheme,
    unlockPremium,
    restorePremiumAccess,
    events
  } = useApp();
  const premiumUnlocked = usePremiumUnlocked();

  const handleNotificationChange = async (value: NotificationPreference) => {
    await setNotificationPreference(value);
  };

  const handlePurchase = async () => {
    const success = await unlockPremium();
    Alert.alert(success ? 'Thank you' : 'Not available', success ? 'Premium is now unlocked.' : 'Purchase could not be completed.');
  };

  const handleRestore = async () => {
    const restored = await restorePremiumAccess();
    Alert.alert(restored ? 'Welcome back' : 'Nothing to restore', restored ? 'Premium features are active.' : 'No previous purchase found.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Settings</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {notificationOptions.map(option => (
            <Pressable
              key={option.value}
              style={[styles.option, settings.notificationPreference === option.value && styles.optionActive]}
              onPress={() => handleNotificationChange(option.value)}
            >
              <View>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <View style={[styles.radio, settings.notificationPreference === option.value && styles.radioActive]} />
            </Pressable>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>
          <Pressable style={styles.option} onPress={toggleTheme}>
            <View>
              <Text style={styles.optionLabel}>Dark mode</Text>
              <Text style={styles.optionDescription}>Switch between dark and light.</Text>
            </View>
            <Switch value={settings.theme === 'dark'} onValueChange={toggleTheme} trackColor={{ true: palette.accentMist }} />
          </Pressable>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium</Text>
          <Text style={styles.premiumDescription}>
            Unlock widgets, ambient sound, and all moods. Existing moments: {events.length}.
          </Text>
          <Pressable style={[styles.premiumButton, premiumUnlocked && styles.premiumButtonDisabled]} onPress={handlePurchase} disabled={premiumUnlocked}>
            <Text style={styles.premiumButtonText}>{premiumUnlocked ? 'Premium active' : 'Purchase Premium'}</Text>
          </Pressable>
          <Pressable style={styles.restoreButton} onPress={handleRestore}>
            <Text style={styles.restoreText}>Restore purchase</Text>
          </Pressable>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Home & lock screen widgets</Text>
            <Text style={styles.featureItem}>• Peaceful & Silent moods</Text>
            <Text style={styles.featureItem}>• Custom background images</Text>
            <Text style={styles.featureItem}>• Ambient soundscape</Text>
          </View>
        </View>
        {premiumUnlocked && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ambient Sound</Text>
            <Pressable style={styles.option}>
              <View>
                <Text style={styles.optionLabel}>Peaceful atmosphere</Text>
                <Text style={styles.optionDescription}>Coming soon. Soft tones when viewing an event.</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Soon</Text>
              </View>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.backgroundDark
  },
  container: {
    padding: 24,
    paddingBottom: 120,
    gap: 32
  },
  heading: {
    ...typography.headlineSerif,
    color: palette.textPrimaryDark
  },
  section: {
    gap: 16
  },
  sectionTitle: {
    color: palette.textSecondaryDark,
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  option: {
    backgroundColor: palette.surfaceDark,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  optionActive: {
    borderWidth: 1,
    borderColor: palette.accentMist
  },
  optionLabel: {
    color: palette.textPrimaryDark,
    fontSize: 16
  },
  optionDescription: {
    marginTop: 6,
    color: palette.textSecondaryDark,
    fontSize: 13
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.textSecondaryDark
  },
  radioActive: {
    borderColor: palette.accentMist,
    backgroundColor: palette.accentMist
  },
  premiumDescription: {
    color: palette.textSecondaryDark,
    ...typography.body
  },
  premiumButton: {
    backgroundColor: palette.accentMist,
    paddingVertical: 16,
    borderRadius: 20
  },
  premiumButtonDisabled: {
    opacity: 0.5
  },
  premiumButtonText: {
    textAlign: 'center',
    color: palette.backgroundDark,
    fontSize: 16,
    letterSpacing: 1.1
  },
  restoreButton: {
    paddingVertical: 8
  },
  restoreText: {
    textAlign: 'center',
    color: palette.textSecondaryDark,
    textDecorationLine: 'underline'
  },
  featureList: {
    gap: 8
  },
  featureItem: {
    color: palette.textSecondaryDark
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12
  },
  badgeText: {
    color: palette.textSecondaryDark,
    fontSize: 12
  }
});
