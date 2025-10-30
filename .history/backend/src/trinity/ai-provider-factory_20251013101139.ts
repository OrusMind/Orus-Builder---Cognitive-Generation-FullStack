/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 AI PROVIDER FACTORY - UNIFIED AI INTERFACE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @developers    Minerva Omega + Tulio
 * @created       2025-10-13T10:12:00-0300
 * @componentHash orus.builder.trinity.ai-provider-factory.v1.0
 * 
 * WHAT IT DOES:
 *   Abstração unificada para trocar providers de IA (GROQ ↔ Claude ↔ OpenAI)
 *   em UM ÚNICO LUGAR. Todos engines usam esta interface, permitindo troca
 *   de provider sem modificar código de cada engine.
 * 
 * WHY IT EXISTS:
 *   Evitar dependência direta de GROQ/Claude em 5+ engines. Facilita testes,
 *   migração de providers, e suporte a múltiplos AIs simultaneamente.
 * 
 * HOW IT WORKS:
 *   Factory pattern + Adapter pattern. Define interface comum (IAIProvider)
 *   e implementa adapters para cada provider (GROQ, Claude, etc).
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Groq from 'groq-sdk';
import { logger } from '../system/logging-system';


// ═══════════════════════════════════════════════════════════════════════════
// 🎯 AI PROVIDER TYPES
// ═══════════════════════════════════════════════════════════════════════════

export enum AIProviderType {
  GROQ = 'groq',
  CLAUDE = 'claude',
  OPENAI = 'openai',
  GEMINI = 'gemini'
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIAnalysisResult {
  intent: {
    type: string;
    confidence: number;
  };
  entities: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
  context: {
    domain: string;
    complexity: string;
    stylePreferences: string;
    colorPalette: string[];
    personality: string;
  };
}


// ═══════════════════════════════════════════════════════════════════════════
// 🎯 AI PROVIDER INTERFACE (ABSTRAÇÃO)
// ═══════════════════════════════════════════════════════════════════════════

export interface IAIProvider {
  /**
   * Generate chat completion
   */
  chat(messages: AIMessage[], options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<AIResponse>;

  /**
   * Analyze prompt with structured output
   */
  analyze(prompt: string, analysisType: 'intent' | 'entity' | 'context'): Promise<AIAnalysisResult>;

  /**
   * Generate JSON response
   */
  generateJson<T>(prompt: string, schema: Record<string, unknown>): Promise<T>;
}


// ═══════════════════════════════════════════════════════════════════════════
// 🤖 GROQ ADAPTER IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

export class GroqAIProvider implements IAIProvider {
  private client: Groq;
  private defaultModel = 'llama-3.1-70b-versatile';

  constructor() {
 const apiKey = process.env['GROQ_API_KEY'];
    if (!apiKey) {
      throw new Error('GROQ_API_KEY not found in environment variables');
    }

    this.client = new Groq({ apiKey });
    
    logger.info('✅ GROQ AI Provider initialized', {
      component: 'GroqAIProvider',
      model: this.defaultModel
    });
  }

  async chat(messages: AIMessage[], options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<AIResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        model: options?.model || this.defaultModel,
        messages: messages as any,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 2000,
      });

      const choice = completion.choices[0];
      
