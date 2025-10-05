import { useCallback, useEffect, useMemo } from 'react';
// Home screen: lists countdown moments and provides quick access to creation & settings.
import { Link, useNavigation, useRouter } from 'expo-router';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import FloatingActionButton from '@/components/FloatingActionButton';
import EventCard from '@/components/EventCard';
import { useEventStore, type CountdownEvent } from '@/store/eventStore';
import { useSettingsStore } from '@/store/settingsStore';
import { SettingsIcon } from '@/components/icons';

const sortEvents = (events: CountdownEvent[]): CountdownEvent[] => {
  return events.slice().sort((a, b) => {
    // Pinned items first
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }
    // Then sort by date
    return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
  });
};

const ItemSeparator = () => <View style={{ height: 24 }} />;

const EmptyListComponent = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyEmoji}>🕯️</Text>
    <Text style={styles.emptyTitle}>Nothing yet.</Text>
    <Text style={styles.emptySubtitle}>Let time speak by creating your first countdown.</Text>
  </View>
);

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
          <SettingsIcon
            size={22}
            color={theme === 'dark' ? '#F2F4F7' : '#1A1D21'}
            strokeWidth={1.8}
            style={{ marginRight: 16 }}
          />
        </Link>
      )
    });
  }, [navigation, theme]);

  const data = useMemo(() => sortEvents(events), [events]);

  const handleEventPress = useCallback(
    (id: string) => {
      router.push({ pathname: '/event/[id]', params: { id } });
    },
    [router]
  );

  const handleTogglePin = useCallback(
    (id: string) => {
      togglePin(id);
    },
    [togglePin]
  );

  const keyExtractor = useCallback((item: CountdownEvent) => item.id, []);

  const renderItem = useCallback(
    ({ item, index }: { item: CountdownEvent; index: number }) => (
      <EventCard
        event={item}
        index={index}
        onPress={() => handleEventPress(item.id)}
        onTogglePin={() => handleTogglePin(item.id)}
      />
    ),
    [handleEventPress, handleTogglePin]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        contentContainerStyle={[styles.list, data.length === 0 && styles.emptyList]}
        renderItem={renderItem}
        ListEmptyComponent={EmptyListComponent}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
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
    fontWeight: '600'
  },
  emptySubtitle: {
    color: '#96A0B1',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20
  }
});
