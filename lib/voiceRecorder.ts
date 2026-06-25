/**
 * Platform-adaptive voice recorder + Blink AI transcription.
 * - Web  → MediaRecorder API (chunks stored in module-level array, never React state)
 * - Native → expo-av Audio.Recording
 *
 * Usage:
 *   await startRecording()          // tap 1: begin capture
 *   const text = await stopAndTranscribe()  // tap 2: stop + return transcript
 */

import { Platform } from 'react-native';
import { blink } from '@/lib/blink';

// ─── Native (expo-av) ────────────────────────────────────────────────────────

let _nativeRecording: any = null; // Audio.Recording — typed as any to avoid import side-effects on web

async function _startNative(): Promise<void> {
  const { Audio } = await import('expo-av');
  const { granted } = await Audio.requestPermissionsAsync();
  if (!granted) throw new Error('Microphone permission denied. Please allow mic access in Settings.');

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const { recording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  _nativeRecording = recording;
}

async function _stopNativeAndTranscribe(): Promise<string> {
  if (!_nativeRecording) return '';

  await _nativeRecording.stopAndUnloadAsync();
  const uri: string | null = _nativeRecording.getURI();
  _nativeRecording = null;

  if (!uri) throw new Error('Recording URI is empty.');

  // Read file as ArrayBuffer via fetch (works for local file:// URIs on native)
  const res = await fetch(uri);
  const arrayBuffer = await res.arrayBuffer();

  const { text } = await blink.ai.transcribeAudio({ audio: arrayBuffer, language: 'en' });
  return text;
}

// ─── Web (MediaRecorder) ─────────────────────────────────────────────────────

let _webRecorder: MediaRecorder | null = null;
let _webStream: MediaStream | null = null;
// ⚠️ Module-level array — NOT React state (async state updates would race onstop)
const _webChunks: Blob[] = [];

async function _startWeb(): Promise<void> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('Media recording is not supported in this browser.');
  }
  _webStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  _webChunks.length = 0; // reset

  _webRecorder = new MediaRecorder(_webStream);
  _webRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) _webChunks.push(e.data);
  };
  _webRecorder.start();
}

function _stopWebAndTranscribe(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!_webRecorder) { resolve(''); return; }

    _webRecorder.onstop = async () => {
      try {
        const blob = new Blob(_webChunks, { type: 'audio/webm' });
        _webStream?.getTracks().forEach((t) => t.stop());

        // Blob → base64 via FileReader (safe for large files — avoids btoa stack overflow)
        const base64 = await new Promise<string>((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res((reader.result as string).split(',')[1]);
          reader.onerror = rej;
          reader.readAsDataURL(blob);
        });

        const { text } = await blink.ai.transcribeAudio({ audio: base64, language: 'en' });
        _webChunks.length = 0;
        resolve(text);
      } catch (err) {
        reject(err);
      }
    };

    _webRecorder.stop();
  });
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const startRecording = (): Promise<void> =>
  Platform.OS === 'web' ? _startWeb() : _startNative();

export const stopAndTranscribe = (): Promise<string> =>
  Platform.OS === 'web' ? _stopWebAndTranscribe() : _stopNativeAndTranscribe();
