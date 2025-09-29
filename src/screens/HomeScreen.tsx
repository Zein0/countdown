// Home screen listing all countdown events with a floating action button for adding new ones.
import React, { useMemo } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { EventCard } from '../components/EventCard';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { useApp } from '../context/AppContext';
import { palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { RootStackParamList } from '../navigation/types';

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<HomeScreenProps> = () => {
  const navigation = useNavigation<HomeScreenProps['navigation']>();
  const { events } = useApp();

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => {
      if (a.pinned && !b.pinned) {
        return -1;
      }
      if (!a.pinned && b.pinned) {
        return 1;
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }),
    [events]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Moments we are holding</Text>
          <Text style={styles.subtitle}>Let time speak softly.</Text>
        </View>
        <Text style={styles.settingsLink} onPress={() => navigation.navigate('Settings')}>
          Settings
        </Text>
      </View>
      <FlatList
        data={sortedEvents}
        keyExtractor={item => item.id}
        contentContainerStyle={sortedEvents.length === 0 ? styles.emptyContainer : styles.listContent}
        renderItem={({ item }) => (
          <EventCard event={item} onPress={() => navigation.navigate('Event', { eventId: item.id })} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No countdowns yet.</Text>
            <Text style={styles.emptyBody}>Create one to honor the moments slipping away.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
      <FloatingActionButton onPress={() => navigation.navigate('AddEvent')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.backgroundDark,
    paddingHorizontal: 20
  },
  header: {
    paddingTop: 12,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    ...typography.headlineSerif,
    color: palette.textPrimaryDark
  },
  subtitle: {
    marginTop: 6,
    color: palette.textSecondaryDark
  },
  settingsLink: {
    color: palette.accentMist,
    fontSize: 14,
    letterSpacing: 1.2
  },
  listContent: {
    paddingBottom: 120
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 120
  },
  emptyState: {
    alignItems: 'center',
    gap: 8
  },
  emptyTitle: {
    ...typography.titleSerif,
    color: palette.textPrimaryDark
  },
  emptyBody: {
    ...typography.body,
    color: palette.textSecondaryDark,
    textAlign: 'center'
  }
});
