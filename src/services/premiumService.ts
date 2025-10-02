// Simple premium unlock placeholder until Expo IAP integration is added.
import { useSettingsStore } from '@/store/settingsStore';

export const purchasePremium = async () => {
  // Dummy purchase implementation for now.
  await new Promise((resolve) => setTimeout(resolve, 1200));
  useSettingsStore.getState().setPremiumUnlocked(true);
  return true;
};

export const isPremiumUnlocked = () => useSettingsStore.getState().premiumUnlocked;
