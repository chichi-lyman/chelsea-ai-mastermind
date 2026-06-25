import React, { useState, useEffect, useRef } from 'react';
import {
  YStack,
  XStack,
  Paragraph,
  SizableText,
  Circle,
} from '@blinkdotnew/mobile-ui';
import { Shield, Zap, TrendingUp, Cpu } from '@blinkdotnew/mobile-ui';
import { blink } from '@/lib/blink';

interface ChelseaEngineProps {
  /** Spoken/typed command to process. Set to a new string to trigger AI. */
  command?: string;
  /** Called with Chelsea's response text so the parent can trigger TTS. */
  onResponse?: (text: string) => void;
}

const IDLE_STEPS = [
  { label: 'Analyzing Market Anomalies',   icon: <TrendingUp size={16} color="#A78BFA" /> },
  { label: 'Syncing Intelligence Engine',  icon: <Cpu       size={16} color="#3B82F6" /> },
  { label: 'Verifying Security Protocols', icon: <Shield    size={16} color="#10B981" /> },
  { label: 'Optimizing Self-Healing Paths',icon: <Zap       size={16} color="#8B5CF6" /> },
];

export const ChelseaEngine: React.FC<ChelseaEngineProps> = ({ command, onResponse }) => {
  const [activeStep, setActiveStep]   = useState(0);
  const [isThinking, setIsThinking]   = useState(false);
  const [aiResponse, setAiResponse]   = useState<string>('');
  const prevCommand                   = useRef<string | undefined>(undefined);

  // Cycle idle steps when not actively processing a command
  useEffect(() => {
    if (isThinking || aiResponse) return;
    const id = setInterval(() => setActiveStep((p) => (p + 1) % IDLE_STEPS.length), 3000);
    return () => clearInterval(id);
  }, [isThinking, aiResponse]);

  // Run AI when command changes
  useEffect(() => {
    if (!command || command === prevCommand.current) return;
    prevCommand.current = command;

    const run = async () => {
      setIsThinking(true);
      setAiResponse('');
      try {
        const { text } = await blink.ai.generateText({
          messages: [
            {
              role: 'system',
              content: `You are Chelsea, an advanced autonomous AI OS.
You manage sub-agents, analyze opportunities, and execute strategic commands.
Be concise, direct, and powerful. Max 2 sentences.`,
            },
            { role: 'user', content: command },
          ],
        });
        setAiResponse(text);
        onResponse?.(text);
      } catch (err: any) {
        const fallback = 'Command received. Executing autonomously.';
        setAiResponse(fallback);
        onResponse?.(fallback);
      } finally {
        setIsThinking(false);
        // Clear response card after 8 s so idle steps resume
        setTimeout(() => setAiResponse(''), 8000);
      }
    };

    run();
  }, [command, onResponse]);

  // ── Render ────────────────────────────────────────────────────────────────

  if (isThinking) {
    return (
      <YStack gap="$3" paddingVertical="$1">
        <XStack gap="$3" alignItems="center">
          <Circle
            size={8}
            backgroundColor="#F59E0B"
            style={{ shadowColor: '#F59E0B', shadowRadius: 6, shadowOpacity: 0.8 }}
          />
          <SizableText color="white" fontWeight="800" size="$2" letterSpacing={1}>
            PROCESSING
          </SizableText>
        </XStack>

        <XStack
          gap="$3"
          alignItems="center"
          backgroundColor="rgba(245,158,11,0.08)"
          padding="$3"
          borderRadius="$3"
          borderWidth={1}
          borderColor="rgba(245,158,11,0.2)"
        >
          <Cpu size={16} color="#F59E0B" />
          <Paragraph color="#F59E0B" size="$3" fontWeight="600">
            Chelsea is thinking…
          </Paragraph>
        </XStack>

        <XStack gap="$1.5" mt="$1">
          {[0, 1, 2, 3].map((i) => (
            <YStack
              key={i}
              flex={1}
              height={3}
              backgroundColor={i % 2 === 0 ? '#F59E0B' : 'rgba(255,255,255,0.1)'}
              borderRadius={2}
              animation="bouncy"
            />
          ))}
        </XStack>
      </YStack>
    );
  }

  if (aiResponse) {
    return (
      <YStack gap="$3" paddingVertical="$1">
        <XStack gap="$3" alignItems="center">
          <Circle
            size={8}
            backgroundColor="#10B981"
            style={{ shadowColor: '#10B981', shadowRadius: 6, shadowOpacity: 0.8 }}
          />
          <SizableText color="white" fontWeight="800" size="$2" letterSpacing={1}>
            CHELSEA RESPONDED
          </SizableText>
        </XStack>

        <XStack
          gap="$3"
          alignItems="flex-start"
          backgroundColor="rgba(16,185,129,0.08)"
          padding="$3"
          borderRadius="$3"
          borderWidth={1}
          borderColor="rgba(16,185,129,0.2)"
        >
          <Shield size={16} color="#10B981" style={{ marginTop: 2 }} />
          <Paragraph color="white" size="$3" fontWeight="500" flex={1}>
            {aiResponse}
          </Paragraph>
        </XStack>

        <XStack gap="$1.5" mt="$1">
          {[0, 1, 2, 3].map((i) => (
            <YStack
              key={i}
              flex={1}
              height={3}
              backgroundColor="#10B981"
              borderRadius={2}
            />
          ))}
        </XStack>
      </YStack>
    );
  }

  // Idle state
  return (
    <YStack gap="$3" paddingVertical="$1">
      <XStack gap="$3" alignItems="center">
        <Circle
          size={8}
          backgroundColor="#A78BFA"
          style={{ shadowColor: '#A78BFA', shadowRadius: 4, shadowOpacity: 0.5 }}
        />
        <SizableText color="white" fontWeight="800" size="$2" letterSpacing={1}>
          ENGINE LIVE
        </SizableText>
      </XStack>

      <XStack
        gap="$3"
        alignItems="center"
        backgroundColor="rgba(255,255,255,0.05)"
        padding="$3"
        borderRadius="$3"
      >
        {IDLE_STEPS[activeStep].icon}
        <Paragraph color="white" size="$3" fontWeight="500">
          {IDLE_STEPS[activeStep].label}
        </Paragraph>
      </XStack>

      <XStack gap="$1.5" mt="$1">
        {[0, 1, 2, 3].map((i) => (
          <YStack
            key={i}
            flex={1}
            height={3}
            backgroundColor={i === activeStep ? '#A78BFA' : 'rgba(255,255,255,0.1)'}
            borderRadius={2}
          />
        ))}
      </XStack>
    </YStack>
  );
};
