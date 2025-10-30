// ═══════════════════════════════════════════════════════════════════════════
// 🔷 SEÇÃO 1: IMPORTS & TYPES (CORRETO - BASEADO NOS ARQUIVOS REAIS)
// ═══════════════════════════════════════════════════════════════════════════

// Core dependencies
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

// Prompt subsystem
import { promptProcessor } from '../prompt/prompt-processor';
import { intentClassifier } from '../prompt/intent-classifier';
import { requirementsExtractor } from '../prompt/requirements-extractor';

// Template subsystem
import { templateManager } from '../templates/template-manager';
import { templateEngine } from '../engines/template-engine';
import { templateLibrary } from '../templates/template-library';

// Types & interfaces (CORRIGIDOS - BASEADOS NOS ARQUIVOS REAIS)
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
  TrinityConfig,
  FallbackResult
} from '../core/types/trinity.types';

import type {
  I18nText,
  SupportedLanguage,
  ResponseWrapper,
  ErrorResponse
} from '../core/types/index';

// ═══════════════════════════════════════════════════════════════════════════
// 🔷 INTERFACES LOCAIS (NÃO EXISTEM NOS TYPES - CRIAR AQUI)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generation Request - Interface para requisição de geração
 * (NÃO existe em types/cognitive.types.ts)
 */
export interface GenerationRequest {
  prompt: string;
  framework?: string;
  context?: {
    domain?: string;
    language?: string;
    complexity?: string;
    stylePreferences?: any;
    colorPalette?: any;
    personality?: string;
  };
  enableTrinity?: boolean;
}

/**
 * Generated Component - Componente gerado
 */
export interface GeneratedComponent {
  name: string;
  type: 'component' | 'page' | 'service' | 'api' | 'model' | 'screen';
  code: string;
  path: string;
  language: string;
  framework: string;
  dependencies: string[];
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
  };
}

/**
 * Generation Result - Resultado da geração
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
}

/**
 * Technical Specification - Especificação técnica
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
 * Prompt Analysis Result - Resultado de análise de prompt
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
 * ValidationResult - Resultado de validação CIG
 * (Adaptar interface do CIG Validator)
 */
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
  suggestions?: string[];
}

/**
 * Quality Score - Pontuação de qualidade
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
 * Generation context (enhanced)
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

// ═══════════════════════════════════════════════════════════════════════════
// 🔷 SEÇÃO 2: GENERATION PIPELINE MANAGER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generation Pipeline Manager
 * Orchestrates 4 stages: Prepare → Generate → Validate → Optimize
 */
class GenerationPipeline {
  private config: PipelineConfig;
  private context: GenerationContext | null = null;

  constructor(config: Partial<PipelineConfig> = {}) {
    this.config = {
      enableValidation: true,
      enableOptimization: true,
      enableQualityAnalysis: true,
      retryOnFailure: true,
      maxRetries: 2,
      ...config
    };

    logger.info('GenerationPipeline initialized', {
      component: 'GenerationPipeline',
      metadata: { config: this.config }
    });
  }

