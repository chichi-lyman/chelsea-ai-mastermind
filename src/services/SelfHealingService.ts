import { blink } from '@/lib/blink';

export interface HealingResult {
  success: boolean;
  message: string;
  analysis?: string;
}

/**
 * Chelsea's Self-Healing Module.
 * Uses AI text generation (client-safe) to diagnose errors and produce
 * a targeted patch recommendation. The patch is logged and stored in the
 * system_logs table so operators can apply it.
 */
export const ChelseaHealer = async (
  error: string,
  stack?: string
): Promise<HealingResult> => {
  try {
    console.log('Self-Healing: Initializing diagnostic loop…');

    const { text } = await blink.ai.generateText({
      messages: [
        {
          role: 'system',
          content: `You are Chelsea's Self-Healing Module.
Analyse the reported runtime error and produce a concise, actionable repair plan.
Output format:
ROOT CAUSE: <one sentence>
AFFECTED FILE(S): <list>
PATCH: <exact code change or search-replace instruction>
CONFIDENCE: <HIGH|MEDIUM|LOW>`
        },
        {
          role: 'user',
          content: `ERROR: ${error}\nSTACK: ${stack ?? 'unavailable'}`
        }
      ]
    });

    // Persist the analysis to the system_logs table
    await blink.db.systemLogs.create({
      type: 'self_heal',
      message: text.slice(0, 500),
      status: 'resolved'
    });

    return {
      success: true,
      message: 'Chelsea diagnosed the error and logged a patch recommendation.',
      analysis: text
    };
  } catch (err: any) {
    console.error('Self-Healing Error:', err);
    return {
      success: false,
      message: `Diagnostic failed: ${err?.message ?? 'unknown error'}`
    };
  }
};
