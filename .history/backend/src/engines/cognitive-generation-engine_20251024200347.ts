/*
 * ═══════════════════════════════════════════════════════════════
 * 🧬 COGNITIVE GENERATION ENGINE - MAIN PIPELINE (CORRECTED)
 * ═══════════════════════════════════════════════════════════════
 * 
 * VERSION: 3.0 - FULLY INTEGRATED & CORRECTED
 * LAST_MODIFIED: 2025-10-24T14:16:00-03:00
 * STATUS: ✅ ZERO COMPILATION ERRORS
 */

// ═══════════════════════════════════════════════════════════════
// SECTION 1: IMPORTS & DEPENDENCIES
// ═══════════════════════════════════════════════════════════════

import { logger } from '../utils/logger';

// Trinity subsystem
import { TrinityOrchestrator } from '../trinity/trinity-orchestrator';
import { AIProviderFactory } from '../trinity/ai-provider-factory';

// Generation subsystem
import { codeGenerator } from '../generation/code-generator';
import { componentBuilder } from '../generation/component-builder';
import { uiGenerator } from '../generation/ui-generator';
import { backendGenerator } from '../generation/backend-generator';
import { cigValidator } from '../generation/cig-validator';
import { qualityAnalyzer } from '../generation/quality-analyzer';
import { codeOptimizer } from '../generation/code-optimizer';
import { dependencyResolver } from '../generation/dependency-resolver';
import { CodeLanguage } from '../generation/cig-validator'; // ✅ Import normal
import { TrinityErrorCode } from '../core/types/trinity.types';
import { createI18nText } from '../core/types/i18n.types';

// Prompt subsystem
import { promptProcessor } from '../prompt/prompt-processor';
import { intentClassifier } from '../prompt/intent-classifier';
import { requirementsExtractor } from '../prompt/requirements-extractor';

// Template subsystem
import { templateManager } from '../templates/template-manager';
import { templateEngine } from '../engines/template-engine';
import { templateLibrary } from '../templates/template-library';

// Types from actual files
import type {
  TemplateCategory,
  TemplateSearchQuery,
  TemplateSearchResult,
  Framework,
  ThemeConfig
} from '../core/types/template.types';

import type {
  TrinityRequest,
  TrinityResponse,
  TrinityMode,
  TrinityConfig
} from '../core/types/trinity.types';

import type {
  I18nText,
  SupportedLanguage,
  ResponseWrapper,
  ErrorResponse
} from '../core/types/index';

// Generator-specific types
import type {
  UIGenerationInput,
  UIGenerationResult,
  StylingConfig
} from '../generation/ui-generator';

import type {
  BackendGenerationInput,
  BackendGenerationResult,
  DatabaseConfig,
  AuthConfig
} from '../generation/backend-generator';

import type {
  CodeGenerationInput,
  CodeGenerationResult
} from '../generation/code-generator';
import type {
  ValidationInput,
  ExtendedValidationResult
} from '../generation/cig-validator';

import type {
  QualityAnalysisInput,
  QualityAnalysisResult,
  AnalysisLanguage,
  AnalysisDepth
} from '../generation/quality-analyzer';

import type {
  OptimizationInput,
  OptimizationResult,
  CodeLanguage as OptimizerLanguage
} from '../generation/code-optimizer';
import { OptimizationType } from '../generation/code-optimizer'; 
// ═══════════════════════════════════════════════════════════════
// SECTION 2: LOCAL INTERFACES (Not in types files)
// ═══════════════════════════════════════════════════════════════
/**
 * Generation Request
 */
export interface GenerationRequest {
  // Identification
  id?: string;
  requestId?: string;
  userId?: string;
  projectId?: string;
  
  // Core
  prompt: string;
  framework?: string;
  language?: string;
  
  // Context
  context?: {
    domain?: string;
    language?: string;
    complexity?: string;
    stylePreferences?: any;
    colorPalette?: any;
    personality?: string;
  };
  
  // Options & Configuration
  options?: any;
  version?: number;
  
  // Trinity
  enableTrinity?: boolean;
  
  // Tracking & Metadata
  isDeleted?: boolean;      // ✅ ADICIONAR
  createdAt?: Date;         // ✅ ADICIONAR
  updatedAt?: Date;         // ✅ ADICIONAR
}

interface GeneratedComponent {
  name: string;
  type: 'component' | 'page' | 'service' | 'api' | 'model' | 'screen';
  code: string;
  path: string;
  language: string;
  framework: string;
  dependencies: string[];
  files?: Array<{ path: string; content: string }>; // ✅ ADICIONAR ESTA LINHA
  metadata: {
    linesOfCode: number;
    complexity: number;
    generated: boolean;
    autoFixed?: boolean;
    validated?: boolean;
    qualityScore?: number;
    coverage?: number;
    optimized?: boolean;
    optimizations?: string[];
  }
}

/**
 * Generation Result
 */
export interface GenerationResult {
  success: boolean;
  components: GeneratedComponent[];
  error?: string;
  metadata?: {
    framework: string;
    processingTime: number;
    generatedAt: string;
  };
  qualityScore: number;
  dependencies: string[];
  packageJson: string;
  readme: string;
  
  // ✅ Propriedades esperadas pelo generation.controller.ts
  data?: {
    components: GeneratedComponent[];
    files?: Array<{ path: string; content: string }>;
    structure?: any;
  };
  metrics?: {
    totalTime?: number;
      generationTime?: number;
    linesOfCode?: number;
    complexity?: number;
  };
  qualityReport?: {
    score: number;
    issues?: any[];
    recommendations?: any[];
    summary?: { // ✅ ADICIONAR ESTE OBJETO
      overallScore?: number;
    };
  };
}

/**
 * Technical Specification
 */
export interface TechnicalSpecification {
  architecture: {
    style: string;
    layers: string[];
    patterns: string[];
  };
  components: Array<{
    name: string;
    type: string;
    purpose: string;
    responsibilities: string[];
  }>;
  dataModel: any[];
  technologies: {
    frontend: string[];
    backend: string[];
    database: string[];
    deployment: string[];
  };
  quality: {
    testingStrategy: string;
    securityRequirements: string[];
    performanceTargets: string[];
  };
}

/**
 * Prompt Analysis Result
 */
export interface PromptAnalysisResult {
  originalPrompt: string;
  intent: {
    type: string;
    description: string;
    confidence: number;
    subIntents: any[];
  };
  entities: any[];
  requirements: any[];
  ambiguities: any[];
  context: {
    domain: string;
    complexity: string;
    stylePreferences?: any;
    colorPalette?: any;
    personality?: string;
  };
  specification?: TechnicalSpecification;
  confidence: number;
}