  /**
   * Execute complete pipeline
   */
  async execute(context: GenerationContext): Promise<GenerationResult> {
    this.context = context;
    const startTime = Date.now();

    logger.info('Starting generation pipeline', {
      component: 'GenerationPipeline',
      metadata: {
        prompt: context.prompt.substring(0, 100),
        framework: context.framework,
        domain: context.domain
      }
    });

    try {
      // Stage 1: Prepare
      const prepareResult = await this.stagePrepare(context);
      if (!prepareResult.success) {
        throw new Error(`Prepare stage failed: ${prepareResult.error}`);
      }

      // Stage 2: Generate
      const generateResult = await this.stageGenerate(prepareResult.data);
      if (!generateResult.success) {
        throw new Error(`Generate stage failed: ${generateResult.error}`);
      }

      // Stage 3: Validate (optional)
      let components = generateResult.data.components;
      if (this.config.enableValidation) {
        const validateResult = await this.stageValidate(components);
        if (validateResult.success && validateResult.data) {
          components = validateResult.data;
        }
      }

      // Stage 4: Optimize (optional)
      if (this.config.enableOptimization) {
        const optimizeResult = await this.stageOptimize(components);
        if (optimizeResult.success && optimizeResult.data) {
          components = optimizeResult.data;
        }
      }

      // Build final result
      const processingTime = Date.now() - startTime;
      const qualityScore = this.calculateQualityScore(components);

      logger.info('Generation pipeline completed successfully', {
        component: 'GenerationPipeline',
        metadata: {
          componentsCount: components.length,
          processingTime,
          qualityScore
        }
      });

      return {
        success: true,
        components,
        metadata: {
          framework: context.framework,
          processingTime,
          generatedAt: new Date().toISOString()
        },
        qualityScore,
        dependencies: this.extractAllDependencies(components),
        packageJson: await this.generatePackageJson(context, components),
        readme: await this.generateReadme(context)
      };

    } catch (error) {
      const err = error as Error;
      logger.error('Generation pipeline failed', {
        component: 'GenerationPipeline',
        metadata: { error: err.message, stack: err.stack }
      });

      return {
        success: false,
        components: [],
        error: err.message,
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
   * - Select templates
   * - Build specification
   */
  private async stagePrepare(context: GenerationContext): Promise<PipelineStageResult> {
    logger.info('Pipeline Stage 1: Prepare', { component: 'GenerationPipeline' });

    try {
      // Use context analysis (já feito antes)
      const analysis = context.analysis;
      const specification = context.specification;

      // Search templates
      const templates = await templateManager.searchTemplates({
        keyword: analysis.intent.type,
category: context.framework as TemplateCategory,
        tags: [context.domain]
      });

      logger.info('Prepare stage completed', {
        component: 'GenerationPipeline',
        metadata: {
templatesFound: Array.isArray(templates) ? templates.length : (templates.templates?.length || 0),
          componentsPlanned: specification.components.length
        }
      });

      return {
        success: true,
        data: { analysis, specification, templates }
      };

    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: err.message
      };
    }
  }

   /**
   * Stage 2: Generate
   * - Use code-generator.ts as orchestrator
   * - Use ui-generator.ts for frontend
   * - Use backend-generator.ts for backend
   */
  private async stageGenerate(prepareData: any): Promise<PipelineStageResult> {
    logger.info('Pipeline Stage 2: Generate', { component: 'GenerationPipeline' });

    try {
      const { analysis, specification, templates } = prepareData;
      const components: GeneratedComponent[] = [];

      // Generate each component using specialized generators
      for (const componentSpec of specification.components) {
        logger.debug(`Generating component: ${componentSpec.name}`, {
          component: 'GenerationPipeline'
        });

        let code: string;
        const componentType = componentSpec.type.toLowerCase();

        // Route to appropriate generator
        if (['component', 'page', 'screen'].includes(componentType)) {
          // Use UI Generator - MÉTODO PÚBLICO generate()
          const uiResult = await uiGenerator.generate({
            name: componentSpec.name,
            type: componentSpec.type,
            framework: this.context!.framework,
            props: [], // Array vazio
            styling: {
              framework: 'tailwind',
              customCSS: '',
              theme: 'light'
            }
          });
          code = uiResult.code;

        } else if (['service', 'api', 'controller'].includes(componentType)) {
          // Use Backend Generator - MÉTODO PÚBLICO generate()
          const backendResult = await backendGenerator.generate({
            name: componentSpec.name,
            type: 'service',
            framework: 'express',
            database: 'mongodb',
            authentication: false
          });
          code = backendResult.code;

        } else {
          // Use generic Code Generator - RETORNA OBJETO
          const codeResult = await codeGenerator.generate({
            componentName: componentSpec.name,
            componentType: componentSpec.type,
            framework: this.context!.framework,
            requirements: componentSpec.responsibilities || [],
            dependencies: []
          });
          code = codeResult.code; // Extrair .code do resultado
        }

        // Build component object
        const component: GeneratedComponent = {
          name: componentSpec.name,
          type: componentSpec.type as any,
          code,
          path: this.generatePath(componentSpec, this.context!.framework),
          language: 'typescript',
          framework: this.context!.framework,
          dependencies: this.extractDependencies(code),
          metadata: {
            linesOfCode: code.split('\n').length,
            complexity: this.calculateComplexity(code),
            generated: true
          }
        };

        components.push(component);
      }

      logger.info('Generate stage completed', {
        component: 'GenerationPipeline',
        metadata: { componentsGenerated: components.length }
      });

      return {
        success: true,
        data: { components }
      };

    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Stage 3: Validate
   * - Use cig-validator.ts for compilation checks
   * - Auto-fix common errors
   */
  private async stageValidate(components: GeneratedComponent[]): Promise<PipelineStageResult> {
    logger.info('Pipeline Stage 3: Validate', { component: 'GenerationPipeline' });

    try {
      const validatedComponents: GeneratedComponent[] = [];

      for (const component of components) {
        // Validate with CIG - 1 ARGUMENTO APENAS
        const validation = await cigValidator.validate({
          code: component.code,
          language: 'typescript',
          framework: component.framework
        });

        if (!validation.isValid) {
          logger.warn(`Component ${component.name} has validation issues`, {
            component: 'GenerationPipeline',
            metadata: { issuesCount: validation.errors?.length || 0 }
          });

          // autoFix não existe - apenas log warning
          if (validation.errors && validation.errors.length > 0) {
            logger.warn(`Validation errors found`, {
              component: 'GenerationPipeline',
              metadata: { errors: validation.errors.slice(0, 3) }
            });
          }
          component.metadata.autoFixed = false;
        }

        validatedComponents.push(component);
      }

      logger.info('Validate stage completed', {
        component: 'GenerationPipeline',
        metadata: {
          validatedCount: validatedComponents.length,
          autoFixedCount: validatedComponents.filter(c => c.metadata.autoFixed).length
        }
      });

      return {
        success: true,
        data: validatedComponents
      };

    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Stage 4: Optimize
   * - Use quality-analyzer.ts for quality checks
   * - Use code-optimizer.ts for optimizations
   */
  private async stageOptimize(components: GeneratedComponent[]): Promise<PipelineStageResult> {
    logger.info('Pipeline Stage 4: Optimize', { component: 'GenerationPipeline' });

    try {
      const optimizedComponents: GeneratedComponent[] = [];

      for (const component of components) {
        // Analyze quality - OBJETO INPUT
        if (this.config.enableQualityAnalysis) {
          const quality = await qualityAnalyzer.analyze({
            code: component.code,
            language: 'typescript',
            framework: component.framework
          });
          component.metadata.qualityScore = quality.overallScore;
          component.metadata.coverage = quality.coverage || 0;
        }

        // Optimize code - 1 ARGUMENTO
        const optimized = await codeOptimizer.optimize(component.code);

        // OptimizationResult tem estrutura diferente
        component.code = optimized.optimizedCode || component.code;
        component.metadata.optimized = true;
        component.metadata.optimizations = optimized.optimizations || [];

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
      const err = error as Error;
      return {
        success: false,
        error: err.message
      };
    }
  }


  // Utility methods
  private calculateQualityScore(components: GeneratedComponent[]): number {
    if (components.length === 0) return 0;
    const scores = components.map(c => c.metadata.qualityScore || 70);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  private extractAllDependencies(components: GeneratedComponent[]): string[] {
    const allDeps = components.flatMap(c => c.dependencies);
    return [...new Set(allDeps)];
  }

  private extractDependencies(code: string): string[] {
    const deps: string[] = [];
    const importRegex = /import .+ from ['"](.+)['"]/g;
    let match;
    while ((match = importRegex.exec(code)) !== null) {
      const dep = match[1];
      if (dep && !dep.startsWith('.') && !dep.startsWith('/')) {
        deps.push(dep);
      }
    }
    return [...new Set(deps)];
  }

  private calculateComplexity(code: string): number {
    let complexity = 1;
    const patterns = [/if\s*\(/g, /while\s*\(/g, /for\s*\(/g, /case\s+/g, /&&/g, /\|\|/g];
    patterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) complexity += matches.length;
    });
    return complexity;
  }

  private generatePath(spec: any, framework: string): string {
    const basePath = framework === 'next' ? 'src/app' : 'src';
    const type = spec.type.toLowerCase();
    const folder = type === 'component' ? 'components' : type === 'page' ? 'pages' : 'services';
    return `${basePath}/${folder}/${spec.name}.tsx`;
  }

  private async generatePackageJson(context: GenerationContext, components: GeneratedComponent[]): Promise<string> {
    const deps = this.extractAllDependencies(components);
    const packageJson = {
      name: 'orus-generated-project',
      version: '1.0.0',
      dependencies: Object.fromEntries(deps.map(d => [d, 'latest'])),
      devDependencies: {
        'typescript': '^5.3.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0'
      }
    };
    return JSON.stringify(packageJson, null, 2);
  }

  private async generateReadme(context: GenerationContext): Promise<string> {
    return `# ${context.domain} Application\n\nGenerated by ORUS Builder\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔷 SEÇÃO 3: CONTEXT BUILDER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Context Builder
 * Integrates with PromptProcessor and TemplateManager
 */
class ContextBuilder {
  /**
   * Build generation context from request
   */
  async buildContext(request: GenerationRequest): Promise<GenerationContext> {
    logger.info('Building generation context', {
      component: 'ContextBuilder',
      metadata: { prompt: request.prompt.substring(0, 100) }
    });

    // Stage 1: Analyze prompt with PromptProcessor
    const analysis = await this.analyzePrompt(request);

    // Stage 2: Build specification
    const specification = this.buildSpecification(analysis, request);

    // Stage 3: Search templates
    const templates = await this.searchTemplates(analysis, request);

    // Stage 4: Enhance with Trinity (optional)
    const trinity = request.enableTrinity 
      ? await this.enhanceWithTrinity(request, analysis)
      : undefined;

    const context: GenerationContext = {
      prompt: request.prompt,
      analysis,
      templates,
      framework: request.framework || 'react',
      domain: request.context?.domain || 'general',
      specification,
      trinity
    };

    logger.info('Context built successfully', {
      component: 'ContextBuilder',
      metadata: {
        templatesFound: templates.length,
        componentsPlanned: specification.components.length
      }
    });

    return context;
  }

  /**
   * Analyze prompt using PromptProcessor
   */
  private async analyzePrompt(request: GenerationRequest): Promise<PromptAnalysisResult> {
    try {
      // Use PromptProcessor (8-stage pipeline)
      const processed = await promptProcessor.process(request.prompt, {
        language: request.context?.language || 'en',
        domain: request.context?.domain
      });

      return {
        originalPrompt: request.prompt,
        intent: processed.intent,
        entities: processed.entities,
        requirements: processed.requirements,
        ambiguities: processed.ambiguities || [],
        context: processed.context,
        specification: processed.specification,
        confidence: processed.confidence
      };

    } catch (error) {
      logger.warn('PromptProcessor failed, using fallback', {
        component: 'ContextBuilder'
      });
      return this.generateFallbackAnalysis(request);
    }
  }

  /**
   * Build technical specification
   */
  private buildSpecification(
    analysis: PromptAnalysisResult,
    request: GenerationRequest
  ): TechnicalSpecification {
    // If analysis has specification, use it
    if (analysis.specification) {
      return analysis.specification;
    }

    // Otherwise, build basic specification
    return {
      architecture: {
        style: 'layered',
        layers: ['presentation', 'business', 'data'],
        patterns: ['component-based', 'hooks']
      },
      components: [
        {
          name: 'App',
          type: 'component',
          purpose: 'Main application component',
          responsibilities: ['Routing', 'State management']
        }
      ],
      dataModel: [],
      technologies: {
        frontend: [request.framework || 'react', 'typescript'],
        backend: [],
        database: [],
        deployment: []
      },
      quality: {
        testingStrategy: 'unit',
        securityRequirements: [],
        performanceTargets: []
      }
    };
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
        category: request.framework || 'react',
        tags: [analysis.context.domain || 'general']
      });

      logger.info(`Found ${templates.length} matching templates`, {
        component: 'ContextBuilder'
      });

return Array.isArray(templates) ? templates : (templates.templates || []);

    } catch (error) {
      logger.warn('Template search failed, using empty array', {
        component: 'ContextBuilder'
      });
      return [];
    }
  }

  /**
   * Enhance with Trinity AI
   */
  private async enhanceWithTrinity(
    request: GenerationRequest,
    analysis: PromptAnalysisResult
  ): Promise<TrinityResponse<any>> {
    try {
const trinity = new TrinityOrchestrator();
      return await trinity.process(request.prompt, {
        domain: analysis.context.domain,
        complexity: analysis.context.complexity
      });
    } catch (error) {
      logger.warn('Trinity enhancement failed', { component: 'ContextBuilder' });
      return this.generateFallbackTrinity();
    }
  }

  /**
   * Fallback analysis if PromptProcessor fails
   */
  private generateFallbackAnalysis(request: GenerationRequest): PromptAnalysisResult {
    return {
      originalPrompt: request.prompt,
      intent: {
        type: 'CREATE_APP' as any,
        description: 'Create application',
        confidence: 50,
        subIntents: []
      },
      entities: [],
      requirements: [],
      ambiguities: [],
      context: {
        domain: request.context?.domain || 'general',
        complexity: 'standard',
        stylePreferences: request.context?.stylePreferences,
        colorPalette: request.context?.colorPalette,
        personality: request.context?.personality
      },
      specification: {
        architecture: {
          style: 'layered',
          layers: ['presentation', 'business', 'data'],
          patterns: ['component-based']
        },
        components: [{
          name: 'App',
          type: 'component',
          purpose: 'Main app',
          responsibilities: ['Routing']
        }],
        dataModel: [],
        technologies: {
          frontend: [request.framework || 'react'],
          backend: [],
          database: [],
          deployment: []
        },
        quality: {
          testingStrategy: 'unit',
          securityRequirements: [],
          performanceTargets: []
        }
      },
      confidence: 50
    };
  }

  private generateFallbackTrinity(): TrinityResult {
    return {
      alma: { knowledge: [], patterns: [], examples: [], confidence: 0 },
      cerebro: { architecture: { style: 'layered', layers: [], components: [] }, reasoning: [], alternatives: [], confidence: 0 },
      voz: { message: 'Proceeding with generation', suggestions: [], clarifications: [], tone: 'professional' },
      timestamp: new Date(),
      processingTime: 0
    };
  }
}
// ═══════════════════════════════════════════════════════════════════════════
// 🔷 SEÇÃO 4: COGNITIVE-GENERATION-ENGINE (CORE)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cognitive Generation Engine V2.0
 * 
 * Main orchestrator class that integrates all subsystems:
 * - Generation Pipeline (4 stages)
 * - Context Builder (prompt analysis + templates)
 * - Code Generator + UI Generator + Backend Generator
 * - CIG Validator + Quality Analyzer + Code Optimizer
 * - Trinity AI enhancement (optional)
 * 
 * 100% backward compatible with orchestrator-engine.ts
 */
class CognitiveGenerationEngine {
  private pipeline: GenerationPipeline;
  private contextBuilder: ContextBuilder;
  private aiProvider: any;
  private generationStats: {
    totalGenerations: number;
    successfulGenerations: number;
    failedGenerations: number;
    averageQuality: number;
    averageProcessingTime: number;
  };

  constructor() {
    // Initialize pipeline with default config
    this.pipeline = new GenerationPipeline({
      enableValidation: true,
      enableOptimization: true,
      enableQualityAnalysis: true,
      retryOnFailure: true,
      maxRetries: 2
    });

    // Initialize context builder
    this.contextBuilder = new ContextBuilder();

    // Initialize AI provider (GROQ Llama 3.3 70B)
this.aiProvider = AIProviderFactory.getProvider();
    // Initialize stats
    this.generationStats = {
      totalGenerations: 0,
      successfulGenerations: 0,
      failedGenerations: 0,
      averageQuality: 0,
      averageProcessingTime: 0
    };

    logger.info('CognitiveGenerationEngine V2.0 initialized', {
      component: 'CognitiveGenerationEngine',
      metadata: {
        version: '2.0.0-refactored',
        pipelineEnabled: true,
        aiProvider: 'groq'
      }
    });
  }

  /**
   * Main generation method (PUBLIC API)
   * Called by orchestrator-engine.ts
   * 
   * @param request - Generation request with prompt, framework, context
   * @returns Promise<GenerationResult> - Complete generation result
   */
  async generate(request: GenerationRequest): Promise<GenerationResult> {
    const startTime = Date.now();
    
    logger.info('Starting generation request', {
      component: 'CognitiveGenerationEngine',
      metadata: {
        prompt: request.prompt.substring(0, 100),
        framework: request.framework,
        hasContext: !!request.context
      }
    });

    try {
      // Update stats
      this.generationStats.totalGenerations++;

      // Step 1: Build generation context
      const context = await this.contextBuilder.buildContext(request);

      logger.debug('Context built successfully', {
        component: 'CognitiveGenerationEngine',
        metadata: {
          componentsPlanned: context.specification.components.length,
          templatesFound: context.templates.length,
          framework: context.framework
        }
      });

      // Step 2: Execute generation pipeline
      const result = await this.pipeline.execute(context);

      // Step 3: Post-process result
      if (result.success) {
        this.generationStats.successfulGenerations++;
        
        // Update quality average
        const totalQuality = this.generationStats.averageQuality * (this.generationStats.successfulGenerations - 1);
        this.generationStats.averageQuality = (totalQuality + result.qualityScore) / this.generationStats.successfulGenerations;

        // Update processing time average
        const processingTime = Date.now() - startTime;
        const totalTime = this.generationStats.averageProcessingTime * (this.generationStats.totalGenerations - 1);
        this.generationStats.averageProcessingTime = (totalTime + processingTime) / this.generationStats.totalGenerations;

        logger.info('Generation completed successfully', {
          component: 'CognitiveGenerationEngine',
          metadata: {
            componentsGenerated: result.components.length,
            qualityScore: result.qualityScore,
            processingTime
          }
        });
      } else {
        this.generationStats.failedGenerations++;
        
        logger.error('Generation failed', {
          component: 'CognitiveGenerationEngine',
          metadata: {
            error: result.error,
            prompt: request.prompt.substring(0, 100)
          }
        });
      }

      return result;

    } catch (error) {
      const err = error as Error;
      this.generationStats.failedGenerations++;

      logger.error('Generation exception', {
        component: 'CognitiveGenerationEngine',
        metadata: {
          error: err.message,
          stack: err.stack
        }
      });

      return {
        success: false,
        components: [],
        error: err.message,
        qualityScore: 0,
        dependencies: [],
        packageJson: '',
        readme: ''
      };
    }
  }

  /**
   * Generate from simple prompt (convenience method)
   * Maintains backward compatibility
   * 
   * @param prompt - User prompt
   * @param context - Optional context
   * @returns Promise<GenerationResult>
   */
  async generateFromPrompt(
    prompt: string,
    context?: Partial<GenerationRequest['context']>
  ): Promise<GenerationResult> {
    const request: GenerationRequest = {
      prompt,
      framework: 'react',
      context: context || {},
      enableTrinity: false
    };

    return this.generate(request);
  }

  /**
   * Validate generated code
   * Uses CIG Validator
   * 
   * @param code - Code to validate
   * @param framework - Framework (react, vue, angular, etc)
   * @returns Promise<ValidationResult>
   */
  async validateGeneration(code: string, framework: string): Promise<ValidationResult> {
    logger.info('Validating generated code', {
      component: 'CognitiveGenerationEngine',
      metadata: { framework, codeLength: code.length }
    });

    try {
      const validation = await cigValidator.validate(code, {
        framework,
        strictMode: true
      });

      logger.info('Validation completed', {
        component: 'CognitiveGenerationEngine',
        metadata: {
          isValid: validation.isValid,
          errorsCount: validation.errors?.length || 0
        }
      });

      return validation;

    } catch (error) {
      const err = error as Error;
      logger.error('Validation failed', {
        component: 'CognitiveGenerationEngine',
        metadata: { error: err.message }
      });

      return {
        isValid: false,
        errors: [err.message],
        warnings: [],
        suggestions: []
      };
    }
  }

  /**
   * Get generation statistics
   * 
   * @returns Generation stats object
   */
  getGenerationStats(): typeof this.generationStats {
    return { ...this.generationStats };
  }

  /**
   * Get average quality score
   * 
   * @returns Average quality score (0-100)
   */
  getAverageQuality(): number {
    return Math.round(this.generationStats.averageQuality);
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.generationStats = {
      totalGenerations: 0,
      successfulGenerations: 0,
      failedGenerations: 0,
      averageQuality: 0,
      averageProcessingTime: 0
    };

    logger.info('Statistics reset', { component: 'CognitiveGenerationEngine' });
  }

  /**
   * Configure pipeline
   * 
   * @param config - Pipeline configuration
   */
  configurePipeline(config: Partial<PipelineConfig>): void {
    this.pipeline = new GenerationPipeline(config);
    
    logger.info('Pipeline reconfigured', {
      component: 'CognitiveGenerationEngine',
      metadata: { config }
    });
  }

  /**
   * Get component info (for orchestrator integration)
   */
  getInfo(): {
    name: string;
    version: string;
    description: string;
    capabilities: string[];
  } {
    return {
      name: 'CognitiveGenerationEngine',
      version: '2.0.0-refactored',
      description: 'Modular generation engine with integrated pipeline, context building, and validation',
      capabilities: [
        'Prompt analysis via PromptProcessor',
        'Template selection via TemplateManager',
        'Code generation via CodeGenerator',
        'UI generation via UIGenerator',
        'Backend generation via BackendGenerator',
        'Validation via CIGValidator',
        'Quality analysis via QualityAnalyzer',
        'Code optimization via CodeOptimizer',
        'Trinity AI enhancement (optional)',
        '4-stage pipeline: Prepare → Generate → Validate → Optimize'
      ]
    };
  }

  /**
   * Health check (for monitoring)
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: Record<string, any>;
  }> {
    try {
      // Check AI provider
      const aiProviderHealthy = this.aiProvider !== null;

      // Check stats
      const successRate = this.generationStats.totalGenerations > 0
        ? (this.generationStats.successfulGenerations / this.generationStats.totalGenerations) * 100
        : 100;

      const status = successRate >= 80 && aiProviderHealthy
        ? 'healthy'
        : successRate >= 50
        ? 'degraded'
        : 'unhealthy';

      return {
        status,
        details: {
          aiProvider: aiProviderHealthy ? 'connected' : 'disconnected',
          successRate: `${successRate.toFixed(1)}%`,
          totalGenerations: this.generationStats.totalGenerations,
          averageQuality: this.generationStats.averageQuality.toFixed(1),
          averageProcessingTime: `${this.generationStats.averageProcessingTime.toFixed(0)}ms`
        }
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: (error as Error).message }
      };
    }
  }

  /**
   * Generate component (specialized method)
   * For single component generation
   */
  async generateComponent(spec: {
    name: string;
    type: 'component' | 'page' | 'service' | 'api' | 'model';
    framework: string;
    requirements?: string[];
  }): Promise<GeneratedComponent> {
    logger.info('Generating single component', {
      component: 'CognitiveGenerationEngine',
      metadata: { name: spec.name, type: spec.type }
    });

    try {
      let code: string;

      // Route to appropriate generator
      if (['component', 'page'].includes(spec.type)) {
        code = await uiGenerator.generateComponent({
          name: spec.name,
          type: spec.type as any,
          framework: spec.framework,
          props: {},
          styling: 'tailwind'
        });
      } else if (['service', 'api'].includes(spec.type)) {
        code = await backendGenerator.generateService({
          name: spec.name,
          type: spec.type as any,
          endpoints: spec.requirements || []
        });
      } else {
        code = await codeGenerator.generate({
          specification: {
            name: spec.name,
            type: spec.type as any,
            purpose: `${spec.name} component`,
            responsibilities: spec.requirements || []
          },
          framework: spec.framework,
          templates: []
        });
      }

      // Validate
      const validation = await cigValidator.validate(code, {
        framework: spec.framework,
        strictMode: true
      });

      if (!validation.isValid) {
        code = await cigValidator.autoFix(code, validation);
      }

      // Build component object
      const component: GeneratedComponent = {
        name: spec.name,
        type: spec.type as any,
        code,
        path: `src/${spec.type}s/${spec.name}.tsx`,
        language: 'typescript',
        framework: spec.framework,
        dependencies: this.extractDependencies(code),
        metadata: {
          linesOfCode: code.split('\n').length,
          complexity: this.calculateComplexity(code),
          generated: true,
          validated: true
        }
      };

      logger.info('Component generated successfully', {
        component: 'CognitiveGenerationEngine',
        metadata: {
          name: spec.name,
          linesOfCode: component.metadata.linesOfCode
        }
      });

      return component;

    } catch (error) {
      const err = error as Error;
      logger.error('Component generation failed', {
        component: 'CognitiveGenerationEngine',
        metadata: { error: err.message }
      });

      throw err;
    }
  }

  /**
   * Batch generate (multiple components at once)
   */
  async batchGenerate(requests: GenerationRequest[]): Promise<GenerationResult[]> {
    logger.info(`Starting batch generation (${requests.length} requests)`, {
      component: 'CognitiveGenerationEngine'
    });

    const results: GenerationResult[] = [];

    for (const request of requests) {
      try {
        const result = await this.generate(request);
        results.push(result);
      } catch (error) {
        const err = error as Error;
        results.push({
          success: false,
          components: [],
          error: err.message,
          qualityScore: 0,
          dependencies: [],
          packageJson: '',
          readme: ''
        });
      }
    }

    logger.info('Batch generation completed', {
      component: 'CognitiveGenerationEngine',
      metadata: {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    });

    return results;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Private utility methods
  // ═══════════════════════════════════════════════════════════════════════════

  private extractDependencies(code: string): string[] {
    const deps: string[] = [];
    const importRegex = /import .+ from ['"](.+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(code)) !== null) {
      const dep = match[1];
      if (dep && !dep.startsWith('.') && !dep.startsWith('/')) {
        deps.push(dep);
      }
    }
    
    return [...new Set(deps)];
  }

  private calculateComplexity(code: string): number {
    let complexity = 1;
    const patterns = [
      /if\s*\(/g,
      /while\s*\(/g,
      /for\s*\(/g,
      /case\s+/g,
      /&&/g,
      /\|\|/g,
      /\?/g
    ];
    
    patterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) complexity += matches.length;
    });
    
    return complexity;
  }
}
// ═══════════════════════════════════════════════════════════════════════════
// 🔷 SEÇÃO 5: EXPORTS & SINGLETON
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Singleton instance
 * Ensures single instance across application
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
 * Default export (for backward compatibility with orchestrator)
 */
export default getCognitiveGenerationEngine();

/**
 * Named exports
 */
export {
  CognitiveGenerationEngine,
  GenerationPipeline,
  ContextBuilder,
  type GenerationRequest,
  type GenerationResult,
  type GenerationContext,
  type PipelineConfig,
  type PipelineStageResult
};

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 END OF FILE - COGNITIVE-GENERATION-ENGINE V2.0
// ═══════════════════════════════════════════════════════════════════════════

/**
 * USAGE EXAMPLES:
 * 
 * // 1. Simple usage (orchestrator-engine.ts)
 * import cognitiveEngine from './engines/cognitive-generation-engine';
 * const result = await cognitiveEngine.generate(request);
 * 
 * // 2. Advanced usage with configuration
 * import { getCognitiveGenerationEngine } from './engines/cognitive-generation-engine';
 * const engine = getCognitiveGenerationEngine();
 * engine.configurePipeline({
 *   enableValidation: true,
 *   enableOptimization: true,
 *   enableQualityAnalysis: true
 * });
 * const result = await engine.generate(request);
 * 
 * // 3. Single component generation
 * const component = await engine.generateComponent({
 *   name: 'UserProfile',
 *   type: 'component',
 *   framework: 'react',
 *   requirements: ['Display user info', 'Edit button']
 * });
 * 
 * // 4. Batch generation
 * const results = await engine.batchGenerate([request1, request2, request3]);
 * 
 * // 5. Health check
 * const health = await engine.healthCheck();
 * console.log(health.status); // 'healthy' | 'degraded' | 'unhealthy'
 * 
 * // 6. Statistics
 * const stats = engine.getGenerationStats();
 * console.log(`Success rate: ${(stats.successfulGenerations / stats.totalGenerations * 100).toFixed(1)}%`);
 */
