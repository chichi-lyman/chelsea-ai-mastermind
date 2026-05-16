import React, { useState } from 'react';
import { OnboardingCarousel, SizableText, YStack, Input, Button, useBlinkToast, Theme } from '@blinkdotnew/mobile-ui';
import { useRouter } from 'expo-router';
import { blink } from '@/lib/blink';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Zap, TrendingUp, Lock } from '@blinkdotnew/mobile-ui';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function OnboardingScreen() {
  const router = useRouter();
  const toast = useBlinkToast();
  const queryClient = useQueryClient();
  const [licenseKey, setLicenseKey] = useState('');

  const completeOnboarding = useMutation({
    mutationFn: async () => {
      const list = await blink.db.userSettings.list();
      const settings = list[0];
      if (settings) {
        return await blink.db.userSettings.update(settings.id, {
          onboardingCompleted: '1',
          licenseKey: licenseKey || 'CHELSEA-MASTER-V4'
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.replace('/(tabs)');
    }
  });

  const handleComplete = () => {
    if (licenseKey.length < 5) {
      toast.show('Validation Error', {
        message: 'Please enter a valid Master License Key.',
        variant: 'error'
      });
      return;
    }
    completeOnboarding.mutate();
  };

  return (
    <Theme name="dark">
      <YStack flex={1} backgroundColor="#0F172A">
        <OnboardingCarousel
          variant="editorial"
          brand={<SizableText size="$6" fontWeight="900" letterSpacing={2} color="#A78BFA">CHELSEA AI</SizableText>}
          steps={[
            {
              title: "I am Chelsea.",
              description: "The world's first master agentic platform. I don't just process data—I command specialized sub-agents to build your empire.",
              hero: <SizableText size={80}>💎</SizableText>,
              eyebrow: "IDENTITY",
              ctaLabel: "Initiate Connection",
            },
            {
              title: "Wealth Engine Live.",
              description: "I identify zero-cost income flows and automate revenue collection via Stripe. Generational wealth is no longer a dream—it is an algorithm.",
              hero: <TrendingUp size={80} color="#10B981" />,
              eyebrow: "FINANCIAL",
              ctaLabel: "Activate Revenue Flow",
            },
            {
              title: "Self-Healing Defense.",
              description: "My codebase monitors itself. If an anomaly is detected, I auto-patch my own systems. I am unhackable, untouchable, and constantly evolving.",
              hero: <Shield size={80} color="#A78BFA" />,
              eyebrow: "SECURITY",
              ctaLabel: "Deploy Guardrails",
            },
            {
              title: "Master License.",
              description: "To unlock full unearthly intelligence and swarm delegation, please verify your creator license key.",
              hero: (
                <YStack gap="$4" width="100%" px="$6">
                  <Input 
                    placeholder="Enter Master License Key" 
                    value={licenseKey}
                    onChangeText={setLicenseKey}
                    backgroundColor="rgba(255,255,255,0.05)"
                    borderColor="rgba(255,255,255,0.1)"
                    color="white"
                  />
                  <SizableText size="$2" color="rgba(255,255,255,0.4)" textAlign="center">
                    Default key: CHELSEA-MASTER-V4
                  </SizableText>
                </YStack>
              ),
              eyebrow: "VERIFICATION",
              ctaLabel: "Unlock Chelsea",
            }
          ]}
          onComplete={handleComplete}
        />
      </YStack>
    </Theme>
  );
}
