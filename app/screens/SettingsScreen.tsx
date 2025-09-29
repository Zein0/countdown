// SettingsScreen offers notification, theme, and premium management controls.
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { useCountdowns } from '@/context/CountdownContext';
import { palette } from '@/theme/colors';
import { typography } from '@/theme/typography';


type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen: React.FC<Props> = () => {
  const { settings, updateSettings, purchasePremium, premiumLoading, restorePremium } = useCountdowns();
  const [theme, setTheme] = useState<'dark' | 'light'>(settings.theme);

  const toggleNotifications = async (key: keyof typeof settings.notifications) => {
    await updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
  };

  const changeTheme = async (value: 'dark' | 'light') => {
    setTheme(value);
    await updateSettings({ theme: value });
  };

  const unlockPremium = async () => {
    const success = await purchasePremium();
    if (!success) {
      Alert.alert('Purchase failed', 'We were unable to unlock Premium.');
    }
  };

  const onRestore = async () => {
    await restorePremium();
  };

  return (
    <ScrollView style={styles.safeArea} contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {(
          Object.keys(settings.notifications) as Array<keyof typeof settings.notifications>
        ).map((key) => (
          <View key={key} style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>{labelForNotification(key)}</Text>
              <Text style={styles.rowSubtitle}>{subtitleForNotification(key)}</Text>
            </View>
            <Switch
              value={settings.notifications[key]}
              onValueChange={() => toggleNotifications(key)}
              thumbColor={settings.notifications[key] ? palette.accentMist : '#555'}
              trackColor={{ false: '#333', true: '#6C7A89' }}
            />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        {(['dark', 'light'] as const).map((value) => (
          <Pressable
            key={value}
            onPress={() => changeTheme(value)}
            style={[styles.themeOption, theme === value && styles.themeOptionActive]}
          >
            <Text style={styles.rowTitle}>{value === 'dark' ? 'Dark' : 'Light'}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Premium</Text>
        <Text style={styles.rowSubtitle}>
          Unlock ambient sound, all moods, and custom backgrounds. Widgets arrive with Premium.
        </Text>
        {settings.premiumUnlocked ? (
          <View style={styles.premiumBadge}>
            <Text style={styles.badgeText}>Premium unlocked</Text>
          </View>
        ) : (
          <>
            <Pressable onPress={unlockPremium} style={styles.primaryButton} disabled={premiumLoading}>
              <Text style={styles.primaryText}>{premiumLoading ? 'Processing…' : 'Purchase Premium'}</Text>
            </Pressable>
            <Pressable onPress={onRestore} style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>Restore Purchase</Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
};

function labelForNotification(key: keyof ReturnType<typeof useCountdowns>['settings']['notifications']) {
  switch (key) {
    case 'daily':
      return 'Daily';
    case 'finalDay':
      return 'Final day';
    case 'anniversary':
      return 'Anniversary';
  }
  return '';
}

function subtitleForNotification(key: keyof ReturnType<typeof useCountdowns>['settings']['notifications']) {
  switch (key) {
    case 'daily':
      return 'A quiet reminder each morning.';
    case 'finalDay':
      return 'A whisper on the eve of the moment.';
    case 'anniversary':
      return 'Remember each passing year.';
  }
  return '';
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background
  },
  container: {
    padding: 24,
    paddingBottom: 120
  },
  section: {
    marginBottom: 32,
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: palette.border
  },
  sectionTitle: {
    ...typography.headlineSerif,
    color: palette.textPrimary,
    marginBottom: 16
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  rowInfo: {
    flex: 1,
    marginRight: 16
  },
  rowTitle: {
    ...typography.body,
    color: palette.textPrimary
  },
  rowSubtitle: {
    ...typography.caption,
    color: palette.textSecondary,
    marginTop: 4
  },
  themeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 12,
    backgroundColor: palette.surface
  },
  themeOptionActive: {
    borderColor: palette.accentMist,
    backgroundColor: palette.surfaceAlt
  },
  primaryButton: {
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: palette.accentMist,
    alignItems: 'center'
  },
  primaryText: {
    ...typography.body,
    fontSize: 16,
    color: palette.textPrimary
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center'
  },
  secondaryText: {
    ...typography.caption,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: palette.textSecondary
  },
  premiumBadge: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.accentMist,
    alignItems: 'center'
  },
  badgeText: {
    ...typography.body,
    color: palette.accentMist
  }
});

export default SettingsScreen;
