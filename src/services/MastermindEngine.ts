import { PorcupineManager } from '@picovoice/porcupine-react-native';

export const startChelseaVoice = async (onWake: () => void) => {
  const accessKey = 'YOUR_PICOVOICE_KEY'; // Replace with your Picovoice Key from console.picovoice.ai
  try {
    const manager = await PorcupineManager.fromBuiltInKeywords(
      accessKey,
      ['porcupine'], // Replace with custom 'Chelsea' .ppn model if trained
      (idx) => {
        if (idx === 0) {
          console.log('Mastermind Listening: How can I help?');
          onWake();
        }
      }
    );
    await manager.start();
    console.log('Chelsea Voice Engine Activated');
    return manager;
  } catch (e) {
    console.error('Voice Engine Error', e);
    throw e;
  }
};

export const triggerSelfHealing = async (error: string, stack?: string) => {
  console.log(
    `Mastermind: Detecting corruption... Attempting auto-patch for: ${error}`
  );
  try {
    const response = await fetch('/api/mastermind/heal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error, stack }),
    });

    if (response.ok) {
      console.log('DevAgent: Patch Deployed. Restarting...');
      return true;
    }
    return false;
  } catch (e) {
    console.error('Self-healing failed:', e);
    return false;
  }
};

export const stopChelseaVoice = async (manager: PorcupineManager) => {
  try {
    await manager.stop();
    await manager.delete();
    console.log('Chelsea Voice Engine Deactivated');
  } catch (e) {
    console.error('Error stopping voice engine:', e);
  }
};