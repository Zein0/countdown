import { useEffect, useMemo } from 'react';
// Home screen: lists countdown moments and provides quick access to creation & settings.
import { Link, useNavigation, useRouter } from 'expo-router';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FloatingActionButton from '@/components/FloatingActionButton';
import EventCard from '@/components/EventCard';
import { useEventStore } from '@/store/eventStore';
import { useSettingsStore } from '@/store/settingsStore';

const sortEvents = (events: ReturnType<typeof useEventStore.getState>['events']) =>
  [...events].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
  });

export default function HomeScreen() {
  const events = useEventStore((state) => state.events);
  const togglePin = useEventStore((state) => state.togglePin);
  const theme = useSettingsStore((state) => state.theme);
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Link href="/settings" asChild>
          <Ionicons
            name="settings-outline"
            size={22}
            color={theme === 'dark' ? '#F2F4F7' : '#1A1D21'}
            style={{ marginRight: 16 }}
          />
        </Link>
      )
    });
  }, [navigation, theme]);

  const data = useMemo(() => sortEvents(events), [events]);

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, data.length === 0 && styles.emptyList]}
        renderItem={({ item, index }) => (
          <EventCard
            event={item}
            index={index}
            onPress={() => router.push({ pathname: '/event/[id]', params: { id: item.id } })}
            onTogglePin={() => togglePin(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🕯️</Text>
            <Text style={styles.emptyTitle}>Nothing yet.</Text>
            <Text style={styles.emptySubtitle}>Let time speak by creating your first countdown.</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
        showsVerticalScrollIndicator={false}
      />
      <Link href="/add" asChild>
        <FloatingActionButton />
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#050608'
  },
  list: {
    padding: 24,
    paddingBottom: 120,
    gap: 24
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  emptyState: {
    alignItems: 'center',
    gap: 12
  },
  emptyEmoji: {
    fontSize: 48
  },
  emptyTitle: {
    color: '#E8EDF6',
    fontSize: 24,
    fontFamily: 'serif'
  },
  emptySubtitle: {
    color: '#96A0B1',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20
  }
});
