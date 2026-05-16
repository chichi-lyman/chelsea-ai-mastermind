import React, { useState } from 'react';
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
  ShieldCheck,
  Bluetooth,
  Terminal,
  RefreshCw,
  Lock,
  useBlinkToast
} from '@blinkdotnew/mobile-ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blink } from '@/lib/blink';
import { GlassCard } from '@/src/components/GlassCard';

export default function SecurityScreen() {
  const toast = useBlinkToast();
  const queryClient = useQueryClient();
  const [isRepairing, setIsRepairing] = useState(false);

  const { data: logs } = useQuery({
    queryKey: ['system_logs'],
    queryFn: () => blink.db.systemLogs.list({ orderBy: { timestamp: 'desc' } })
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const list = await blink.db.userSettings.list();
      return list[0];
    }
  });

  const handleManualRepair = () => {
    setIsRepairing(true);
    setTimeout(() => {
      setIsRepairing(false);
      toast.show('System Healed', {
        message: 'All codebase anomalies resolved.',
        variant: 'success'
      });
    }, 3000);
  };

  const getLogColor = (status: string) => {
    switch (status) {
      case 'resolved': return '#10B981';
      case 'blocked': return '#EF4444';
      case 'fixing': return '#F59E0B';
      case 'detected': return '#A78BFA';
      default: return 'rgba(255,255,255,0.4)';
    }
  };

  return (
    <SafeArea flex={1} backgroundColor="transparent">
      <ScrollView padding="$4" contentContainerStyle={{ paddingBottom: 100 }}>
        <YStack gap="$6">
          <YStack gap="$1" pt="$4">
            <H4 color="rgba(255,255,255,0.5)" fontWeight="400" letterSpacing={1}>DEFENSE & HEALING</H4>
            <H1 fontWeight="900" color="white" size="$10">Security Core</H1>
          </YStack>

          {/* Defense Overview */}
          <XStack gap="$4">
            <GlassCard title="Defense" accent="#10B981">
              <YStack gap="$2" alignItems="center" width={140}>
                <Circle size={50} backgroundColor="rgba(16, 185, 129, 0.1)" borderWidth={1} borderColor="#10B981" mb="$2">
                  <Lock size={24} color="#10B981" />
                </Circle>
                <H4 color="white" fontWeight="700">Unhackable</H4>
                <Paragraph color="rgba(255,255,255,0.5)" size="$2">Defense Active</Paragraph>
              </YStack>
            </GlassCard>
            <GlassCard title="Mobility" accent={settings?.bluetoothConnected === '1' ? "#3B82F6" : "rgba(255,255,255,0.2)"}>
              <YStack gap="$2" alignItems="center" width={140}>
                <Circle size={50} backgroundColor={settings?.bluetoothConnected === '1' ? "rgba(59, 130, 246, 0.1)" : "rgba(255,255,255,0.05)"} borderWidth={1} borderColor={settings?.bluetoothConnected === '1' ? "#3B82F6" : "rgba(255,255,255,0.2)"} mb="$2">
                  <Bluetooth size={24} color={settings?.bluetoothConnected === '1' ? "#3B82F6" : "rgba(255,255,255,0.4)"} />
                </Circle>
                <H4 color="white" fontWeight="700">Bluetooth</H4>
                <Paragraph color="rgba(255,255,255,0.5)" size="$2">
                  {settings?.bluetoothConnected === '1' ? "Connected" : "Scanning"}
                </Paragraph>
              </YStack>
            </GlassCard>
          </XStack>

          {/* Self-Healing Control */}
          <GlassCard title="System Repair" accent="#A78BFA">
            <XStack justifyContent="space-between" alignItems="center">
              <YStack gap="$1" flex={1}>
                <H4 color="white" fontWeight="700">Feedback Loop</H4>
                <Paragraph color="rgba(255,255,255,0.5)" size="$2">Autonomous codebase healing active.</Paragraph>
              </YStack>
              <Button 
                circular 
                size="$4" 
                theme="active" 
                onPress={handleManualRepair}
                disabled={isRepairing}
                borderRadius="$4"
              >
                <RefreshCw size={24} color="white" className={isRepairing ? "animate-spin" : ""} />
              </Button>
            </XStack>
            {isRepairing && (
              <YStack gap="$2" mt="$4" p="$3" backgroundColor="rgba(167, 139, 250, 0.1)" borderRadius="$3" borderWidth={1} borderColor="rgba(167, 139, 250, 0.2)">
                <Paragraph color="#A78BFA" size="$2" textAlign="center" fontWeight="600">
                  Resolving anomalies in realtime...
                </Paragraph>
              </YStack>
            )}
          </GlassCard>

          {/* System Logs */}
          <YStack gap="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <H4 color="rgba(255,255,255,0.5)" letterSpacing={1} size="$2">HEALING LOGS</H4>
              <Terminal size={16} color="#A78BFA" />
            </XStack>
            
            <YStack gap="$3">
              {logs?.map((log: any) => (
                <XStack key={log.id} gap="$3" alignItems="flex-start" backgroundColor="rgba(255,255,255,0.03)" padding="$3" borderRadius="$3" borderWidth={1} borderColor="rgba(255,255,255,0.05)">
                  <YStack width={3} backgroundColor={getLogColor(log.status)} height="100%" borderRadius={1.5} />
                  <YStack flex={1} gap="$1">
                    <XStack justifyContent="space-between">
                      <H4 color="white" size="$2" fontWeight="700" letterSpacing={0.5}>{log.type.toUpperCase()}</H4>
                      <Paragraph color="rgba(255,255,255,0.3)" size="$1">{new Date(log.timestamp).toLocaleTimeString()}</Paragraph>
                    </XStack>
                    <Paragraph color="rgba(255,255,255,0.6)" size="$2" mt="$1">{log.message}</Paragraph>
                    <XStack gap="$2" alignItems="center" mt="$2">
                      <Circle size={6} backgroundColor={getLogColor(log.status)} />
                      <Paragraph color={getLogColor(log.status)} size="$1" fontWeight="800" letterSpacing={1}>
                        {log.status.toUpperCase()}
                      </Paragraph>
                    </XStack>
                  </YStack>
                </XStack>
              ))}
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeArea>
  );
}

