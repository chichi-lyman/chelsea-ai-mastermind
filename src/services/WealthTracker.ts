import { Platform, Linking } from 'react-native';

export interface RevenueData {
  dailyMRR: number;
  growthRate: string;
  pipeline: Array<{ id: number; label: string; value: number }>;
}

export const initializeWealthFlow = async () => {
  // Stripe SDK initialisation is skipped until a publishable key is provided.
  // Add EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY to secrets to enable live mode.
  const key = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    console.log('WealthTracker: No Stripe key found – running in simulation mode.');
    return;
  }
  console.log('WealthTracker: Stripe key detected – live mode ready.');
};

export const fetchMastermindMRR = async (
  simulationMode: boolean = true
): Promise<RevenueData> => {
  if (simulationMode) {
    return {
      dailyMRR: 450.25 + Math.random() * 100,
      growthRate: '+12.5%',
      pipeline: [
        { id: 1, label: 'DevAgent Subscription', value: 200 },
        { id: 2, label: 'Sovereign Oracle Fees', value: 150 },
        { id: 3, label: 'API Access', value: 100.25 },
      ]
    };
  }

  // Live mode placeholder – wire to a real backend endpoint when available.
  return fetchMastermindMRR(true);
};

/**
 * Open a Stripe Checkout URL in the native browser.
 * Pass a real hosted Checkout URL from your backend or Stripe dashboard.
 */
export const initiateWealthCheckout = async (checkoutUrl: string): Promise<boolean> => {
  try {
    if (!checkoutUrl) {
      console.warn('WealthTracker: No checkout URL provided.');
      return false;
    }

    if (Platform.OS === 'web') {
      // On web, open in a new tab to avoid iframe restrictions
      window.open(checkoutUrl, '_blank');
    } else {
      await Linking.openURL(checkoutUrl);
    }
    return true;
  } catch (error) {
    console.error('WealthTracker checkout error:', error);
    return false;
  }
};

export const simulateRevenueGrowth = (
  currentRevenue: number,
  growthRate: number = 0.00015
): number => {
  return currentRevenue + currentRevenue * growthRate;
};
