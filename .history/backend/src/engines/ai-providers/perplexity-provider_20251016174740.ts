/**
 * PERPLEXITY AI PROVIDER
 * Uses Sonar models for code generation
 */

import axios, { AxiosInstance } from 'axios';
import { AIMessage, AIProvider, AIProviderConfig } from './types';
import logger from '../../utils/logger';

export class PerplexityProvider implements AIProvider {
  private client: AxiosInstance;
  private apiKey: string;
  private model: string;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'llama-3.1-sonar-large-128k-online'; // Ou 'llama-3.1-sonar-huge-128k-online'
    
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

  async chat(messages: AIMessage[], options?: any): Promise<{ content: string }> {
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
        model: this.model,
        messages: messages,
        temperature: options?.temperature || 0.2,
        max_tokens: options?.maxTokens || 4000,
        return_citations: false,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
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

      return { content };
    } catch (error: any) {
      logger.error('❌ Perplexity API error', {
        component: 'PerplexityProvider',
        error: error.response?.data || error.message
      });

      throw new Error(`Perplexity API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    throw new Error('Embeddings not supported by Perplexity API');
  }

  getModelName(): string {
    return this.model;
  }
}