      return {
        content: choice.message.content || '',
        model: completion.model,
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        }
      };
    } catch (error) {
      logger.error('GROQ chat error', error as Error, {
        component: 'GroqAIProvider'
      });
      throw error;
    }
  }

  async analyze(prompt: string, analysisType: 'intent' | 'entity' | 'context'): Promise<AIAnalysisResult> {
    const systemPrompt = this.getAnalysisSystemPrompt(analysisType);
    
    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ], {
      temperature: 0.3,
      maxTokens: 1500
    });

    try {
      const parsed = JSON.parse(response.content);
      return parsed;
    } catch (error) {
      logger.error('Failed to parse GROQ analysis response', error as Error, {
        component: 'GroqAIProvider',
        response: response.content
      });
      
      // Fallback response
      return {
        intent: { type: 'CREATE_APP', confidence: 50 },
        entities: [],
        context: {
          domain: 'generic',
          complexity: 'standard',
          stylePreferences: 'modern',
          colorPalette: ['#007AFF', '#34C759'],
          personality: 'professional'
        }
      };
    }
  }

  async generateJson<T>(prompt: string, schema: Record<string, unknown>): Promise<T> {
    const response = await this.chat([
      {
        role: 'system',
        content: `You are a JSON generator. Generate ONLY valid JSON matching this schema: ${JSON.stringify(schema)}`
      },
      { role: 'user', content: prompt }
    ], {
      temperature: 0.2,
      maxTokens: 2000
    });

    try {
      return JSON.parse(response.content) as T;
    } catch (error) {
      logger.error('Failed to parse JSON from GROQ', error as Error, {
        component: 'GroqAIProvider'
      });
      throw new Error('Invalid JSON response from AI');
    }
  }

  private getAnalysisSystemPrompt(analysisType: string): string {
    const prompts = {
      intent: `You are an intent classifier. Analyze the user's prompt and return JSON with:
{
  "intent": {
    "type": "CREATE_APP" | "ADD_FEATURE" | "MODIFY_CODE" | "DEPLOY" | "DEBUG",
    "confidence": 0-100
  },
  "entities": [],
  "context": {
    "domain": "fitness" | "ecommerce" | "dashboard" | "social" | "education" | "healthcare" | "finance" | "generic",
    "complexity": "simple" | "standard" | "advanced",
    "stylePreferences": "modern" | "minimal" | "bold" | "playful" | "professional",
    "colorPalette": ["#HEX1", "#HEX2", "#HEX3"],
    "personality": "motivational" | "persuasive" | "analytical" | "engaging" | "professional"
  }
}

IMPORTANT: Detect domain from keywords:
- fitness/workout/exercise → "fitness"
- shop/store/product/cart → "ecommerce"  
- analytics/metrics/chart → "dashboard"
- post/chat/social → "social"

Return ONLY the JSON, no explanation.`,

      entity: `You are an entity extractor. Extract entities from the prompt and return JSON with:
{
  "intent": { "type": "CREATE_APP", "confidence": 85 },
  "entities": [
    { "type": "feature", "value": "user authentication", "confidence": 90 },
    { "type": "component", "value": "login form", "confidence": 95 }
  ],
  "context": { ... }
}

Return ONLY the JSON, no explanation.`,

      context: `You are a context analyzer. Analyze the full context and return JSON with complete details.
Return ONLY the JSON, no explanation.`
    };

    return prompts[analysisType as keyof typeof prompts] || prompts.intent;
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// 🤖 CLAUDE ADAPTER IMPLEMENTATION (PREPARADO PARA FUTURO)
// ═══════════════════════════════════════════════════════════════════════════

export class ClaudeAIProvider implements IAIProvider {
  constructor() {
    logger.warn('⚠️ Claude AI Provider not yet implemented', {
      component: 'ClaudeAIProvider'
    });
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    throw new Error('Claude provider not implemented yet. Use GROQ for now.');
  }

  async analyze(prompt: string): Promise<AIAnalysisResult> {
    throw new Error('Claude provider not implemented yet. Use GROQ for now.');
  }

  async generateJson<T>(prompt: string): Promise<T> {
    throw new Error('Claude provider not implemented yet. Use GROQ for now.');
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// 🏭 AI PROVIDER FACTORY
// ═══════════════════════════════════════════════════════════════════════════

export class AIProviderFactory {
  private static instance: IAIProvider | null = null;
  private static currentProvider: AIProviderType = AIProviderType.GROQ;

  /**
   * Get AI Provider singleton
   */
  static getProvider(): IAIProvider {
    if (!this.instance) {
      this.instance = this.createProvider(this.currentProvider);
    }
    return this.instance;
  }

  /**
   * Switch AI Provider (GROQ ↔ Claude ↔ OpenAI)
   */
  static switchProvider(type: AIProviderType): void {
    this.currentProvider = type;
    this.instance = this.createProvider(type);
    
    logger.info(`🔄 Switched AI Provider to: ${type}`, {
      component: 'AIProviderFactory'
    });
  }

  /**
   * Create provider instance
   */
  private static createProvider(type: AIProviderType): IAIProvider {
    switch (type) {
      case AIProviderType.GROQ:
        return new GroqAIProvider();
      
      case AIProviderType.CLAUDE:
        return new ClaudeAIProvider();
      
      default:
        logger.warn(`Unknown provider type: ${type}, defaulting to GROQ`, {
          component: 'AIProviderFactory'
        });
        return new GroqAIProvider();
    }
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// 🎯 CONVENIENCE EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const aiProvider = AIProviderFactory.getProvider();
