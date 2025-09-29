// HomeScreen renders the main timeline of countdowns with a featured memory and list.
import React, { useMemo } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { useCountdowns } from '@/context/CountdownContext';
import { CountdownCard } from '@/components/CountdownCard';
import { palette } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import Animated, { FadeInDown } from 'react-native-reanimated';

const emptyMessage = `Begin by honouring a moment.
A birth. A goodbye. A quiet milestone.`;

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { events, loading } = useCountdowns();

  const pinned = useMemo(() => events.find((event) => event.pinned), [events]);
  const highlighted = pinned || events[0] || null;
  const others = useMemo(
    () => events.filter((event) => event.id !== highlighted?.id),
    [events, highlighted?.id]
  );
  const highlightTimer = useCountdownTimer(highlighted);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Time That Slips Away</Text>
          <Text style={styles.subtitle}>Hold the moments close.</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('Settings')} style={styles.settingsButton}>
          <Text style={styles.settingsText}>Settings</Text>
        </Pressable>
      </View>

      {highlighted ? (
        <Animated.View entering={FadeInDown.duration(500)} style={styles.heroCard}>
          <Pressable onPress={() => navigation.navigate('Event', { eventId: highlighted.id })}>
            <Text style={styles.heroTitle}>{highlighted.title}</Text>
            <Text style={styles.heroTimer}>{highlightTimer.segments}</Text>
            {highlighted.quote ? <Text style={styles.heroQuote}>{highlighted.quote}</Text> : null}
          </Pressable>
        </Animated.View>
      ) : null}

      <FlatList
        data={others}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading && events.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{emptyMessage}</Text>
            </View>
          ) : undefined
        }
        renderItem={({ item }) => (
          <CountdownCard
            event={item}
            onPress={() => navigation.navigate('Event', { eventId: item.id })}
          />
        )}
      />

      <Pressable
        accessibilityLabel="Add countdown"
        onPress={() => navigation.navigate('AddEvent')}
        style={styles.fab}
      >
        <Text style={styles.fabText}>＋</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    ...typography.titleSerif,
    color: palette.textPrimary
  },
  subtitle: {
    ...typography.body,
    color: palette.textSecondary,
    marginTop: 4
  },
  settingsButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: palette.surfaceAlt,
    borderWidth: 1,
    borderColor: palette.border
  },
  settingsText: {
    ...typography.caption,
    color: palette.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  heroCard: {
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 24,
    borderRadius: 28,
    backgroundColor: palette.surfaceAlt,
    borderWidth: 1,
    borderColor: palette.border
  },
  heroTitle: {
    ...typography.titleSerif,
    fontSize: 36,
    color: palette.textPrimary,
    marginBottom: 12
  },
  heroTimer: {
    ...typography.body,
    fontSize: 22,
    letterSpacing: 0.8,
    color: palette.textSecondary
  },
  heroQuote: {
    ...typography.caption,
    color: palette.textSecondary,
    marginTop: 16
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 120
  },
  emptyState: {
    marginTop: 80,
    alignItems: 'center'
  },
  emptyText: {
    ...typography.body,
    fontSize: 18,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 26
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 36,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.surfaceAlt,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }
  },
  fabText: {
    fontSize: 36,
    color: palette.textPrimary,
    marginTop: -4
  }
});

export default HomeScreen;
