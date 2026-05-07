import React from 'react';
import { 
  YStack, 
  XStack, 
  H1, 
  H4, 
  Paragraph, 
  Card, 
  Button, 
  Badge, 
  SafeArea, 
  ScrollView,
  Circle,
  TrendingUp,
  DollarSign,
  Briefcase,
  Zap
} from '@blinkdotnew/mobile-ui';
import { useQuery } from '@tanstack/react-query';
import { blink } from '@/lib/blink';

import { WealthChart } from '@/components/WealthChart';

export default function WealthScreen() {
  const { data: opportunities } = useQuery({
    queryKey: ['wealth_opportunities'],
    queryFn: () => blink.db.wealthOpportunities.list()
  });

  return (
    <SafeArea flex={1} backgroundColor="#0F172A">
      <ScrollView padding="$4">
        <YStack gap="$6">
          <YStack gap="$1">
            <H4 color="$color11" fontWeight="400">Business Automation</H4>
            <H1 fontWeight="800" color="white">Wealth Engine</H1>
          </YStack>

          {/* Revenue Summary */}
          <Card bordered backgroundColor="#1E293B" padding="$5" gap="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <YStack>
                <Paragraph color="$slate11">Estimated Monthly Flow</Paragraph>
                <H1 color="white" fontWeight="900">$42,500.00</H1>
              </YStack>
              <Circle size={50} backgroundColor="$purple10">
                <TrendingUp size={24} color="white" />
              </Circle>
            </XStack>
            <XStack gap="$3">
              <Badge variant="success">Stripe Active</Badge>
              <Badge variant="info">5 Streams Connected</Badge>
            </XStack>
            <WealthChart />
          </Card>

          {/* Automated Opportunities */}
          <YStack gap="$4">
            <H4 color="$slate11">Income Flow Generation</H4>
            
            {opportunities?.map((opp: any) => (
              <Card key={opp.id} bordered backgroundColor="#1E293B" padding="$4" gap="$3">
                <XStack justifyContent="space-between" alignItems="flex-start">
                  <YStack flex={1} gap="$1">
                    <H4 color="white">{opp.title}</H4>
                    <Paragraph color="$slate11" size="$2">
                      {opp.description}
                    </Paragraph>
                  </YStack>
                  <YStack alignItems="flex-end" gap="$2">
                    <H4 color="#10B981" fontWeight="800">{opp.potentialRevenue}</H4>
                    <Badge variant={opp.status === 'active' ? 'success' : 'warning'}>
                      {opp.status}
                    </Badge>
                  </YStack>
                </XStack>
                <XStack gap="$2" mt="$2">
                  <Button size="$2" theme="active" icon={<Zap size={14} />}>
                    Accelerate
                  </Button>
                  <Button size="$2" variant="outline" icon={<Briefcase size={14} />}>
                    Details
                  </Button>
                </XStack>
              </Card>
            ))}
          </YStack>

          {/* Global Reach */}
          <Card bordered backgroundColor="#1E293B" padding="$4" gap="$3">
            <XStack alignItems="center" gap="$3">
              <Circle size={40} backgroundColor="$slate8">
                <DollarSign size={20} color="white" />
              </Circle>
              <YStack>
                <H4 color="white">Automated Payouts</H4>
                <Paragraph color="$slate11" size="$2">Connected to master bank account</Paragraph>
              </YStack>
            </XStack>
          </Card>
        </YStack>
      </ScrollView>
    </SafeArea>
  );
}
