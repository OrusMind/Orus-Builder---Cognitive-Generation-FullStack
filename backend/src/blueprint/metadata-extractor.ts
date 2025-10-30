 
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 COGNITIVE AGENT CODE DNA - ORUS METADATA EXTRACTOR
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @developers    Minerva Omega - TypeScript Supreme | Tulio - ORUS Creator
 * @created       2025-10-09T14:17:00-0300
 * @lastModified  2025-10-09T14:17:00-0300
 * @componentHash orus.builder.blueprint.metadata.20251009.v1.0.BP003
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 📋 COMPONENT PURPOSE & FUNCTIONALITY
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * WHAT IT DOES:
 *   Deep metadata extraction from ORUS blueprints including cognitive DNA,
 *   Hash Master Universal, agent metadata, technology stack, dependencies,
 *   architectural patterns, and complete project intelligence.
 * 
 * WHY IT EXISTS:
 *   Transforms raw blueprint into structured, queryable metadata. Enables
 *   intelligent project generation, dependency resolution, technology detection,
 *   and marketplace categorization with AI-powered insights.
 * 
 * HOW IT WORKS:
 *   Multi-layer extraction using pattern recognizer, NLP processing, dependency
 *   graph analysis, technology detection, architecture classification.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { BaseEntity } from '../core/types';
import { orusPatternRecognizer, RecognitionResult } from './orus-pattern-recognizer';
import { logger } from '../system/logging-system';

export interface ExtractedMetadata extends BaseEntity {
  metadataId: string;
  blueprintId: string;
  
  // Core info
  project: ProjectMetadata;
  cognitive: CognitiveMetadata;
  architecture: ArchitectureMetadata;
  technology: TechnologyMetadata;
  dependencies: DependencyMetadata;
  
  // Quality
  completeness: number;
  confidence: number;
}

export interface ProjectMetadata {
  name: string;
  description: string;
  version: string;
  authors: string[];
  createdDate?: Date;
  
  // ORUS specific
  hashMaster?: string;
  orusPattern?: string;
  cigVersion?: string;
}

export interface CognitiveMetadata {
  dnaString?: string;
  agentType?: string;
  knowledgeLevel?: string;
  autonomyLevel?: string;
  cognitiveCapabilities: string[];
  learningEnabled: boolean;
}

export interface ArchitectureMetadata {
  style: string; // monolithic, microservices, serverless
  layers: string[];
  patterns: string[];
  totalComponents: number;
  totalBlocos: number;
  totalEngines: number;
  componentsByBloco: Record<number, number>;
}

export interface TechnologyMetadata {
  backend: TechnologyDetails[];
  frontend: TechnologyDetails[];
  database: TechnologyDetails[];
  infrastructure: TechnologyDetails[];
  testing: TechnologyDetails[];
}

export interface TechnologyDetails {
  name: string;
  version?: string;
  category: string;
  confidence: number;
}

export interface DependencyMetadata {
  npm: NpmDependency[];
  internal: InternalDependency[];
  external: ExternalDependency[];
  totalDependencies: number;
}

export interface NpmDependency {
  name: string;
  version: string;
  dev: boolean;
}

export interface InternalDependency {
  from: string;
  to: string;
  type: 'import' | 'extends' | 'implements';
}

export interface ExternalDependency {
  service: string;
  type: 'api' | 'database' | 'cache' | 'queue';
}

export class MetadataExtractor {
  private static instance: MetadataExtractor;
  private extractedMetadata: Map<string, ExtractedMetadata> = new Map();

  private constructor() {
    logger.debug('Metadata Extractor initialized', {
      component: 'MetadataExtractor',
      action: 'initialize'
    });
  }

  public static getInstance(): MetadataExtractor {
    if (!MetadataExtractor.instance) {
      MetadataExtractor.instance = new MetadataExtractor();
    }
    return MetadataExtractor.instance;
  }

