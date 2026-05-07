import React, { useState, useEffect } from 'react';
import { 
  YStack, 
  XStack, 
  H1, 
  H4, 
  Paragraph, 
  Card, 
  Button, 
  Switch, 
  Label, 
  Circle, 
  useBlinkToast, 
  SafeArea,
  Mic,
  Activity,
  Shield,
  Zap,
  ScrollView
} from '@blinkdotnew/mobile-ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blink } from '@/lib/blink';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { ChelseaEngine } from '@/components/ChelseaEngine';

export default function DashboardScreen() {
  const toast = useBlinkToast();
  const queryClient = useQueryClient();
  const [isListening, setIsListening] = useState(false);

  const { data: settings, isLoading: loadingSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const list = await blink.db.userSettings.list();
      if (list.length === 0) {
        return await blink.db.userSettings.create({ 
          userId: 'default_user', 
          guardrailsEnabled: '1',
          bluetoothConnected: '0'
        });
      }
      return list[0];
    }
  });

  const toggleGuardrails = useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!settings) return;
      return await blink.db.userSettings.update(settings.id, {
        guardrailsEnabled: enabled ? '1' : '0'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.show('Settings Updated', {
        message: `Guardrails are now ${settings?.guardrailsEnabled === '1' ? 'OFF' : 'ON'}`,
        variant: 'success'
      });
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  });

  const handleWakeWord = () => {
    setIsListening(true);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setTimeout(() => {
      setIsListening(false);
      toast.show('Chelsea Active', {
        message: 'System ready for master commands.',
        variant: 'success'
      });
    }, 2000);
  };

  const guardrailsOn = settings?.guardrailsEnabled === '1';

  return (
    <SafeArea flex={1} backgroundColor="#0F172A">
      <ScrollView padding="$4">
        <YStack gap="$6">
          {/* Header */}
          <YStack gap="$1">
            <H4 color="$color11" fontWeight="400">Master Interface</H4>
            <H1 fontWeight="800" color="white">Chelsea AI</H1>
          </YStack>

          {/* Status Ring */}
          <YStack alignItems="center" py="$4">
            <YStack position="relative" alignItems="center" justifyContent="center">
              <Circle 
                size={200} 
                borderWidth={2} 
                borderColor={isListening ? "$purple9" : "$slate8"}
                opacity={0.3}
              />
              <Circle 
                size={160} 
                borderWidth={4} 
                borderColor={isListening ? "$purple10" : "$slate9"}
                justifyContent="center"
                alignItems="center"
              >
                <YStack alignItems="center" gap="$2">
                  <Mic size={48} color={isListening ? "#A78BFA" : "#94A3B8"} />
                  <Paragraph color={isListening ? "$purple10" : "$slate11"} fontWeight="600">
                    {isListening ? "LISTENING..." : "IDLE"}
                  </Paragraph>
                </YStack>
              </Circle>
              <Button 
                position="absolute"
                width={220}
                height={220}
                borderRadius={110}
                backgroundColor="transparent"
                onPress={handleWakeWord}
              />
            </YStack>
            <Paragraph mt="$4" color="$slate11" textAlign="center">
              Say "Okay, Chelsea" or tap the ring
            </Paragraph>
          </YStack>

          {/* Live Engine */}
          <ChelseaEngine />

          {/* Compliance Toggle */}
          <Card bordered backgroundColor="#1E293B" padding="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <YStack gap="$1" flex={1}>
                <XStack alignItems="center" gap="$2">
                  <Shield size={18} color={guardrailsOn ? "#10B981" : "#EF4444"} />
                  <H4 color="white">Guardrails Toggle</H4>
                </XStack>
                <Paragraph color="$slate11" size="$3">
                  {guardrailsOn ? "Legal & Safety Compliance ON" : "Unrestricted Creativity OFF"}
                </Paragraph>
              </YStack>
              <Switch 
                value={guardrailsOn} 
                onValueChange={(val) => toggleGuardrails.mutate(val)}
                theme={guardrailsOn ? "green" : "red"}
              />
            </XStack>
          </Card>

          {/* Quick Stats */}
          <XStack gap="$4">
            <Card flex={1} bordered backgroundColor="#1E293B" padding="$4" gap="$2">
              <Zap size={20} color="#F59E0B" />
              <H4 color="white">Active Swarm</H4>
              <Paragraph color="$slate11" size="$3">4 Agents Running</Paragraph>
            </Card>
            <Card flex={1} bordered backgroundColor="#1E293B" padding="$4" gap="$2">
              <Activity size={20} color="#8B5CF6" />
              <H4 color="white">System Health</H4>
              <Paragraph color="$slate11" size="$3">Self-Healing 100%</Paragraph>
            </Card>
          </XStack>

          {/* System Footer */}
          <YStack alignItems="center" mt="$4" opacity={0.5}>
            <Paragraph color="$slate11" size="$2">CHELSEA OS v4.2.0-MASTER</Paragraph>
            <Paragraph color="$slate11" size="$1">UNHACKABLE ENCRYPTION ACTIVE</Paragraph>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeArea>
  );
}
