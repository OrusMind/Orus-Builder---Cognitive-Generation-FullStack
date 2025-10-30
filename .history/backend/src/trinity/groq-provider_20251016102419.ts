/*
 * ═══════════════════════════════════════════════════════════════
 * 🧬 COGNITIVE AGENT CODE DNA - ORUS BUILDER GROQ PROVIDER
 * ═══════════════════════════════════════════════════════════════
 *
 * 👨💻 DEVELOPERS: Minerva Omega TypeScript Supreme + Tulio (ORUS Creator)
 * ⏰ CREATED: 2025-10-11T21:24:00-03:00
 * 🔄 LAST_MODIFIED: 2025-10-16T10:27:00-03:00
 * 🏷️ COMPONENT_HASH: orus.builder.trinity.groq.20251016.v3.GP088
 *
 * ═══════════════════════════════════════════════════════════════
 * COMPONENT PURPOSE & FUNCTIONALITY
 * ═══════════════════════════════════════════════════════════════
 *
 * WHAT IT DOES:
 * Pure passthrough provider for Groq API (llama-3.3-70b-versatile)
 *
 * WHY IT EXISTS:
 * Lightweight, zero-logic wrapper for Groq SDK with rate limiting only
 *
 * HOW IT WORKS:
 * Request → Rate Limit Check → Groq API → Response
 * NO PROMPT BUILDING (Cognitive Engine does that)
 * NO VALIDATION (Optional, can be added by caller)
 *
 * ═══════════════════════════════════════════════════════════════
 * AGENT/COMPONENT DNA
 * ═══════════════════════════════════════════════════════════════
 *
 * AGENT_TYPE: LLMProvider
 * COGNITIVE_LEVEL: API Passthrough Layer
 * AUTONOMY_DEGREE: 5% (only rate limiting)
 * LEARNING_ENABLED: false
 * CIG_PROTOCOL_VERSION: 2.0
 */

import Groq from 'groq-sdk';
import { logger } from '../system/logging-system';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface GroqConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  rateLimitPerMinute: number;
}

export interface GroqCompletionRequest {
  systemPrompt: string;      // Cognitive Engine provides this
  userPrompt: string;         // User input
  maxTokens?: number;         // Override default
  temperature?: number;       // Override default
}

export interface GroqCompletionResponse {
  content: string;
  tokensUsed: number;
  model: string;
  finishReason: 'stop' | 'length' | 'error';
  cached: boolean;
}

// ═══════════════════════════════════════════════════════════════
// GROQ PROVIDER - PURE PASSTHROUGH
// ═══════════════════════════════════════════════════════════════

export class GroqService {
  private static instance: GroqService;
  private client: Groq;
  private config: GroqConfig;
  private requestQueue: number[] = [];
  private readonly RATE_WINDOW_MS = 60000;

  private constructor() {
    this.config = {
      apiKey: process.env['GROQ_API_KEY'] || '',
      model: process.env['GROQ_MODEL'] || 'llama-3.3-70b-versatile',
      maxTokens: 8192,
      temperature: 0.7,
      rateLimitPerMinute: 60
    };

    if (!this.config.apiKey) {
      logger.warn('⚠️ Groq API key not configured', {
        component: 'GroqService',
        action: 'initialize'
      });
    }

    this.client = new Groq({ apiKey: this.config.apiKey });

    logger.info('✅ Groq Service initialized (passthrough mode)', {
      component: 'GroqService',
      action: 'initialize',
      metadata: {
        model: this.config.model,
        maxTokens: this.config.maxTokens
      }
    });
  }

  public static getInstance(): GroqService {
    if (!GroqService.instance) {
      GroqService.instance = new GroqService();
    }
    return GroqService.instance;
  }

  public configure(config: Partial<GroqConfig>): void {
    this.config = { ...this.config, ...config };
    if (config.apiKey) {
      this.client = new Groq({ apiKey: config.apiKey });
    }
    logger.info('✅ Groq Service reconfigured', {
      component: 'GroqService',
      action: 'configure',
      metadata: { model: this.config.model }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // CORE METHOD - CHAT COMPLETION (PASSTHROUGH)
  // ═══════════════════════════════════════════════════════════════

  /**
   * Generate Completion (Pure Passthrough)
   * 
   * NO PROMPT BUILDING - Caller provides full prompts
   * NO VALIDATION - Caller handles validation if needed
   * ONLY RATE LIMITING + API CALL
   */
  public async complete(request: GroqCompletionRequest): Promise<GroqCompletionResponse> {
    await this.checkRateLimit();
    const startTime = Date.now();

    logger.info('🚀 Groq API call starting', {
      component: 'GroqService',
      action: 'complete',
      metadata: {
        systemPromptLength: request.systemPrompt.length,
        userPromptLength: request.userPrompt.length
      }
    });

    try {
      const completion = await this.client.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: request.systemPrompt
          },
          {
            role: 'user',
            content: request.userPrompt
          }
        ],
        max_tokens: request.maxTokens || this.config.maxTokens,
        temperature: request.temperature ?? this.config.temperature,
        stream: false
      });

      const content = completion.choices[0]?.message?.content || '';
      const tokensUsed = completion.usage?.total_tokens || 0;
      const finishReason = completion.choices[0]?.finish_reason as 'stop' | 'length' | 'error';

      const response: GroqCompletionResponse = {
        content,
        tokensUsed,
        model: this.config.model,
        finishReason,
        cached: false
      };

      logger.info('✅ Groq API call completed', {
        component: 'GroqService',
        action: 'complete',
        metadata: {
          tokensUsed,
          contentLength: content.length,
          duration: Date.now() - startTime,
          finishReason
        }
      });

      return response;

    } catch (error) {
      logger.error('❌ Groq API call failed', error as Error, {
        component: 'GroqService',
        action: 'complete'
      });
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    this.requestQueue = this.requestQueue.filter(
      timestamp => now - timestamp < this.RATE_WINDOW_MS
    );

    if (this.requestQueue.length >= this.config.rateLimitPerMinute) {
      const oldestRequest = this.requestQueue[0]!;
      const waitTime = this.RATE_WINDOW_MS - (now - oldestRequest);
      
      logger.warn('⚠️ Rate limit reached, waiting', {
        component: 'GroqService',
        action: 'checkRateLimit',
        metadata: { waitTimeMs: waitTime }
      });
      
      await this.sleep(waitTime);
    }

    this.requestQueue.push(now);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public getStatistics() {
    return {
      model: this.config.model,
      maxTokens: this.config.maxTokens,
      rateLimitPerMinute: this.config.rateLimitPerMinute,
      currentQueueSize: this.requestQueue.length,
      configured: !!this.config.apiKey
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// EXPORT SINGLETON
// ═══════════════════════════════════════════════════════════════

export const groqService = GroqService.getInstance();

/*
 * ═══════════════════════════════════════════════════════════════
 * END OF GROQ PROVIDER - TRINITY COMPONENT 088
 * ═══════════════════════════════════════════════════════════════
 *
 * ✅ CIG-2.0 PROTOCOL VALIDATED
 * ✅ PASSTHROUGH MODE: ACTIVE
 * ✅ ZERO LOGIC: CONFIRMED
 * ✅ RATE LIMITING: 60 REQ/MIN
 * ✅ READY FOR COGNITIVE ENGINE
 */