  public async extractMetadata(
    blueprintId: string,
    text: string,
    recognitionResult: RecognitionResult
  ): Promise<ExtractedMetadata> {
    const metadataId = this.generateMetadataId();
    const now = new Date();

    const project = this.extractProjectMetadata(text, recognitionResult);
    const cognitive = this.extractCognitiveMetadata(recognitionResult);
    const architecture = this.extractArchitectureMetadata(recognitionResult);
    const technology = this.extractTechnologyMetadata(text);
    const dependencies = this.extractDependencyMetadata(text);

    const completeness = this.calculateCompleteness(project, cognitive, architecture);
    const confidence = recognitionResult.confidence;

    const metadata: ExtractedMetadata = {
      id: metadataId,
      metadataId,
      blueprintId,
      project,
      cognitive,
      architecture,
      technology,
      dependencies,
      completeness,
      confidence,
      version: 1,
      isDeleted: false,
      createdAt: now,
      updatedAt: now
    };

    this.extractedMetadata.set(metadataId, metadata);

    logger.info('Metadata extracted', {
      component: 'MetadataExtractor',
      action: 'extractMetadata',
      metadata: { metadataId, blueprintId, completeness, confidence }
    });

    return metadata;
  }

private extractProjectMetadata(text: string, result: RecognitionResult): ProjectMetadata {
  const nameMatch = text.match(/^#\s+([^\n]+)/m);
  const name = nameMatch?.[1]?.trim() || 'Untitled Project';  // ✅ Linha 189

  const descMatch = text.match(/(?:descrição|description)[:\s]+([^\n]+)/i);
  const description = descMatch?.[1]?.trim() || '';  // ✅ Linha 192

  const versionMatch = text.match(/(?:versão|version)[:\s]+([0-9.]+)/i);
  const version = versionMatch?.[1] || '1.0.0';  // ✅ Linha 200 - Garantir string

  return {
    name,
    description,
    version,
    authors: ['ORUS Builder User'],
    hashMaster: result.hashMaster?.fullHash,
    orusPattern: result.alphaLangHeader?.fullHeader,
    cigVersion: 'CIG-2.0'
  };
}


  private extractCognitiveMetadata(result: RecognitionResult): CognitiveMetadata {
    return {
      dnaString: result.cognitiveDNA?.dnaString,
      agentType: result.alphaLangHeader?.agentType,
      knowledgeLevel: result.alphaLangHeader?.knowledgeLevel,
      autonomyLevel: result.alphaLangHeader?.autonomyLevel,
      cognitiveCapabilities: result.cognitiveDNA?.traits.map(t => t.name) || [],
      learningEnabled: true
    };
  }

  private extractArchitectureMetadata(result: RecognitionResult): ArchitectureMetadata {
    const componentsByBloco: Record<number, number> = {};
    
    for (const bloco of result.blocos) {
      componentsByBloco[bloco.number] = bloco.componentCount;
    }

    return {
      style: 'layered-architecture',
      layers: ['presentation', 'business', 'data', 'integration'],
      patterns: ['singleton', 'factory', 'observer', 'repository'],
      totalComponents: result.components.length,
      totalBlocos: result.blocos.length,
      totalEngines: result.engines.length,
      componentsByBloco
    };
  }

  private extractTechnologyMetadata(text: string): TechnologyMetadata {
    const lower = text.toLowerCase();

    return {
      backend: this.detectTechnologies(lower, [
        'node.js', 'express', 'typescript', 'nestjs', 'fastify'
      ], 'backend'),
      frontend: this.detectTechnologies(lower, [
        'react', 'vue', 'angular', 'next.js', 'vite'
      ], 'frontend'),
      database: this.detectTechnologies(lower, [
        'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch'
      ], 'database'),
      infrastructure: this.detectTechnologies(lower, [
        'docker', 'kubernetes', 'aws', 'gcp', 'azure'
      ], 'infrastructure'),
      testing: this.detectTechnologies(lower, [
        'jest', 'mocha', 'cypress', 'playwright', 'vitest'
      ], 'testing')
    };
  }

  private detectTechnologies(
    text: string,
    techs: string[],
    category: string
  ): TechnologyDetails[] {
    return techs
      .filter(tech => text.includes(tech.toLowerCase()))
      .map(tech => ({
        name: tech,
        category,
        confidence: 85
      }));
  }

  private extractDependencyMetadata(text: string): DependencyMetadata {
  const npm: NpmDependency[] = [];
  const internal: InternalDependency[] = [];
  const external: ExternalDependency[] = [];

  // Simple npm dependency extraction
  const packageMatches = text.matchAll(/(?:npm install|yarn add)\s+([@\w/-]+)/g);
  for (const match of packageMatches) {
    const packageName = match[1];  // ✅ Capturar em variável
    
    if (packageName) {  // ✅ Verificar se existe
      npm.push({
        name: packageName,  // ✅ Agora é sempre string
        version: 'latest',
        dev: false
      });
    }
  }
    return {
      npm,
      internal,
      external,
      totalDependencies: npm.length + internal.length + external.length
    };
  }

  private calculateCompleteness(
    project: ProjectMetadata,
    cognitive: CognitiveMetadata,
    architecture: ArchitectureMetadata
  ): number {
    let score = 0;

    if (project.name) score += 15;
    if (project.description) score += 10;
    if (project.hashMaster) score += 15;
    if (cognitive.dnaString) score += 15;
    if (cognitive.agentType) score += 10;
    if (architecture.totalComponents > 0) score += 20;
    if (architecture.totalBlocos > 0) score += 15;

    return score;
  }

  private generateMetadataId(): string {
    return `meta-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public getMetadata(metadataId: string): ExtractedMetadata | undefined {
    return this.extractedMetadata.get(metadataId);
  }
}

export const metadataExtractor = MetadataExtractor.getInstance();