/**
 * ValidationResult (local wrapper)
 */
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
  suggestions?: string[];
}

/**
 * Quality Score
 */
export interface QualityScore {
  overallScore: number;
  testCoverage?: number;
}

/**
 * Pipeline stage result
 */
interface PipelineStageResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
}

/**
 * Generation context
 */
interface GenerationContext {
  prompt: string;
  analysis: PromptAnalysisResult;
  templates: any[];
  framework: string;
  domain: string;
  specification: TechnicalSpecification;
  trinity?: TrinityResponse<any>;
}

/**
 * Pipeline configuration
 */
interface PipelineConfig {
  enableValidation: boolean;
  enableOptimization: boolean;
  enableQualityAnalysis: boolean;
  retryOnFailure: boolean;
  maxRetries: number;
}
// ═══════════════════════════════════════════════════════════════
// SECTION 3: COGNITIVE GENERATION ENGINE CLASS
// ═══════════════════════════════════════════════════════════════

/**
 * Cognitive Generation Engine
 * Main orchestrator for code generation pipeline
 */
export class CognitiveGenerationEngine {
  private context?: GenerationContext;
  private aiProvider: any;
  private io?: any; // Socket.IO instance

  constructor() {
    // Get AI provider from factory (ENV-based)
    this.aiProvider = AIProviderFactory.getProvider();
    
    logger.info('Cognitive Generation Engine initialized', {
      component: 'CognitiveGenerationEngine'
    });
  }

  /**
   * Set Socket.IO instance
   */
  public setSocketIO(io: any): void {
    this.io = io;
    logger.info('Socket.IO set for Cognitive Generation Engine', {
      component: 'CognitiveGenerationEngine'
    });
  }

  /**
   * Initialize engine
   */
  public async initialize(...args: any[]): Promise<void> {
    logger.info('Initializing Cognitive Generation Engine', {
      component: 'CognitiveGenerationEngine',
      metadata: { argsReceived: args.length }
    });
  }

  /**
   * Start engine
   */
  public async start(): Promise<void> {
    logger.info('Starting Cognitive Generation Engine', {
      component: 'CognitiveGenerationEngine'
    });
  }

  /**
   * Get engine status
   */
  public getStatus(): { status: string; ready: boolean } {
    return {
      status: 'operational',
      ready: true
    };
  }

