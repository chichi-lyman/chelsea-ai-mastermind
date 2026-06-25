/**
 * Platform-adaptive Text-to-Speech.
 * - Web    → window.speechSynthesis (built-in, no auth needed)
 * - Native → blink.ai.generateSpeech + expo-av playback
 *
 * Fails silently so it never blocks the UI.
 */

import { Platform } from 'react-native';
import { blink } from '@/lib/blink';

let _nativeSound: any = null; // expo-av Sound instance

/** Stop any currently playing speech. */
export const stopSpeaking = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    window.speechSynthesis?.cancel();
    return;
  }
  if (_nativeSound) {
    try { await _nativeSound.unloadAsync(); } catch { /* ignore */ }
    _nativeSound = null;
  }
};

/** Speak text aloud. Safe to call without awaiting. */
export const speak = async (text: string): Promise<void> => {
  if (!text.trim()) return;

  if (Platform.OS === 'web') {
    _speakWeb(text);
    return;
  }

  await _speakNative(text);
};

function _speakWeb(text: string): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // stop previous

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95;
  utter.pitch = 1.1;

  // Prefer a female English voice when available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
  ) ?? voices.find((v) => v.lang.startsWith('en')) ?? null;
  if (preferred) utter.voice = preferred;

  window.speechSynthesis.speak(utter);
}

async function _speakNative(text: string): Promise<void> {
  try {
    // Stop previous sound first
    await stopSpeaking();

    const { url } = await blink.ai.generateSpeech({ text, voice: 'nova' });

    const { Audio } = await import('expo-av');
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

    const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
    _nativeSound = sound;

    sound.setOnPlaybackStatusUpdate((status: any) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync().catch(() => {});
        _nativeSound = null;
      }
    });
  } catch (err) {
    // generateSpeech requires auth — fail gracefully
    console.warn('TTS unavailable (auth required for native speech):', err);
  }
}
