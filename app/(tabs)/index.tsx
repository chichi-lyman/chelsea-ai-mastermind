import React, { useState, useEffect, useRef } from 'react';
import {
  YStack,
  XStack,
  H1,
  H4,
  Paragraph,
  Button,
  Switch,
  Circle,
  useBlinkToast,
  SafeArea,
  Mic,
  Shield,
  Zap,
  ScrollView,
} from '@blinkdotnew/mobile-ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blink } from '@/lib/blink';
import * as Haptics from 'expo-haptics';
import { Platform, View, StyleSheet } from 'react-native';

import { ChelseaEngine } from '@/components/ChelseaEngine';
import { GlassCard } from '@/src/components/GlassCard';
import { initializeRAG } from '@/src/services/IntelligenceService';
import { startRecording, stopAndTranscribe } from '@/lib/voiceRecorder';
import { speak, stopSpeaking } from '@/lib/tts';

type MicState = 'idle' | 'listening' | 'processing';

export default function DashboardScreen() {
  const toast           = useBlinkToast();
  const queryClient     = useQueryClient();
  const [micState, setMicState]   = useState<MicState>('idle');
  const [command, setCommand]     = useState<string | undefined>(undefined);
  const [transcript, setTranscript] = useState<string>('');
  const commandKey = useRef(0); // bumped each time we want ChelseaEngine to re-run

  useEffect(() => { initializeRAG(); }, []);

  // ── Settings ─────────────────────────────────────────────────────────────

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const list = await blink.db.userSettings.list();
      if (list.length === 0) {
        return blink.db.userSettings.create({
          userId: 'default_user',
          guardrailsEnabled: '1',
          bluetoothConnected: '0',
        });
      }
      return list[0];
    },
  });

  const toggleGuardrails = useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!settings) return;
      return blink.db.userSettings.update(settings.id, {
        guardrailsEnabled: enabled ? '1' : '0',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
  });

  const guardrailsOn = settings?.guardrailsEnabled === '1';

  // ── Voice pipeline ────────────────────────────────────────────────────────

  const handleMicPress = async () => {
    if (micState === 'listening') {
      // ── Tap 2: stop + transcribe ──────────────────────────────────────
      setMicState('processing');
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      try {
        const text = await stopAndTranscribe();

        if (!text.trim()) {
          toast.show('Nothing detected', { message: 'Please speak a command and try again.', variant: 'error' });
          setMicState('idle');
          return;
        }

        setTranscript(text);
        commandKey.current += 1;
        // Append a unique suffix so useEffect in ChelseaEngine always fires
        setCommand(`${text}##${commandKey.current}`);

        toast.show('Command received', { message: `"${text}"`, variant: 'success' });
      } catch (err: any) {
        toast.show('Transcription failed', {
          message: err?.message?.includes('401')
            ? 'Sign in to enable voice commands.'
            : err?.message ?? 'Microphone error.',
          variant: 'error',
        });
      } finally {
        setMicState('idle');
      }

    } else if (micState === 'idle') {
      // ── Tap 1: start recording ────────────────────────────────────────
      await stopSpeaking();
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 100);
      }

      try {
        await startRecording();
        setMicState('listening');
        toast.show('Listening…', { message: 'Tap mic again to send command.', variant: 'success' });
      } catch (err: any) {
        toast.show('Mic error', { message: err?.message ?? 'Cannot access microphone.', variant: 'error' });
      }
    }
  };

  const handleChelseaResponse = (text: string) => {
    speak(text);
  };

  // Strip the internal key suffix before passing to engine
  const cleanCommand = command?.split('##')[0];

  // ── Mic ring colours ──────────────────────────────────────────────────────
  const ringColor =
    micState === 'listening'  ? '#A78BFA' :
    micState === 'processing' ? '#F59E0B' :
    'rgba(255,255,255,0.15)';

  const micLabel =
    micState === 'listening'  ? 'LISTENING' :
    micState === 'processing' ? 'PROCESSING' :
    'READY';

  const micColor =
    micState === 'listening'  ? '#A78BFA' :
    micState === 'processing' ? '#F59E0B' :
    'rgba(255,255,255,0.4)';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeArea flex={1} backgroundColor="transparent">
      <ScrollView padding="$4" contentContainerStyle={{ paddingBottom: 100 }}>
        <YStack gap="$6">

          {/* Header */}
          <YStack gap="$1" pt="$4">
            <H4 color="rgba(255,255,255,0.5)" fontWeight="400" letterSpacing={1}>MASTER INTERFACE</H4>
            <H1 fontWeight="900" color="white" size="$10">Chelsea AI</H1>
          </YStack>

          {/* Mic ring */}
          <YStack alignItems="center" py="$4">
            <YStack position="relative" alignItems="center" justifyContent="center">
              <Circle
                size={220}
                borderWidth={1}
                borderColor="rgba(255,255,255,0.1)"
                backgroundColor="rgba(255,255,255,0.02)"
              />
              <Circle
                size={180}
                borderWidth={2}
                borderColor={ringColor}
                justifyContent="center"
                alignItems="center"
                style={{
                  position: 'absolute',
                  shadowColor: ringColor,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: micState !== 'idle' ? 0.7 : 0,
                  shadowRadius: 20,
                }}
              >
                <YStack alignItems="center" gap="$2">
                  <Mic size={48} color={micColor} />
                  <Paragraph color={micColor} fontWeight="800" letterSpacing={2} size="$1">
                    {micLabel}
                  </Paragraph>
                </YStack>
              </Circle>

              {/* Invisible full-circle tap target */}
              <Button
                position="absolute"
                width={240}
                height={240}
                borderRadius={120}
                backgroundColor="transparent"
                disabled={micState === 'processing'}
                onPress={handleMicPress}
              />
            </YStack>

            {transcript ? (
              <Paragraph mt="$3" color="rgba(255,255,255,0.6)" textAlign="center" size="$3" fontStyle="italic">
                "{transcript}"
              </Paragraph>
            ) : (
              <Paragraph mt="$4" color="rgba(255,255,255,0.4)" textAlign="center" fontWeight="500">
                {micState === 'idle' ? '"Okay, Chelsea"' : micState === 'listening' ? 'Speak your command…' : 'Transcribing…'}
              </Paragraph>
            )}
          </YStack>

          {/* Live Engine — receives command + speaks response */}
          <GlassCard title="Engine Status" accent="#A78BFA">
            <ChelseaEngine command={cleanCommand} onResponse={handleChelseaResponse} />
          </GlassCard>

          {/* Guardrails toggle */}
          <GlassCard title="Security Protocols" accent={guardrailsOn ? '#10B981' : '#EF4444'}>
            <XStack justifyContent="space-between" alignItems="center">
              <YStack gap="$1" flex={1}>
                <H4 color="white" fontWeight="700">Guardrails Mode</H4>
                <Paragraph color="rgba(255,255,255,0.5)" size="$3">
                  {guardrailsOn ? 'Safe Mode Active' : 'Unrestricted Access'}
                </Paragraph>
              </YStack>
              <Switch
                value={guardrailsOn}
                onValueChange={(val) => toggleGuardrails.mutate(val)}
                theme={guardrailsOn ? 'green' : 'red'}
              />
            </XStack>
          </GlassCard>

          {/* Quick stats */}
          <XStack gap="$4">
            <GlassCard title="Swarm" accent="#8B5CF6">
              <YStack gap="$2" pt="$1">
                <H1 color="white" size="$8">04</H1>
                <Paragraph color="rgba(255,255,255,0.5)" size="$2">Sub-Agents Live</Paragraph>
              </YStack>
            </GlassCard>
            <GlassCard title="Health" accent="#10B981">
              <YStack gap="$2" pt="$1">
                <H1 color="white" size="$8">100%</H1>
                <Paragraph color="rgba(255,255,255,0.5)" size="$2">Self-Healing Active</Paragraph>
              </YStack>
            </GlassCard>
          </XStack>

          {/* Footer */}
          <YStack alignItems="center" mt="$4" opacity={0.3}>
            <Paragraph color="white" size="$1" letterSpacing={1}>CHELSEA OS v4.5.0-GLASS</Paragraph>
            <Paragraph color="white" size="$1" letterSpacing={1}>VOICE INTERFACE ACTIVE</Paragraph>
          </YStack>

        </YStack>
      </ScrollView>
    </SafeArea>
  );
}