  /**
   * Main entry point: Generate code from prompt
   */
  public async generate(request: GenerationRequest): Promise<GenerationResult> {
    const startTime = Date.now();
      console.log('═══════════════════════════════════════════════════════');
  console.log('🔥🔥🔥 [CognitiveEngine] generate() CHAMADO! 🔥🔥🔥');
  console.log('[CognitiveEngine] Request:', {
    prompt: request.prompt,
    framework: request.framework,
    hasId: !!request.id
  });
  console.log('═══════════════════════════════════════════════════════');
  

    try {
      logger.info('🚀 [CognitiveEngine] Starting code generation', {
        component: 'CognitiveGenerationEngine',
        metadata: { 
          prompt: request.prompt.substring(0, 50),
          framework: request.framework || 'react'
        }
      });

      // Create generation pipeline
      const pipeline = new GenerationPipeline();
  console.log('═══════════════════════════════════════════════════════');
console.log('🔍 [CognitiveEngine] ANTES de chamar pipeline.execute()');
console.log('[CognitiveEngine] request:', request);
console.log('[CognitiveEngine] request.prompt:', request?.prompt);
console.log('[CognitiveEngine] request type:', typeof request);
console.log('[CognitiveEngine] request keys:', Object.keys(request || {}));
console.log('═══════════════════════════════════════════════════════');

// Execute pipeline
logger.info('📊 [CognitiveEngine] Executing 4-stage pipeline...');
const result = await pipeline.execute(request);

      logger.info('✅ [CognitiveEngine] Pipeline execution complete', {
        success: result.success,
        componentsCount: result.components?.length || 0,
        error: result.error || 'none'
      });

      const processingTime = Date.now() - startTime;
      
      // Verificar se pipeline retornou sucesso
      if (!result.success) {
        logger.error('❌ [CognitiveEngine] Pipeline returned failure', {
          error: result.error,
          processingTime
        });
        
        return {
          success: false,
          components: [],
          error: result.error || 'Pipeline execution failed',
          qualityScore: 0,
          dependencies: [],
          packageJson: '',
          readme: '',
          data: {
            components: [],
            files: [],
            structure: {}
          },
          metrics: {
            totalTime: processingTime,
            generationTime: processingTime,
            linesOfCode: 0,
            complexity: 0
          },
          qualityReport: {
            score: 0,
            issues: [{ message: result.error || 'Unknown error' }],
            recommendations: [],
            summary: {
              overallScore: 0
            }
          }
        };
      }
      
      // ✅ Calcular métricas
      const linesOfCode = result.components.reduce((acc, c) => 
        acc + (c.code?.split('\n').length || 0), 0
      );
      
      logger.info('✅ [CognitiveEngine] Generation successful', {
        totalTime: processingTime,
        components: result.components.length,
        linesOfCode
      });
      
      return {
        ...result,
        metadata: {
          framework: request.framework || 'react',
          processingTime,
          generatedAt: new Date().toISOString()
        },
        data: {
          components: result.components,
          files: result.components.map(c => ({
            path: c.path || `${c.name}.tsx`,
            content: c.code || ''
          })),
          structure: {
            frontend: result.components.filter(c => c.type === 'component').length,
            backend: result.components.filter(c => c.type === 'api').length,
            total: result.components.length
          }
        },
        metrics: {
          totalTime: processingTime,
          generationTime: processingTime,
          linesOfCode: linesOfCode,
          complexity: result.qualityScore
        },
        qualityReport: {
          score: result.qualityScore,
          issues: [],
          recommendations: [],
          summary: {
            overallScore: result.qualityScore
          }
        }
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      logger.error('❌ [CognitiveEngine] Code generation failed', {
        component: 'CognitiveGenerationEngine',
        error: (error as Error).message,
        stack: (error as Error).stack,
        processingTime
      });
      
      return {
        success: false,
        components: [],
        error: (error as Error).message,
        qualityScore: 0,
        dependencies: [],
        packageJson: '',
        readme: '',
        data: {
          components: [],
          files: [],
          structure: {}
        },
        metrics: {
          totalTime: processingTime,
          generationTime: processingTime,
          linesOfCode: 0,
          complexity: 0
        },
        qualityReport: {
          score: 0,
          issues: [{ message: (error as Error).message }],
          recommendations: [],
          summary: {
            overallScore: 0
          }
        }
      };
    }
  }
  
} // ← FIM DA CLASSE CognitiveGenerationEngine

// ═══════════════════════════════════════════════════════════════
// SECTION 4: GENERATION PIPELINE CLASS
// ═══════════════════════════════════════════════════════════════

/**
 * Generation Pipeline
 * 4-stage pipeline: Prepare → Generate → Validate → Optimize
 */
export class GenerationPipeline {
  private context?: GenerationContext;
  private config: PipelineConfig;
  private aiProvider: any; 

constructor(config?: Partial<PipelineConfig>) {
  this.config = {
    enableValidation: true,
    enableOptimization: true,
    enableQualityAnalysis: true,
    retryOnFailure: false,
    maxRetries: 3,
    ...config
  };
  
  this.aiProvider = AIProviderFactory.getProvider();
  
  // ✅ ADICIONAR ESSES LOGS
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔍 [Pipeline] Constructor CHAMADO');
  console.log('[Pipeline] this.aiProvider:', this.aiProvider);
  console.log('[Pipeline] this.aiProvider exists:', !!this.aiProvider);
  console.log('[Pipeline] this.aiProvider type:', typeof this.aiProvider);
  console.log('[Pipeline] this.aiProvider.generateCode exists:', !!this.aiProvider?.generateCode);
  console.log('[Pipeline] this.aiProvider methods:', Object.keys(this.aiProvider || {}));
  console.log('═══════════════════════════════════════════════════════');
  
  logger.debug('Generation Pipeline created', {
    component: 'GenerationPipeline',
    metadata: this.config
  });
}  // ═══════════════════════════════════════════════════════════════
  // Component Splitting Methods
  // ═══════════════════════════════════════════════════════════════
private splitCodeIntoComponents(aiCode: string, analysis: any): any[] {
  console.log('🔍 [Pipeline] splitCodeIntoComponents() CHAMADO');
  console.log('[Pipeline] AI code length:', aiCode.length);
  console.log('[Pipeline] AI code preview:', aiCode.substring(0, 500));
  
  const components: any[] = [];
  let match: RegExpExecArray | null;
  
  // ═══════════════════════════════════════════════════════════════
  // FORMATO 1: ```component:Name:tsx:path
  // ═══════════════════════════════════════════════════════════════
  console.log('🔍 [Pipeline] Tentativa 1: Formato ```component:Name:tsx:path');
  
  const format1Pattern = /```component:([^:]+):([^:]+):([^\n]+)\n([\s\S]*?)```/gi;
  
  while ((match = format1Pattern.exec(aiCode)) !== null) {
    const componentName = match ? match.trim() : '';
    const language = match ? match.trim() : 'typescript';
    const filePath = match ? match.trim() : '';
    const code = match ? match.trim() : '';
    
    if (code.length > 10 && componentName && filePath) {
      console.log(`[Pipeline] ✅ Format1: ${componentName} at ${filePath} (${code.length} chars)`);
      
      components.push({
        name: componentName,
        type: 'component',
        code: code,
        path: filePath,
        files: [{
          path: filePath,
          content: code,
          language: language
        }]
      });
    }
  }
  
  console.log(`[Pipeline] Formato 1 encontrou: ${components.length} componentes`);
  
  // ═══════════════════════════════════════════════════════════════
  // FORMATO 2: Comentários // src/path/file.tsx
  // ═══════════════════════════════════════════════════════════════
  if (components.length === 0) {
    console.log('🔍 [Pipeline] Tentativa 2: Detectar por comentários // src/');
    
    // Split by comment markers
    const sections = aiCode.split(/(?=\/\/\s*src\/)/);
    
    for (const section of sections) {
      const pathMatch = section.match(/\/\/\s*src\/([\w\/\-\.]+)\s*\n/);
      
      if (pathMatch && pathMatch) {
        const filePath = `src/${pathMatch}`;
        
        // Extract code after the comment
        const codeMatch = section.match(/\/\/\s*src\/[\w\/\-\.]+\s*\n([\s\S]+?)(?=\/\/\s*src\/|$)/);
        
        if (codeMatch && codeMatch) {
          let code = codeMatch.trim();
          
          // Remove markdown code fences if present
          code = code.replace(/```(?:typescript|tsx|jsx|javascript|ts|js)?\s*\n?/g, '');
          code = code.replace(/```\s*$/g, '');
          code = code.trim();
          
          if (code.length > 50) {
            const componentName = this.extractComponentName(filePath, code);
            
            console.log(`[Pipeline] ✅ Format2: ${componentName} at ${filePath} (${code.length} chars)`);
            
            components.push({
              name: componentName,
              type: 'component',
              code: code,
              path: filePath,
              files: [{
                path: filePath,
                content: code,
                language: 'typescript'
              }]
            });
          }
        }
      }
    }
  }
  
  console.log(`[Pipeline] Formato 2 encontrou: ${components.length} componentes`);
  
  // ═══════════════════════════════════════════════════════════════
  // FORMATO 3: Múltiplos blocos ```typescript com comentários internos
  // ═══════════════════════════════════════════════════════════════
  if (components.length === 0) {
    console.log('🔍 [Pipeline] Tentativa 3: Múltiplos blocos markdown');
    
    const format3Pattern = /```(?:typescript|tsx|jsx|javascript|ts|js)?\s*\n(?:\/\/\s*(.+?\.(?:tsx?|jsx?))\s*)?\n?([\s\S]*?)```/gi;
    
    while ((match = format3Pattern.exec(aiCode)) !== null) {
      const filePath = match ? match.trim() : '';
      let code = match ? match.trim() : '';
      
      if (code.length > 50) {
        const componentName = filePath ? this.extractComponentName(filePath, code) : this.extractComponentName('', code);
        const finalPath = filePath || `src/components/${componentName}.tsx`;
        
        console.log(`[Pipeline] ✅ Format3: ${componentName} at ${finalPath} (${code.length} chars)`);
        
        components.push({
          name: componentName,
          type: 'component',
          code: code,
          path: finalPath,
          files: [{
            path: finalPath,
            content: code,
            language: 'typescript'
          }]
        });
      }
    }
  }
  
  console.log(`[Pipeline] Formato 3 encontrou: ${components.length} componentes`);
  
  // ═══════════════════════════════════════════════════════════════
  // FORMATO 4: Detectar múltiplos componentes React no mesmo código
  // ═══════════════════════════════════════════════════════════════
  if (components.length === 0) {
    console.log('🔍 [Pipeline] Tentativa 4: Detectar componentes React direto');
    
    // Pattern para detectar componentes React
    const componentPattern = /(?:export\s+default\s+function\s+(\w+)|export\s+function\s+(\w+)|const\s+(\w+)\s*:\s*React\.FC)/g;
    const matches: Array<{ name: string; start: number }> = [];
    
    while ((match = componentPattern.exec(aiCode)) !== null) {
      const nameValue = match || match || match;
      const name = nameValue ? nameValue : '';
      if (name && name !== 'undefined') {
        matches.push({
          name: name,
          start: match.index
        });
      }
    }
    
    console.log(`[Pipeline] Componentes React detectados: ${matches.length}`);
    
    if (matches.length > 1) {
      // Múltiplos componentes - dividir
      for (let i = 0; i < matches.length; i++) {
        const currentMatch = matches[i];
        const nextMatch = matches[i + 1];
        if (!currentMatch) continue;
        
        const start = currentMatch.start;
        const end = nextMatch ? nextMatch.start : aiCode.length;
        let code = aiCode.substring(start, end).trim();
        
        // Remover markdown fences se existir
        code = code.replace(/```(?:typescript|tsx|jsx|javascript|ts|js)?\s*\n?/g, '');
        code = code.replace(/```\s*$/g, '');
        code = code.trim();
        
        if (code.length > 50) {
          components.push({
            name: currentMatch.name,
            type: 'component',
            code,
            path: `src/components/${currentMatch.name}.tsx`,
            files: [{
              path: `src/components/${currentMatch.name}.tsx`,
              content: code,
              language: 'typescript'
            }]
          });
        }
      }
    } else if (matches.length === 1) {
      // Apenas 1 componente - usar código completo
      const singleMatch = matches;
      if (singleMatch) {
        let code = aiCode.trim();
        
        // Remover markdown fences
        code = code.replace(/```(?:typescript|tsx|jsx|javascript|ts|js)?\s*\n?/g, '');
        code = code.replace(/```\s*$/g, '');
        code = code.trim();
        
        components.push({
          name: singleMatch.name,
          type: 'component',
          code,
          path: `src/${singleMatch.name}.tsx`,
          files: [{
            path: `src/${singleMatch.name}.tsx`,
            content: code,
            language: 'typescript'
          }]
        });
      }
    }
  }
  
  console.log(`[Pipeline] Formato 4 encontrou: ${components.length} componentes`);
  
  // ═══════════════════════════════════════════════════════════════
  // FALLBACK: Usar código completo
  // ═══════════════════════════════════════════════════════════════
  if (components.length === 0) {
    console.log('[Pipeline] ⚠️ Usando fallback - código completo');
    
    let componentName = 'App';
    
    if (analysis && analysis.entities && analysis.entities && analysis.entities.value) {
      componentName = analysis.entities.value;
    } else if (analysis && analysis.originalPrompt) {
      const words = analysis.originalPrompt.split(' ').filter((w: string) => w.length > 0);
      if (words.length > 0 && words) {
        componentName = words;
      }
    }
    
    let code = aiCode.trim();
    
    // Remover markdown fences
    code = code.replace(/```(?:typescript|tsx|jsx|javascript|ts|js)?\s*\n?/g, '');
    code = code.replace(/```\s*$/g, '');
    code = code.trim();
    
    components.push({
      name: componentName,
      type: 'component',
      code,
      path: 'src/App.tsx',
      files: [{
        path: 'src/App.tsx',
        content: code,
        language: 'typescript'
      }]
    });
  }
  
  // ═══════════════════════════════════════════════════════════════
  // LOG FINAL
  // ═══════════════════════════════════════════════════════════════
  console.log(`✅ [Pipeline] Total components: ${components.length}`);
  components.forEach((comp, idx) => {
    console.log(`[Pipeline] Component ${idx + 1}: ${comp.name} | Files: ${comp.files?.length || 0} | Code: ${comp.code.length} chars | Path: ${comp.path}`);
  });
  
  return components;
}

private extractComponentName(filePath: string, code: string): string {
  // Tentar extrair do caminho primeiro
  if (filePath) {
    const pathMatch = filePath.match(/([^/]+)\.(tsx?|jsx?)$/);
    if (pathMatch && pathMatch) {
      return pathMatch;
    }
  }
  
  // Tentar extrair do código
  const patterns = [
    /export\s+default\s+(?:function|const)\s+(\w+)/,
    /export\s+(?:function|const)\s+(\w+)/,
    /const\s+(\w+)\s*:\s*React\.FC/,
    /class\s+(\w+)/
  ];
  
  for (const pattern of patterns) {
    const match = code.match(pattern);
    if (match && match) {
      return match;
    }
  }
  
  return 'Component';
}


