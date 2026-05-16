import React, { useState, useEffect } from 'react';
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
  Activity,
  Shield,
  Zap,
  ScrollView,
  Theme
} from '@blinkdotnew/mobile-ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blink } from '@/lib/blink';
import * as Haptics from 'expo-haptics';
import { Platform, View, StyleSheet } from 'react-native';

import { ChelseaEngine } from '@/components/ChelseaEngine';
import { GlassCard } from '@/src/components/GlassCard';
import { colors } from '@/constants/design';

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
    <SafeArea flex={1} backgroundColor="transparent">
      <ScrollView padding="$4" contentContainerStyle={{ paddingBottom: 100 }}>
        <YStack gap="$6">
          {/* Header */}
          <YStack gap="$1" pt="$4">
            <H4 color="rgba(255,255,255,0.5)" fontWeight="400" letterSpacing={1}>MASTER INTERFACE</H4>
            <H1 fontWeight="900" color="white" size="$10">Chelsea AI</H1>
          </YStack>

          {/* Status Ring */}
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
                borderColor={isListening ? "#A78BFA" : "rgba(255,255,255,0.15)"}
                justifyContent="center"
                alignItems="center"
                style={{
                  shadowColor: isListening ? "#A78BFA" : "transparent",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 15,
                }}
              >
                <YStack alignItems="center" gap="$2">
                  <Mic size={48} color={isListening ? "#A78BFA" : "rgba(255,255,255,0.4)"} />
                  <Paragraph color={isListening ? "#A78BFA" : "rgba(255,255,255,0.4)"} fontWeight="800" letterSpacing={2} size="$1">
                    {isListening ? "LISTENING" : "READY"}
                  </Paragraph>
                </YStack>
              </Circle>
              <Button 
                position="absolute"
                width={240}
                height={240}
                borderRadius={120}
                backgroundColor="transparent"
                onPress={handleWakeWord}
              />
            </YStack>
            <Paragraph mt="$4" color="rgba(255,255,255,0.4)" textAlign="center" fontWeight="500">
              "Okay, Chelsea"
            </Paragraph>
          </YStack>

          {/* Live Engine */}
          <GlassCard title="Engine Status" accent="#A78BFA">
            <ChelseaEngine />
          </GlassCard>

          {/* Compliance Toggle */}
          <GlassCard title="Security Protocols" accent={guardrailsOn ? "#10B981" : "#EF4444"}>
            <XStack justifyContent="space-between" alignItems="center">
              <YStack gap="$1" flex={1}>
                <H4 color="white" fontWeight="700">Guardrails Mode</H4>
                <Paragraph color="rgba(255,255,255,0.5)" size="$3">
                  {guardrailsOn ? "Safe Mode Active" : "Unrestricted Access"}
                </Paragraph>
              </YStack>
              <Switch 
                value={guardrailsOn} 
                onValueChange={(val) => toggleGuardrails.mutate(val)}
                theme={guardrailsOn ? "green" : "red"}
              />
            </XStack>
          </GlassCard>

          {/* Quick Stats */}
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

          {/* System Footer */}
          <YStack alignItems="center" mt="$4" opacity={0.3}>
            <Paragraph color="white" size="$1" letterSpacing={1}>CHELSEA OS v4.5.0-GLASS</Paragraph>
            <Paragraph color="white" size="$1" letterSpacing={1}>LIQUID INTERFACE DEPLOYED</Paragraph>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeArea>
  );
}

