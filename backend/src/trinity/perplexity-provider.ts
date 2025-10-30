/**
 * ╔════════════════════════════════════════════════════════════════════════╗
 * ║ PERPLEXITY AI PROVIDER - SONAR MODELS                                ║
 * ╠════════════════════════════════════════════════════════════════════════╣
 * ║ developers: Minerva Omega + Tulio                                     ║
 * ║ created: 2025-10-16T205500-0300                                       ║
 * ║ componentHash: orus.builder.ai-providers.perplexity.v1.0             ║
 * ╠════════════════════════════════════════════════════════════════════════╣
 * ║ WHAT IT DOES                                                          ║
 * ║ Provides access to Perplexity's Sonar models for code generation.    ║
 * ║ Better instruction following than GROQ Llama 3.3!                     ║
 * ║                                                                        ║
 * ║ WHY IT EXISTS                                                         ║
 * ║ GROQ ignores prompts and generates multi-file code. Perplexity       ║
 * ║ Sonar models respect instructions and generate clean single files.   ║
 * ║                                                                        ║
 * ║ HOW IT WORKS                                                          ║
 * ║ 1. Uses Perplexity Chat Completions API                              ║
 * ║ 2. Supports Sonar models (sonar-large-128k-online recommended)       ║
 * ║ 3. Implements same interface as GroqProvider for drop-in replacement ║
 * ╚════════════════════════════════════════════════════════════════════════╝
 */

import axios, { AxiosInstance } from 'axios';
import { logger } from '../system/logging-system';
/**
 * PERPLEXITY AI PROVIDER
 * Uses Sonar models (better instruction following than GROQ!)
 */
export class PerplexityProvider {
  private client: AxiosInstance;
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'llama-3.1-sonar-large-128k-online') {
    if (!apiKey) {
      throw new Error('PERPLEXITY_API_KEY not found in environment variables');
    }

    this.apiKey = apiKey;
    this.model = model;
    
    this.client = axios.create({
      baseURL: 'https://api.perplexity.ai',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    });

    logger.info('✅ Perplexity AI Provider initialized', {
      component: 'PerplexityProvider',
      metadata: { model: this.model }
    });
  }

  /**
   * Generate chat completion
   * @param messages - Array of chat messages
   * @param options - Generation options (temperature, maxTokens, etc)
   * @returns Response with content and metadata
   */
  async chat(messages: any[], options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<{ content: string; model: string; usage?: any }> {
    try {
      logger.debug('🤖 Calling Perplexity API', {
        component: 'PerplexityProvider',
        metadata: {
          model: this.model,
          messageCount: messages.length,
          temperature: options?.temperature || 0.2
        }
      });

      const response = await this.client.post('/chat/completions', {
        model: options?.model || this.model,
        messages: messages,
        temperature: options?.temperature || 0.2,
        max_tokens: options?.maxTokens || 4000,
        return_citations: false,
        return_images: false,
        return_related_questions: false,
        top_p: 0.9,
        stream: false
      });

      const content = response.data.choices[0]?.message?.content || '';

      logger.info('✅ Perplexity API response received', {
        component: 'PerplexityProvider',
        metadata: {
          responseLength: content.length,
          tokensUsed: response.data.usage?.total_tokens || 0
        }
      });

      return {
        content,
        model: response.data.model || this.model,
        usage: response.data.usage
      };
} catch (error: any) {
  const errorMessage = error?.response?.data?.error?.message || error?.message || 'Unknown error';
  
  logger.error(
    '❌ Perplexity API error',
    error instanceof Error ? error : new Error(errorMessage),
    {
      component: 'PerplexityProvider'
    }
  );

  throw new Error(`Perplexity API error: ${errorMessage}`);
}

  }

  /**
   * Analyze prompt (structured output)
   * @param prompt - User prompt to analyze
   * @param analysisType - Type of analysis (intent, entity, context)
   * @returns Parsed JSON analysis
   */
  async analyze(prompt: string, analysisType: 'intent' | 'entity' | 'context'): Promise<any> {
    const systemPrompt = this.getAnalysisSystemPrompt(analysisType);
    
    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ], {
      temperature: 0.3,
      maxTokens: 1500
    });

    try {
      return JSON.parse(response.content);
    } catch (error) {
      logger.error('Failed to parse Perplexity analysis response', error as Error, {
        component: 'PerplexityProvider',
        metadata: { response: response.content }
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

  /**
   * Generate JSON response
   * @param prompt - Prompt for JSON generation
   * @param schema - JSON schema to follow
   * @returns Parsed JSON response
   */
  async generateJson<T>(prompt: string, schema: Record<string, unknown>): Promise<T> {
    const response = await this.chat([
      { role: 'system', content: `You are a JSON generator. Generate ONLY valid JSON matching this schema: ${JSON.stringify(schema)}` },
      { role: 'user', content: prompt }
    ], {
      temperature: 0.2,
      maxTokens: 2000
    });

    try {
      return JSON.parse(response.content) as T;
    } catch (error) {
      logger.error('Failed to parse JSON from Perplexity', error as Error, {
        component: 'PerplexityProvider'
      });
      throw new Error('Invalid JSON response from AI');
    }
  }

  /**
   * Get analysis system prompt based on type
   * @param analysisType - Type of analysis
   * @returns System prompt for analysis
   */
  private getAnalysisSystemPrompt(analysisType: string): string {
    const prompts = {
      intent: `You are an intent classifier. Analyze the user's prompt and return JSON with:
{
  "intent": { "type": "CREATE_APP" | "ADD_FEATURE" | "MODIFY_CODE" | "DEPLOY" | "DEBUG", "confidence": 0-100 },
  "entities": [],
  "context": {
    "domain": "fitness" | "ecommerce" | "dashboard" | "social" | "education" | "healthcare" | "finance" | "generic",
    "complexity": "simple" | "standard" | "advanced",
    "stylePreferences": "modern" | "minimal" | "bold" | "playful" | "professional",
    "colorPalette": ["HEX1", "HEX2", "HEX3"],
    "personality": "motivational" | "persuasive" | "analytical" | "engaging" | "professional"
  }
}

IMPORTANT: Detect domain from keywords:
- fitness/workout/exercise → fitness
- shop/store/product/cart → ecommerce
- analytics/metrics/chart → dashboard
- post/chat/social → social

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

  /**
   * Get model name
   * @returns Current model name
   */
  getModelName(): string {
    return this.model;
  }
}
