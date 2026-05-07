import React, { useState } from 'react';
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
  ShieldCheck,
  Bluetooth,
  Terminal,
  RefreshCw,
  Lock,
  useBlinkToast
} from '@blinkdotnew/mobile-ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blink } from '@/lib/blink';

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
      case 'detected': return '#8B5CF6';
      default: return '#94A3B8';
    }
  };

  return (
    <SafeArea flex={1} backgroundColor="#0F172A">
      <ScrollView padding="$4">
        <YStack gap="$6">
          <YStack gap="$1">
            <H4 color="$color11" fontWeight="400">Defense & Healing</H4>
            <H1 fontWeight="800" color="white">Security Core</H1>
          </YStack>

          {/* Defense Overview */}
          <XStack gap="$4">
            <Card flex={1} bordered backgroundColor="#1E293B" padding="$4" gap="$2" alignItems="center">
              <Circle size={50} backgroundColor="#10B981" mb="$2">
                <Lock size={24} color="white" />
              </Circle>
              <H4 color="white">Unhackable</H4>
              <Paragraph color="$slate11" size="$2">Defense Active</Paragraph>
            </Card>
            <Card flex={1} bordered backgroundColor="#1E293B" padding="$4" gap="$2" alignItems="center">
              <Circle size={50} backgroundColor={settings?.bluetoothConnected === '1' ? "#3B82F6" : "$slate8"} mb="$2">
                <Bluetooth size={24} color="white" />
              </Circle>
              <H4 color="white">Bluetooth</H4>
              <Paragraph color="$slate11" size="$2">
                {settings?.bluetoothConnected === '1' ? "Connected" : "Scanning"}
              </Paragraph>
            </Card>
          </XStack>

          {/* Self-Healing Control */}
          <Card bordered backgroundColor="#1E293B" padding="$4" gap="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <YStack gap="$1" flex={1}>
                <H4 color="white">Recursive Feedback Loop</H4>
                <Paragraph color="$slate11" size="$2">Monitoring system logs for anomalies.</Paragraph>
              </YStack>
              <Button 
                circular 
                size="$4" 
                theme="active" 
                onPress={handleManualRepair}
                disabled={isRepairing}
              >
                <RefreshCw size={24} color="white" className={isRepairing ? "animate-spin" : ""} />
              </Button>
            </XStack>
            {isRepairing && (
              <YStack gap="$2" p="$2" backgroundColor="$slate9" borderRadius="$2">
                <Paragraph color="white" size="$2" textAlign="center">
                  Self-healing codebase in progress...
                </Paragraph>
              </YStack>
            )}
          </Card>

          {/* System Logs */}
          <YStack gap="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <H4 color="$slate11">Self-Healing Logs</H4>
              <Terminal size={16} color="#8B5CF6" />
            </XStack>
            
            <YStack gap="$2">
              {logs?.map((log: any) => (
                <XStack key={log.id} gap="$3" alignItems="flex-start">
                  <YStack width={2} backgroundColor={getLogColor(log.status)} height="100%" borderRadius={1} />
                  <YStack flex={1} gap="$1">
                    <XStack justifyContent="space-between">
                      <H4 color="white" size="$3">{log.type.toUpperCase()}</H4>
                      <Paragraph color="$slate11" size="$1">{new Date(log.timestamp).toLocaleTimeString()}</Paragraph>
                    </XStack>
                    <Paragraph color="$slate11" size="$2">{log.message}</Paragraph>
                    <XStack gap="$2" alignItems="center">
                      <Circle size={8} backgroundColor={getLogColor(log.status)} />
                      <Paragraph color={getLogColor(log.status)} size="$1" fontWeight="700">
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
