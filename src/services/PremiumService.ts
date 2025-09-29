// Minimal in-app purchase wrapper. Uses Expo IAP but resolves immediately for testing in Expo Go.
import * as InAppPurchases from 'expo-in-app-purchases';

const PRODUCT_ID = 'countdown_premium_unlock';

export const connectToStore = async () => {
  try {
    await InAppPurchases.connectAsync();
  } catch (error) {
    console.warn('Failed to connect to IAP store', error);
  }
};

export const disconnectFromStore = async () => {
  try {
    await InAppPurchases.disconnectAsync();
  } catch (error) {
    console.warn('Failed to disconnect from IAP store', error);
  }
};

export const purchasePremium = async (): Promise<boolean> => {
  try {
    await connectToStore();
    const items = await InAppPurchases.getProductsAsync([PRODUCT_ID]);
    if (items.results.length > 0) {
      await InAppPurchases.purchaseItemAsync(PRODUCT_ID);
    }
    // Expo Go cannot complete purchases; resolve true for testing.
    return true;
  } catch (error) {
    console.warn('Premium purchase failed', error);
    return false;
  } finally {
    await disconnectFromStore();
  }
};

export const restorePremium = async (): Promise<boolean> => {
  try {
    await connectToStore();
    const history = await InAppPurchases.getPurchaseHistoryAsync(false);
    return history.results?.some(entry => entry.productId === PRODUCT_ID) ?? false;
  } catch (error) {
    console.warn('Premium restore failed', error);
    return false;
  } finally {
    await disconnectFromStore();
  }
};
