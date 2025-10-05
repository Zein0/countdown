import { useCallback, useMemo } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { PREMIUM_MOODS } from '@/constants/config';
import type { Mood } from '@/store/eventStore';

interface UsePremiumReturn {
  premiumUnlocked: boolean;
  isPremiumMood: (mood: Mood) => boolean;
  isPremiumFeature: (featureType: 'mood' | 'backgroundImage' | 'widget') => boolean;
  requirePremium: (featureType: 'mood' | 'backgroundImage' | 'widget', onSuccess?: () => void) => boolean;
  disabledMoods: readonly string[];
}

export const usePremium = (): UsePremiumReturn => {
  const premiumUnlocked = useSettingsStore((state) => state.premiumUnlocked);

  const disabledMoods = useMemo(
    () => (premiumUnlocked ? [] : PREMIUM_MOODS),
    [premiumUnlocked]
  );

  const isPremiumMood = useCallback(
    (mood: Mood): boolean => {
      return PREMIUM_MOODS.includes(mood as typeof PREMIUM_MOODS[number]);
    },
    []
  );

  const isPremiumFeature = useCallback(
    (featureType: 'mood' | 'backgroundImage' | 'widget'): boolean => {
      // All these features require premium
      return true;
    },
    []
  );

  const requirePremium = useCallback(
    (featureType: 'mood' | 'backgroundImage' | 'widget', onSuccess?: () => void): boolean => {
      if (premiumUnlocked) {
        onSuccess?.();
        return true;
      }
      return false;
    },
    [premiumUnlocked]
  );

  return {
    premiumUnlocked,
    isPremiumMood,
    isPremiumFeature,
    requirePremium,
    disabledMoods
  };
};

export default usePremium;
