import React, { useState, useEffect } from 'react';
import { 
  YStack, 
  XStack, 
  Paragraph, 
  SizableText, 
  Circle,
  AnimatePresence,
  Theme
} from '@blinkdotnew/mobile-ui';
import { Shield, Zap, TrendingUp, Cpu } from '@blinkdotnew/mobile-ui';

export const ChelseaEngine = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { label: 'Analyzing Market Anomalies', icon: <TrendingUp size={16} color="#A78BFA" /> },
    { label: 'Syncing Sub-Agent Swarm', icon: <Zap size={16} color="#8B5CF6" /> },
    { label: 'Verifying Security Protocols', icon: <Shield size={16} color="#10B981" /> },
    { label: 'Optimizing Neural Paths', icon: <Cpu size={16} color="#3B82F6" /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <YStack gap="$3" paddingVertical="$1">
      <XStack gap="$3" alignItems="center">
        <Circle size={8} backgroundColor="#A78BFA" style={{ shadowColor: '#A78BFA', shadowRadius: 4, shadowOpacity: 0.5 }} />
        <SizableText color="white" fontWeight="800" size="$2" letterSpacing={1}>ENGINE LIVE</SizableText>
      </XStack>
      
      <XStack gap="$3" alignItems="center" backgroundColor="rgba(255,255,255,0.05)" padding="$3" borderRadius="$3">
        {steps[activeStep].icon}
        <Paragraph color="white" size="$3" fontWeight="500">
          {steps[activeStep].label}
        </Paragraph>
      </XStack>

      <XStack gap="$1.5" mt="$1">
        {[0, 1, 2, 3].map((i) => (
          <YStack 
            key={i} 
            flex={1} 
            height={3} 
            backgroundColor={i === activeStep ? "#A78BFA" : "rgba(255,255,255,0.1)"} 
            borderRadius={2}
          />
        ))}
      </XStack>
    </YStack>
  );
};

