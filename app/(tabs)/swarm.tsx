import React from 'react';
import { 
  YStack, 
  XStack, 
  H1, 
  H4, 
  Paragraph, 
  Card, 
  Avatar, 
  Progress, 
  Badge, 
  SafeArea, 
  ScrollView,
  Tabs as TabUI,
  Circle,
  Activity
} from '@blinkdotnew/mobile-ui';
import { useQuery } from '@tanstack/react-query';
import { blink } from '@/lib/blink';

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
    <SafeArea flex={1} backgroundColor="#0F172A">
      <ScrollView padding="$4">
        <YStack gap="$6">
          <YStack gap="$1">
            <H4 color="$color11" fontWeight="400">Agentic Architecture</H4>
            <H1 fontWeight="800" color="white">Sub-Agent Swarm</H1>
          </YStack>

          {/* Active Agents Grid */}
          <YStack gap="$4">
            <H4 color="$slate11">Specialized Units</H4>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap="$4">
                {agents?.map((agent: any) => (
                  <Card key={agent.id} width={200} bordered backgroundColor="#1E293B" padding="$4" gap="$3">
                    <XStack justifyContent="space-between" alignItems="flex-start">
                      <Avatar circular size="$5">
                        <Avatar.Image src={agent.imageUrl} />
                        <Avatar.Fallback backgroundColor="$slate8" />
                      </Avatar>
                      <Badge variant={agent.status === 'active' ? 'success' : 'warning'}>
                        {agent.status}
                      </Badge>
                    </XStack>
                    <YStack gap="$1">
                      <H4 color="white">{agent.name}</H4>
                      <Paragraph color="$slate11" size="$2" numberOfLines={2}>
                        {agent.role}
                      </Paragraph>
                    </YStack>
                    <Paragraph color="$purple10" size="$1" fontWeight="700">
                      {agent.capabilities?.split(',')[0]}
                    </Paragraph>
                  </Card>
                ))}
              </XStack>
            </ScrollView>
          </YStack>

          {/* Live Task Feed */}
          <YStack gap="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <H4 color="$slate11">Operational Tasks</H4>
              <Activity size={16} color="#8B5CF6" />
            </XStack>
            
            {tasks?.map((task: any) => (
              <Card key={task.id} bordered backgroundColor="#1E293B" padding="$4" gap="$3">
                <XStack justifyContent="space-between">
                  <YStack flex={1} gap="$1">
                    <H4 color="white">{task.title}</H4>
                    <Paragraph color="$slate11" size="$2">
                      Agent: {agents?.find((a: any) => a.id === task.agentId)?.name || 'Unknown'}
                    </Paragraph>
                  </YStack>
                  <Badge variant={task.status === 'completed' ? 'success' : 'info'}>
                    {task.status}
                  </Badge>
                </XStack>
                
                <YStack gap="$2">
                  <XStack justifyContent="space-between">
                    <Paragraph color="$slate11" size="$2">Progress</Paragraph>
                    <Paragraph color="white" size="$2" fontWeight="600">{task.progress}%</Paragraph>
                  </XStack>
                  <Progress value={task.progress}>
                    <Progress.Indicator backgroundColor="#8B5CF6" />
                  </Progress>
                </YStack>
              </Card>
            ))}
          </YStack>
        </YStack>
      </ScrollView>
    </SafeArea>
  );
}
