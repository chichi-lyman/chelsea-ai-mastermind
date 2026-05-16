import React from 'react';
import { 
  YStack, 
  XStack, 
  H1, 
  H4, 
  Paragraph, 
  Button, 
  Badge, 
  SafeArea, 
  ScrollView,
  Circle,
  TrendingUp,
  Briefcase,
  Zap,
  DollarSign
} from '@blinkdotnew/mobile-ui';
import { useQuery } from '@tanstack/react-query';
import { blink } from '@/lib/blink';

import { WealthChart } from '@/components/WealthChart';
import { GlassCard } from '@/src/components/GlassCard';

export default function WealthScreen() {
  const { data: opportunities } = useQuery({
    queryKey: ['wealth_opportunities'],
    queryFn: () => blink.db.wealthOpportunities.list()
  });

  return (
    <SafeArea flex={1} backgroundColor="transparent">
      <ScrollView padding="$4" contentContainerStyle={{ paddingBottom: 100 }}>
        <YStack gap="$6">
          <YStack gap="$1" pt="$4">
            <H4 color="rgba(255,255,255,0.5)" fontWeight="400" letterSpacing={1}>BUSINESS AUTOMATION</H4>
            <H1 fontWeight="900" color="white" size="$10">Wealth Engine</H1>
          </YStack>

          {/* Revenue Summary */}
          <GlassCard title="Revenue Stream" accent="#10B981">
            <YStack gap="$4">
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <Paragraph color="rgba(255,255,255,0.5)">Monthly Revenue Flow</Paragraph>
                  <H1 color="white" fontWeight="900" size="$9">$42,500.00</H1>
                </YStack>
                <Circle size={50} backgroundColor="rgba(167, 139, 250, 0.2)" borderWidth={1} borderColor="#A78BFA">
                  <TrendingUp size={24} color="#A78BFA" />
                </Circle>
              </XStack>
              <XStack gap="$3">
                <Badge variant="success">Stripe Active</Badge>
                <Badge variant="info">5 Streams Connected</Badge>
              </XStack>
              <WealthChart />
            </YStack>
          </GlassCard>

          {/* Automated Opportunities */}
          <YStack gap="$4">
            <H4 color="rgba(255,255,255,0.5)" letterSpacing={1} size="$2">INCOME FLOW GENERATION</H4>
            
            {opportunities?.map((opp: any) => (
              <GlassCard key={opp.id} title={opp.status.toUpperCase()} accent={opp.status === 'active' ? '#10B981' : '#F59E0B'}>
                <YStack gap="$3">
                  <XStack justifyContent="space-between" alignItems="flex-start">
                    <YStack flex={1} gap="$1">
                      <H4 color="white" fontWeight="700">{opp.title}</H4>
                      <Paragraph color="rgba(255,255,255,0.6)" size="$2">
                        {opp.description}
                      </Paragraph>
                    </YStack>
                    <H4 color="#10B981" fontWeight="900" size="$6">{opp.potentialRevenue}</H4>
                  </XStack>
                  <XStack gap="$2" mt="$1">
                    <Button size="$2" theme="active" icon={<Zap size={14} />} borderRadius="$2">
                      Accelerate
                    </Button>
                    <Button size="$2" variant="outline" icon={<Briefcase size={14} />} borderRadius="$2">
                      Details
                    </Button>
                  </XStack>
                </YStack>
              </GlassCard>
            ))}
          </YStack>

          {/* Global Reach */}
          <GlassCard title="Payout System" accent="#3B82F6">
            <XStack alignItems="center" gap="$3">
              <Circle size={40} backgroundColor="rgba(59, 130, 246, 0.1)" borderWidth={1} borderColor="#3B82F6">
                <DollarSign size={20} color="#3B82F6" />
              </Circle>
              <YStack>
                <H4 color="white" fontWeight="700">Automated Payouts</H4>
                <Paragraph color="rgba(255,255,255,0.5)" size="$2">Connected to master bank account</Paragraph>
              </YStack>
            </XStack>
          </GlassCard>
        </YStack>
      </ScrollView>
    </SafeArea>
  );
}

