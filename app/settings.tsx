// SettingsScreen: manage appearance, reminders, and premium unlock flow.
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '@/store/settingsStore';
import PrimaryButton from '@/components/PrimaryButton';
import { purchasePremium } from '@/services/premiumService';

export default function SettingsScreen() {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const notifications = useSettingsStore((state) => state.notifications);
  const toggleNotification = useSettingsStore((state) => state.toggleNotification);
  const premiumUnlocked = useSettingsStore((state) => state.premiumUnlocked);
  const [processing, setProcessing] = useState(false);

  const handlePurchase = async () => {
    setProcessing(true);
    try {
      await purchasePremium();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Stillness</Text>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Theme</Text>
          <View style={styles.row}>
            <Text style={styles.itemLabel}>Dark</Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
              trackColor={{ false: '#3A3E47', true: '#2A635B' }}
              thumbColor="#F4F6F8"
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notifications</Text>
          {(['daily', 'finalDay'] as const).map((key) => (
            <View key={key} style={styles.row}>
              <Text style={styles.itemLabel}>{key === 'daily' ? 'Daily' : 'Final day'}</Text>
              <Switch
                value={notifications[key]}
                onValueChange={() => toggleNotification(key)}
                trackColor={{ false: '#3A3E47', true: '#2A635B' }}
                thumbColor="#F4F6F8"
              />
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Premium</Text>
          <Text style={styles.helper}>
            {premiumUnlocked
              ? 'Premium unlocked. Widgets, all moods, and custom images are yours.'
              : 'Unlock once to access widgets, extra moods, and serene backgrounds.'}
          </Text>
          {!premiumUnlocked && (
            <PrimaryButton label={processing ? 'Processing…' : 'Unlock Premium'} onPress={handlePurchase} disabled={processing} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#050608'
  },
  container: {
    padding: 24,
    gap: 32
  },
  heading: {
    color: '#EAF3F1',
    fontSize: 32,
    fontWeight: '600'
  },
  section: {
    gap: 16
  },
  sectionLabel: {
    color: '#8B919F',
    fontSize: 14,
    letterSpacing: 1.1,
    textTransform: 'uppercase'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemLabel: {
    color: '#D2D8E4',
    fontSize: 16
  },
  helper: {
    color: '#7B8597',
    fontSize: 15,
    lineHeight: 22
  }
});
