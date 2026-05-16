import React from 'react';
import { 
  YStack, 
  XStack, 
  H1, 
  H4, 
  Paragraph, 
  Avatar, 
  Progress, 
  Badge, 
  SafeArea, 
  ScrollView,
  Circle,
  Activity
} from '@blinkdotnew/mobile-ui';
import { useQuery } from '@tanstack/react-query';
import { blink } from '@/lib/blink';
import { GlassCard } from '@/src/components/GlassCard';

export default function SwarmScreen() {
  const { data: agents } = useQuery({
    queryKey: ['agents'],
    queryFn: () => blink.db.agents.list()
  });

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => blink.db.tasks.list({ orderBy: { createdAt: 'desc' } })
  });

  return (
    <SafeArea flex={1} backgroundColor="transparent">
      <ScrollView padding="$4" contentContainerStyle={{ paddingBottom: 100 }}>
        <YStack gap="$6">
          <YStack gap="$1" pt="$4">
            <H4 color="rgba(255,255,255,0.5)" fontWeight="400" letterSpacing={1}>AGENTIC ARCHITECTURE</H4>
            <H1 fontWeight="900" color="white" size="$10">Sub-Agent Swarm</H1>
          </YStack>

          {/* Active Agents Grid */}
          <YStack gap="$4">
            <H4 color="rgba(255,255,255,0.5)" letterSpacing={1} size="$2">SPECIALIZED UNITS</H4>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap="$4" paddingVertical="$2">
                {agents?.map((agent: any) => (
                  <GlassCard key={agent.id} title={agent.status.toUpperCase()} accent={agent.status === 'active' ? '#10B981' : '#F59E0B'}>
                    <YStack width={180} gap="$3">
                      <Avatar circular size="$5" borderWidth={1} borderColor="rgba(255,255,255,0.1)">
                        <Avatar.Image src={agent.imageUrl} />
                        <Avatar.Fallback backgroundColor="rgba(255,255,255,0.1)" />
                      </Avatar>
                      <YStack gap="$1">
                        <H4 color="white" fontWeight="700">{agent.name}</H4>
                        <Paragraph color="rgba(255,255,255,0.5)" size="$2" numberOfLines={2}>
                          {agent.role}
                        </Paragraph>
                      </YStack>
                      <Paragraph color="#A78BFA" size="$1" fontWeight="800" letterSpacing={1}>
                        {agent.capabilities?.split(',')[0]}
                      </Paragraph>
                    </YStack>
                  </GlassCard>
                ))}
              </XStack>
            </ScrollView>
          </YStack>

          {/* Live Task Feed */}
          <YStack gap="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <H4 color="rgba(255,255,255,0.5)" letterSpacing={1} size="$2">OPERATIONAL TASKS</H4>
              <Activity size={16} color="#A78BFA" />
            </XStack>
            
            {tasks?.map((task: any) => (
              <GlassCard key={task.id} title={task.status.toUpperCase()} accent={task.status === 'completed' ? '#10B981' : '#A78BFA'}>
                <YStack gap="$3">
                  <XStack justifyContent="space-between">
                    <YStack flex={1} gap="$1">
                      <H4 color="white" fontWeight="700">{task.title}</H4>
                      <Paragraph color="rgba(255,255,255,0.5)" size="$2">
                        Agent: {agents?.find((a: any) => a.id === task.agentId)?.name || 'Unknown'}
                      </Paragraph>
                    </YStack>
                  </XStack>
                  
                  <YStack gap="$2">
                    <XStack justifyContent="space-between">
                      <Paragraph color="rgba(255,255,255,0.5)" size="$2">Progress</Paragraph>
                      <Paragraph color="white" size="$2" fontWeight="700">{task.progress}%</Paragraph>
                    </XStack>
                    <Progress value={task.progress} height={6} backgroundColor="rgba(255,255,255,0.05)">
                      <Progress.Indicator backgroundColor="#A78BFA" />
                    </Progress>
                  </YStack>
                </YStack>
              </GlassCard>
            ))}
          </YStack>
        </YStack>
      </ScrollView>
    </SafeArea>
  );
}

