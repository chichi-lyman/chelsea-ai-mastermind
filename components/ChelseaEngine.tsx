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
    { label: 'Analyzing Market Anomalies', icon: <TrendingUp size={16} /> },
    { label: 'Syncing Sub-Agent Swarm', icon: <Zap size={16} /> },
    { label: 'Verifying Security Protocols', icon: <Shield size={16} /> },
    { label: 'Optimizing Neural Paths', icon: <Cpu size={16} /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <YStack gap="$2" padding="$3" backgroundColor="#1E293B" borderRadius="$4" bordered>
      <XStack gap="$3" alignItems="center">
        <Circle size={8} backgroundColor="#A78BFA" />
        <SizableText color="white" fontWeight="700" size="$3">CHELSEA ENGINE LIVE</SizableText>
      </XStack>
      
      <XStack gap="$2" alignItems="center">
        {steps[activeStep].icon}
        <Paragraph color="$slate11" size="$2">
          {steps[activeStep].label}...
        </Paragraph>
      </XStack>

      <XStack gap="$1" mt="$1">
        {[0, 1, 2, 3].map((i) => (
          <YStack 
            key={i} 
            flex={1} 
            height={4} 
            backgroundColor={i === activeStep ? "#A78BFA" : "$slate8"} 
            borderRadius={2}
          />
        ))}
      </XStack>
    </YStack>
  );
};
