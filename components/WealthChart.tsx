import React from 'react';
import { 
  YStack, 
  XStack, 
  Paragraph, 
  SizableText, 
} from '@blinkdotnew/mobile-ui';

export const WealthChart = () => {
  const data = [40, 60, 45, 80, 70, 95, 100]; // Simulated growth
  
  return (
    <YStack gap="$2" mt="$4">
      <XStack justifyContent="space-between" alignItems="flex-end" height={100} gap="$1">
        {data.map((val, i) => (
          <YStack 
            key={i} 
            flex={1} 
            backgroundColor={i === data.length - 1 ? "#10B981" : "#8B5CF6"} 
            height={`${val}%`} 
            borderRadius={4}
            opacity={0.5 + (i * 0.08)}
          />
        ))}
      </XStack>
      <XStack justifyContent="space-between">
        <Paragraph color="$slate11" size="$1">Mon</Paragraph>
        <Paragraph color="$slate11" size="$1">Today</Paragraph>
      </XStack>
    </YStack>
  );
};