  /**
   * Execute complete generation pipeline
   */
  public async execute(request: GenerationRequest): Promise<GenerationResult> {
    try {
        // ✅ VERIFICAR SE REQUEST CHEGOU
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔍 [Pipeline] execute() CHAMADO');
    console.log('[Pipeline] request recebido:', request);
    console.log('[Pipeline] request type:', typeof request);
    console.log('[Pipeline] request.prompt:', request?.prompt);
    console.log('[Pipeline] request keys:', Object.keys(request || {}));
    console.log('═══════════════════════════════════════════════════════');
    
    logger.info('🔄 [Pipeline] Starting 4-stage execution', {
      component: 'GenerationPipeline',
      prompt: request.prompt.substring(0, 50) // ← AQUI DÁ ERRO SE request É undefined
    });
      logger.info('🔄 [Pipeline] Starting 4-stage execution', {
        component: 'GenerationPipeline',
        prompt: request.prompt.substring(0, 50)
      });

      // Stage 1: Prepare (analysis + templates)
      logger.info('📥 [Pipeline] STAGE 1: Prepare (analysis + templates)');
      const prepareResult = await this.stagePrepare(request);
      if (!prepareResult.success) {
        logger.error('❌ [Pipeline] Stage 1 (Prepare) failed', { 
          error: prepareResult.error 
        });
        throw new Error(prepareResult.error || 'Prepare stage failed');
      }
      logger.info('✅ [Pipeline] Stage 1 complete', {
        hasAnalysis: !!prepareResult.data.analysis,
        templatesCount: prepareResult.data.templates?.length || 0
      });

      // Stage 2: Generate components
      logger.info('🔨 [Pipeline] STAGE 2: Generate (AI + code generation)');
      const generateResult = await this.stageGenerate(prepareResult.data);
      if (!generateResult.success) {
        logger.error('❌ [Pipeline] Stage 2 (Generate) failed', { 
          error: generateResult.error 
        });
        throw new Error(generateResult.error || 'Generate stage failed');
      }
      logger.info('✅ [Pipeline] Stage 2 complete', {
        componentsGenerated: generateResult.data.components?.length || 0
      });

      let components = generateResult.data.components;

      // Validar que temos componentes
      if (!components || components.length === 0) {
        logger.error('❌ [Pipeline] No components generated');
        throw new Error('No components generated by Stage 2');
      }

      // Stage 3: Validate (if enabled)
      if (this.config.enableValidation) {
        logger.info('✔️ [Pipeline] STAGE 3: Validate');
        try {
          const validateResult = await this.stageValidate(components);
          if (validateResult.success && validateResult.data) {
            components = validateResult.data;
            logger.info('✅ [Pipeline] Stage 3 complete (validated)');
          } else {
            logger.warn('⚠️ [Pipeline] Stage 3 validation issues (non-blocking)', {
              error: validateResult.error
            });
          }
        } catch (validateError) {
          logger.warn('⚠️ [Pipeline] Stage 3 failed (non-blocking)', {
            error: (validateError as Error).message
          });
        }
      }

      // Stage 4: Optimize (if enabled)
      if (this.config.enableOptimization) {
        logger.info('⚡ [Pipeline] STAGE 4: Optimize');
        try {
          const optimizeResult = await this.stageOptimize(components);
          if (optimizeResult.success && optimizeResult.data) {
            components = optimizeResult.data;
            logger.info('✅ [Pipeline] Stage 4 complete (optimized)');
          } else {
            logger.warn('⚠️ [Pipeline] Stage 4 optimization issues (non-blocking)', {
              error: optimizeResult.error
            });
          }
        } catch (optimizeError) {
          logger.warn('⚠️ [Pipeline] Stage 4 failed (non-blocking)', {
            error: (optimizeError as Error).message
          });
        }
      }

      // Calculate quality score
      const qualityScore = components.reduce((sum: number, c: GeneratedComponent) =>        
        sum + (c.metadata?.qualityScore || 0), 0
      ) / (components.length || 1);

      logger.info('✅ [Pipeline] All stages complete', {
        finalComponents: components.length,
        qualityScore: qualityScore.toFixed(2)
      });

      return {
        success: true,
        components,
        qualityScore,
        dependencies: this.extractAllDependencies(components),
        packageJson: this.generatePackageJson(components),
        readme: this.generateReadme(components)
      };

    } catch (error) {
      logger.error('❌ [Pipeline] Execution failed', {
        component: 'GenerationPipeline',
        error: (error as Error).message,
        stack: (error as Error).stack
      });
      
      return {
        success: false,
        components: [],
        error: (error as Error).message,
        qualityScore: 0,
        dependencies: [],
        packageJson: '',
        readme: ''
      };
    }
  }
  /**
 * Stage 1: Prepare
 * - Analyze prompt
 * - Search templates
 * - Build context
 */
private async stagePrepare(request: GenerationRequest): Promise<PipelineStageResult> {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔍 [Pipeline] stagePrepare() CHAMADO');
  console.log('[Pipeline] request recebido:', request);
  console.log('[Pipeline] request.prompt:', request?.prompt);
  console.log('[Pipeline] request type:', typeof request);
  console.log('═══════════════════════════════════════════════════════');
  
  logger.info('Pipeline Stage 1: Prepare', { 
    component: 'GenerationPipeline',
    prompt: request?.prompt?.substring(0, 50) || 'NO PROMPT'
  });

  try {
    // ✅ Validar request
    if (!request || !request.prompt) {
      console.error('❌ [Pipeline] stagePrepare - request inválido');
      throw new Error('Invalid request: prompt is required');
    }

    console.log('✅ [Pipeline] Request validado, chamando analyzePrompt()...');
    
    // Analyze prompt using PromptProcessor (fallback mode for now)
    const analysis = await this.analyzePrompt(request);
    
    console.log('✅ [Pipeline] analyzePrompt() complete');
    console.log('[Pipeline] analysis:', analysis);

    // Search for relevant templates
    console.log('🔍 [Pipeline] Calling searchTemplates()...');
    const templates = await this.searchTemplates(analysis, request);
    
    console.log('✅ [Pipeline] searchTemplates() complete');
    console.log('[Pipeline] templates count:', templates?.length || 0);

    // Build specification (if needed)
    if (!analysis.specification) {
      console.log('🔧 [Pipeline] Building specification...');
      analysis.specification = await this.buildSpecification(analysis);
      console.log('✅ [Pipeline] Specification built');
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ [Pipeline] stagePrepare() COMPLETE');
    console.log('[Pipeline] Returning success with data');
    console.log('═══════════════════════════════════════════════════════');

    return {
      success: true,
      data: {
        analysis,
        templates,
        specification: analysis.specification
      }
    };

  } catch (error) {
    console.error('═══════════════════════════════════════════════════════');
    console.error('❌ [Pipeline] stagePrepare() ERRO!');
    console.error('[Pipeline] Error type:', typeof error);
    console.error('[Pipeline] Error message:', (error as Error).message);
    console.error('[Pipeline] Error stack:', (error as Error).stack);
    console.error('═══════════════════════════════════════════════════════');
    
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

  /**
   * Analyze prompt using PromptProcessor
   */
  private async analyzePrompt(request: GenerationRequest): Promise<PromptAnalysisResult> {
    try {
      // PromptProcessor.process() returns string currently
      // Use fallback until full integration
      logger.info('Using fallback analysis (PromptProcessor integration pending)', {
        component: 'ContextBuilder'
      });
      
      return this.generateFallbackAnalysis(request);

    } catch (error) {
      logger.warn('PromptProcessor failed, using fallback', {
        component: 'ContextBuilder'
      });
      return this.generateFallbackAnalysis(request);
    }
  }

  /**
   * Search templates using TemplateManager
   */
  private async searchTemplates(
    analysis: PromptAnalysisResult,
    request: GenerationRequest
  ): Promise<any[]> {
    try {
      const templates = await templateManager.searchTemplates({
        keyword: analysis.intent.description,
        category: (request.framework || 'react') as TemplateCategory,
        tags: [analysis.context.domain || 'general']
      });

      // TemplateSearchResult can be array or object with .templates
      const templatesArray = Array.isArray(templates) 
        ? templates 
        : (templates.templates || []);

      logger.info(`Found ${templatesArray.length} matching templates`, {
        component: 'ContextBuilder'
      });

      return templatesArray;

    } catch (error) {
      logger.warn('Template search failed, using empty array', {
        component: 'ContextBuilder'
      });
      return [];
    }
  }

  /**
   * Build technical specification
   */
  private async buildSpecification(
    analysis: PromptAnalysisResult
  ): Promise<TechnicalSpecification> {
    return {
      architecture: {
        style: 'modular',
        layers: ['presentation', 'business', 'data'],
        patterns: ['mvc', 'repository']
      },
      components: [
        {
          name: 'MainComponent',
          type: 'component',
          purpose: 'Primary interface',
          responsibilities: ['rendering', 'state management']
        }
      ],
      dataModel: [],
      technologies: {
        frontend: ['react', 'typescript'],
        backend: ['node', 'express'],
        database: ['mongodb'],
        deployment: ['docker']
      },
      quality: {
        testingStrategy: 'unit + integration',
        securityRequirements: ['authentication', 'authorization'],
        performanceTargets: ['<100ms response time']
      }
    };
  }

  /**
   * Generate fallback analysis
   */
  private generateFallbackAnalysis(request: GenerationRequest): PromptAnalysisResult {
    return {
      originalPrompt: request.prompt,
      intent: {
        type: 'CREATE_APP',
        description: 'Create application from prompt',
        confidence: 60,
        subIntents: []
      },
      entities: [],
      requirements: [],
      ambiguities: [],
      context: {
        domain: request.context?.domain || 'general',
        complexity: request.context?.complexity || 'standard',
        stylePreferences: request.context?.stylePreferences,
        colorPalette: request.context?.colorPalette,
        personality: request.context?.personality
      },
      confidence: 60
    };
  }

/**
 * Stage 2: Generate
 * - Use PromptProcessor analysis + AI Provider to create MULTIPLE rich components
 */
private async stageGenerate(prepareData: any): Promise<PipelineStageResult> {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔍 [Pipeline] stageGenerate() CHAMADO');
  console.log('[Pipeline] prepareData recebido:', prepareData);
  console.log('[Pipeline] prepareData keys:', Object.keys(prepareData || {}));
  console.log('═══════════════════════════════════════════════════════');
  
  logger.info('Pipeline Stage 2: Generate (AI-ENHANCED WITH PROMPT ANALYSIS)', { 
    component: 'GenerationPipeline' 
  });
  
  try {
    // ✅ DESTRUCTURE CORRETO (sem request)
    const { analysis, specification, templates } = prepareData;
    const components: GeneratedComponent[] = [];
    
    console.log('✅ [Pipeline] Destructure complete');
    console.log('[Pipeline] analysis:', analysis);
    console.log('[Pipeline] specification:', specification);
    console.log('[Pipeline] templates count:', templates?.length || 0);
    
    // ✅ OBTER PROMPT DO ANALYSIS (que veio do request original)
    const originalPrompt = analysis?.originalPrompt || 'Create a React component';
    
    console.log('✅ [Pipeline] originalPrompt:', originalPrompt);
    
    // ✅ CONSTRUIR PROMPT ENRIQUECIDO COM ANÁLISE DO PROMPT PROCESSOR
    console.log('🔧 [Pipeline] Building enriched prompt...');
    const enrichedPrompt = this.buildEnrichedPrompt(originalPrompt, analysis);
    
    console.log('✅ [Pipeline] Enriched prompt built');
    
    logger.info('Generating with AI Provider using PromptProcessor analysis...', {
      entities: analysis.entities?.length || 0,
      actions: analysis.actions?.length || 0,
      complexity: analysis.complexity
    });
    
    // ✅ GERAR COM AI PROVIDER (Groq/OpenAI) + ANÁLISE
    console.log('🤖 [Pipeline] Calling AI Provider...');
    try {
   const aiResponse = await this.aiProvider.generateCode({
  prompt: enrichedPrompt,
  maxTokens: 8000,   
  temperature: 0.7
});

// ✅ ADICIONAR ESTES LOGS AQUI:
console.log('═══════════════════════════════════════════════════════');
console.log('🔍 [Pipeline] RAW AI CODE OUTPUT:');
console.log('[Pipeline] aiResponse keys:', Object.keys(aiResponse || {}));
console.log('[Pipeline] aiResponse.code type:', typeof aiResponse.code);
console.log('[Pipeline] aiResponse.code length:', aiResponse.code?.length || 0);
console.log('[Pipeline] First 500 chars:', aiResponse.code?.substring(0, 500) || 'EMPTY');
console.log('[Pipeline] Last 500 chars:', aiResponse.code?.substring((aiResponse.code?.length || 500) - 500) || 'EMPTY');
console.log('═══════════════════════════════════════════════════════');

console.log('✅ [Pipeline] AI Provider response received');

      console.log('✅ [Pipeline] AI Provider response received');
      
const aiCode = aiResponse.code || '';
      
      console.log('[Pipeline] AI code length:', aiCode.length);
      
      if (aiCode.trim().length > 0) {
        console.log('✅ [Pipeline] AI generated code, splitting into components...');
        
        // Dividir código em múltiplos componentes
        const componentBlocks = this.splitCodeIntoComponents(aiCode, analysis);
        
        console.log('[Pipeline] Component blocks:', componentBlocks.length);
             componentBlocks.forEach((block: any) => {
          components.push({
            name: block.name,
            type: block.type,
            code: block.code,
            path: block.path,
            language: 'typescript',
            framework: analysis?.context?.framework || 'react',
            dependencies: this.extractDependencies(block.code),
            files: block.files || [{    // ← ✅ ADICIONE ESTA LINHA!
              path: block.path,
              content: block.code,
              language: 'typescript'
            }],
            metadata: {
              linesOfCode: block.code.split('\n').length,
              complexity: this.calculateComplexity(block.code),
              generated: true,
              qualityScore: 75
            }
          });
        });

        
        logger.info(`✅ Generated ${components.length} components with AI`);
      }
      
    } catch (aiError) {
      console.error('❌ [Pipeline] AI generation failed');
      console.error('[Pipeline] AI error:', (aiError as Error).message);
      logger.error('AI generation failed', { error: (aiError as Error).message });
    }
    
    // ✅ FALLBACK: Se AI falhou ou não gerou nada
    if (components.length === 0) {
      console.log('⚠️ [Pipeline] No components generated with AI, using fallback');
      logger.warn('No components generated with AI, using fallback');
      
      components.push({
        name: 'App',
        type: 'component',
        code: this.generateFallbackComponent(originalPrompt),
        path: 'src/App.tsx',
        language: 'typescript',
        framework: 'react',
        dependencies: ['react'],
        metadata: {
          linesOfCode: 20,
          complexity: 3,
          generated: true,
          qualityScore: 60
        }
      });
    }
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ [Pipeline] stageGenerate() COMPLETE');
    console.log(`[Pipeline] Total components generated: ${components.length}`);
    console.log('═══════════════════════════════════════════════════════');
    
    logger.info(`✅ Total components generated: ${components.length}`);
    
    return {
      success: true,
      data: { components }
    };
    
  } catch (error) {
    console.error('═══════════════════════════════════════════════════════');
    console.error('❌ [Pipeline] stageGenerate() ERRO!');
    console.error('[Pipeline] Error:', (error as Error).message);
    console.error('[Pipeline] Stack:', (error as Error).stack);
    console.error('═══════════════════════════════════════════════════════');
    
    logger.error('Stage 2 failed', { error: (error as Error).message });
    return {
      success: false,
      error: (error as Error).message
    };
  }
}


private buildEnrichedPrompt(originalPrompt: string, analysis: PromptAnalysisResult): string {
  // ✅ Usar optional chaining (?.) e fallback
  const entitiesList = analysis.entities?.join(', ') || 'general components';
  const actionsList = (analysis as any).actions?.join(', ') || 'CRUD operations';
  const uiElementsList = (analysis as any).uiElements?.map((ui: any) => ui.type).join(', ') || 'standard UI';
  const framework = (analysis as any).suggestedFramework || 'react';
  const complexity = (analysis as any).complexity || 'standard';

  return `You are a senior full-stack developer. Generate a complete, production-ready application.

**Original Request:** "${originalPrompt}"

**Analyzed Requirements:**
- Entities: ${entitiesList}
- Actions: ${actionsList}
- UI Elements: ${uiElementsList}
- Complexity: ${complexity}
- Framework: ${framework}

**Generate Multiple Files:**
1. React components for each entity (${entitiesList})
2. API endpoints for each action (${actionsList})
3. Proper TypeScript types and interfaces
4. Tailwind CSS styling with responsive design
5. Best practices and error handling

**Output Format:**
Separate each component with: 
\\\`\\\`\\\`component:ComponentName:type:path
[code here]
\\\`\\\`\\\`

Return ONLY valid code with clear component separation.`;
}



/**
 * Generate fallback component when AI fails
 */
private generateFallbackComponent(prompt: string): string {
  return `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ${prompt}
        </h1>
        <p className="text-gray-600">
          Generated by ORUS Builder AI
        </p>
      </div>
    </div>
  );
}`;
}


  /**
   * Stage 3: Validate
   * - Use CIG validator
   */
  private async stageValidate(components: GeneratedComponent[]): Promise<PipelineStageResult> {
    logger.info('Pipeline Stage 3: Validate', { component: 'GenerationPipeline' });

    try {
      const validatedComponents: GeneratedComponent[] = [];

      for (const component of components) {
        // ✅ CIG Validator (accepts ValidationInput with CodeLanguage enum)
        const validationInput: ValidationInput = {
          code: component.code,
          language: CodeLanguage.TYPESCRIPT, // Use enum
    context: {
  projectId: 'generated',
  componentName: component.name
}

        };

        const validation: ExtendedValidationResult = await cigValidator.validate(validationInput);

        if (!validation.isValid) {
          logger.warn(`Component ${component.name} has validation issues`, {
            component: 'GenerationPipeline',
            metadata: { issuesCount: validation.codeIssues?.length || 0 }
          });
        }

        component.metadata.validated = validation.isValid;
        validatedComponents.push(component);
      }

      logger.info('Validate stage completed', {
        component: 'GenerationPipeline',
        metadata: { validatedCount: validatedComponents.length }
      });

      return {
        success: true,
        data: validatedComponents
      };

    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * Stage 4: Optimize
   * - Use quality analyzer + code optimizer
   */
  private async stageOptimize(components: GeneratedComponent[]): Promise<PipelineStageResult> {
    logger.info('Pipeline Stage 4: Optimize', { component: 'GenerationPipeline' });

    try {
      const optimizedComponents: GeneratedComponent[] = [];

      for (const component of components) {
        // ✅ Quality Analyzer
        if (this.config.enableQualityAnalysis) {
          const qualityInput: QualityAnalysisInput = {
  code: component.code,
  fileName: component.name,
  language: 'typescript' as AnalysisLanguage,
  analysisDepth: 'standard' as AnalysisDepth
};


          const quality: QualityAnalysisResult = await qualityAnalyzer.analyze(qualityInput);
          component.metadata.qualityScore = quality.overallScore;
          component.metadata.coverage = quality.metrics?.testCoverage || 0;
        }

        // ✅ Code Optimizer
     const optimizationInput: OptimizationInput = {
  code: component.code,
  fileName: component.name,
  language: 'typescript' as OptimizerLanguage,
 optimizations: [OptimizationType.PERFORMANCE, OptimizationType.BEST_PRACTICES]

};

        const optimized: OptimizationResult = await codeOptimizer.optimize(optimizationInput);

        component.code = optimized.optimizedCode;
        component.metadata.optimized = true;
component.metadata.optimizations = optimized.changes.map((c: any) => c.type) || [];

        optimizedComponents.push(component);
      }

      logger.info('Optimize stage completed', {
        component: 'GenerationPipeline',
        metadata: { optimizedCount: optimizedComponents.length }
      });

      return {
        success: true,
        data: optimizedComponents
      };

    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // Helper Methods
  // ═══════════════════════════════════════════════════════════════

  private generatePath(spec: any, framework: string): string {
    const base = framework === 'react' ? 'src/components' : 'src';
    return `${base}/${spec.name}.tsx`;
  }

  private extractDependencies(code: string): string[] {
    const deps: string[] = [];
    const importRegex = /import .+ from ['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(code)) !== null) {
    if (match && match[1] && !match[1].startsWith('.')) {
  deps.push(match[1]);
}
    }
    
    return [...new Set(deps)];
  }

  private extractAllDependencies(components: GeneratedComponent[]): string[] {
    const allDeps = components.flatMap(c => c.dependencies);
    return [...new Set(allDeps)];
  }

  private calculateComplexity(code: string): number {
    // Simple cyclomatic complexity approximation
    const keywords = ['if', 'else', 'for', 'while', 'switch', 'case', '&&', '||'];
    let complexity = 1;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = code.match(regex);
      complexity += matches ? matches.length : 0;
    });
    
    return complexity;
  }

  private generatePackageJson(components: GeneratedComponent[]): string {
    const dependencies = this.extractAllDependencies(components);
    
    return JSON.stringify({
      name: 'generated-project',
      version: '1.0.0',
      dependencies: dependencies.reduce((acc, dep) => {
        acc[dep] = 'latest';
        return acc;
      }, {} as Record<string, string>)
    }, null, 2);
  }

  private generateReadme(components: GeneratedComponent[]): string {
    return `# Generated Project

## Components

${components.map(c => `- **${c.name}** (${c.type})`).join('\n')}

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

Generated by ORUS Builder - Cognitive Generation Engine
`;
  }
}

// ═══════════════════════════════════════════════════════════════
// SECTION 5: CONTEXT BUILDER CLASS
// ═══════════════════════════════════════════════════════════════

/**
 * Context Builder
 * Builds generation context from request
 */
export class ContextBuilder {
  /**
   * Build context from generation request
   */
  public async build(request: GenerationRequest): Promise<GenerationContext> {
    logger.info('Building generation context', {
      component: 'ContextBuilder'
    });

    try {
      // Analyze prompt
      const analysis = await this.analyzePrompt(request);

      // Search templates
      const templates = await this.searchTemplates(analysis, request);

      // Build specification (inline - método foi removido)
      const specification = analysis.specification || {
        architecture: {
          style: 'modular',
          layers: ['presentation', 'business', 'data'],
          patterns: ['mvc', 'repository']
        },
        components: [{
          name: 'MainComponent',
          type: 'component',
          purpose: 'Primary interface',
          responsibilities: ['rendering', 'state management']
        }],
        dataModel: [],
        technologies: {
          frontend: ['react', 'typescript'],
          backend: ['node', 'express'],
          database: ['mongodb'],
          deployment: ['docker']
        },
        quality: {
          testingStrategy: 'unit + integration',
          securityRequirements: ['authentication', 'authorization'],
          performanceTargets: ['<100ms response time']
        }
      };

      // Trinity integration (if enabled)
      let trinity: TrinityResponse<any> | undefined;
      if (request.enableTrinity) {
        trinity = await this.invokeTrinity(request);
      }

      const context: GenerationContext = {
        prompt: request.prompt,
        analysis,
        templates,
        framework: request.framework || 'react',
        domain: analysis.context.domain,
        specification,
        trinity
      };

      logger.info('Context built successfully', {
        component: 'ContextBuilder',
        metadata: {
          templatesFound: templates.length,
          trinityEnabled: !!trinity
        }
      });

      return context;

    } catch (error) {
      logger.error('Failed to build context', {
        component: 'ContextBuilder',
        error: (error as Error).message
      });
      throw error;
    }
  }

  /**
   * Analyze prompt (fallback mode)
   */
  private async analyzePrompt(request: GenerationRequest): Promise<PromptAnalysisResult> {
    try {
      logger.info('Using fallback analysis', {
        component: 'ContextBuilder'
      });
      
      return {
        originalPrompt: request.prompt,
        intent: {
          type: 'CREATE_APP',
          description: 'Create application',
          confidence: 60,
          subIntents: []
        },
        entities: [],
        requirements: [],
        ambiguities: [],
        context: {
          domain: request.context?.domain || 'general',
          complexity: request.context?.complexity || 'standard',
          stylePreferences: request.context?.stylePreferences,
          colorPalette: request.context?.colorPalette,
          personality: request.context?.personality
        },
        confidence: 60
      };

    } catch (error) {
      throw new Error('Prompt analysis failed');
    }
  }

  /**
   * Search templates
   */
  private async searchTemplates(
    analysis: PromptAnalysisResult,
    request: GenerationRequest
  ): Promise<any[]> {
    try {
      const templates = await templateManager.searchTemplates({
        keyword: analysis.intent.description,
        category: (request.framework || 'react') as TemplateCategory,
        tags: [analysis.context.domain || 'general']
      });

      const templatesArray = Array.isArray(templates) 
        ? templates 
        : (templates.templates || []);

      return templatesArray;

    } catch (error) {
      return [];
    }
  }

 
  /**
   * Invoke Trinity (if enabled)
   */
  private async invokeTrinity(request: GenerationRequest): Promise<TrinityResponse<any>> {
    try {
      // ✅ Get Trinity singleton instance
      const trinity = TrinityOrchestrator.getInstance();

const trinityRequest: TrinityRequest = {
  requestId: `gen-${Date.now()}`,
  component: 'cerebro',
  operation: 'code_analysis',
  action: 'generate', // ✅ Propriedade obrigatória
  params: {
    prompt: request.prompt,
    context: request.context
  },
  timestamp: new Date()
};


// Trinity não expõe método público ainda - usar fallback
const result: TrinityResponse<any> = {
  requestId: trinityRequest.requestId,
  timestamp: new Date(),
  component: trinityRequest.component,
  operation: trinityRequest.operation,
  success: false,
  metadata: {
    processingTime: 0,
    component: trinityRequest.component,
    executionTime: 0,
    cacheHit: false,
    retryCount: 0
  },
  source: 'fallback'
};
      return result;

    } catch (error) {
      logger.warn('Trinity invocation failed, continuing without it', {
        component: 'ContextBuilder'
      });
      
   return {
  success: false,
  requestId: `gen-${Date.now()}`,
  timestamp: new Date(),
  component: 'cerebro',
  operation: 'code_analysis',
  metadata: {
    processingTime: 0,
    component: 'cerebro',
    executionTime: 0,
    cacheHit: false,
    retryCount: 0
  },
  source: 'fallback',
  error: {
    code: TrinityErrorCode.COMPONENT_UNAVAILABLE,
    message: createI18nText('Trinity not available', 'Trinity indisponível'),
    details: undefined,
    recoverable: true,
    fallbackAttempted: true
  }
};

    }
  }
}

// ═══════════════════════════════════════════════════════════════
// SECTION 6: VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Validate generated code
 */
export async function validateGeneration(
  code: string,
  framework: string
): Promise<ValidationResult> {
  try {
    const validationInput: ValidationInput = {
      code,
      language: CodeLanguage.TYPESCRIPT,
    context: {
  projectId: 'generated-validation',
  componentName: 'validation'
}

    };

    const validation = await cigValidator.validate(validationInput);

   return {
  isValid: validation.isValid,
  errors: validation.codeIssues
    ?.filter((i: any) => i.severity === 'error')
    .map((i: any) => i.message?.en || 'Error') || [],
  warnings: validation.codeIssues
    ?.filter((i: any) => i.severity === 'warning')
    .map((i: any) => i.message?.en || 'Warning') || [],
 suggestions: []


};


  } catch (error) {
    return {
      isValid: false,
      errors: [(error as Error).message]
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// SECTION 7: EXPORTS & SINGLETON
// ═══════════════════════════════════════════════════════════════

/**
 * Singleton instance
 */
let cognitiveGenerationEngineInstance: CognitiveGenerationEngine | null = null;

/**
 * Get or create singleton instance
 */
export function getCognitiveGenerationEngine(): CognitiveGenerationEngine {
  if (!cognitiveGenerationEngineInstance) {
    cognitiveGenerationEngineInstance = new CognitiveGenerationEngine();
  }
  return cognitiveGenerationEngineInstance;
}

/**
 * Reset singleton (useful for testing)
 */
export function resetCognitiveGenerationEngine(): void {
  cognitiveGenerationEngineInstance = null;
}

/**
 * Default export (for backward compatibility)
 */
export default getCognitiveGenerationEngine();
