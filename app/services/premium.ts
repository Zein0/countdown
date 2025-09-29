// Premium helpers integrate the one-time unlock using Expo In-App Purchases.
import * as InAppPurchases from 'expo-in-app-purchases';

const PRODUCT_ID = 'countdown_premium_unlock';

let initialized = false;

async function ensureInitialized() {
  if (initialized) return;
  try {
    await InAppPurchases.connectAsync();
    initialized = true;
  } catch (error) {
    console.warn('Failed to connect to in-app purchases', error);
  }
}

export async function requestPurchase(): Promise<boolean> {
  await ensureInitialized();
  try {
    await InAppPurchases.getProductsAsync([PRODUCT_ID]);
    // Dummy purchase behaviour for Expo Go development: auto-resolve as success.
    return true;
  } catch (error) {
    console.error('Purchase failed', error);
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  await ensureInitialized();
  try {
    const history = await InAppPurchases.getPurchaseHistoryAsync();
    return history.results.some((entry) => entry.productId === PRODUCT_ID);
  } catch (error) {
    console.error('Restore failed', error);
    return false;
  }
}
