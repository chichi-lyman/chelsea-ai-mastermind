import { ChelseaHealer } from './SelfHealingService';

// Voice wake-word detection is handled via button press on web.
// On native, swap this for a real wake-word SDK when a key is available.
type WakeCallback = () => void;
let wakeListener: WakeCallback | null = null;

export const startChelseaVoice = (_onWake: WakeCallback) => {
  wakeListener = _onWake;
  console.log('Chelsea Voice Engine: Simulation mode active (press mic button to wake)');
  // Return a no-op stop handle so callers don't need platform checks
  return { stop: () => { wakeListener = null; } };
};

export const stopChelseaVoice = (handle?: { stop: () => void }) => {
  handle?.stop();
  wakeListener = null;
  console.log('Chelsea Voice Engine Deactivated');
};

/** Call from the UI mic button to simulate a wake word trigger */
export const simulateWakeWord = () => {
  if (wakeListener) wakeListener();
};

export const triggerSelfHealing = async (error: string, stack?: string): Promise<boolean> => {
  console.log(`Mastermind: Detecting corruption… auto-patching: ${error}`);
  try {
    const result = await ChelseaHealer(error, stack);
    if (result.success) {
      console.log('Mastermind: Self-healing successful. Integrity restored.');
      return true;
    }
    console.error('Mastermind: Self-healing failed.', result.message);
    return false;
  } catch (e) {
    console.error('Self-healing error:', e);
    return false;
  }
};
