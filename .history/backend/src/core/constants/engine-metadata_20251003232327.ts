 
/*
 * ═══════════════════════════════════════════════════════════════
 * 🧬 COGNITIVE AGENT CODE DNA - ENGINE METADATA CONSTANTS
 * ═══════════════════════════════════════════════════════════════
 * 
 * 👨‍💻 DEVELOPERS: Minerva Omega TypeScript Supreme + Tulio (ORUS Creator)
 * ⏰ CREATED: 2025-10-03T23:24:00-03:00
 * 🔄 LAST_MODIFIED: 2025-10-03T23:24:00-03:00
 * 🏷️ COMPONENT_HASH: orus.builder.constants.metadata.20251003.v1.0
 * 
 * TAGS: [ORUS BUILDER CREATION] [CONSTANTS] [ENGINE-METADATA]
 * ═══════════════════════════════════════════════════════════════
 */

import type { I18nText } from '../types/index';

/**
 * Engine Metadata Registry - Registro de metadados dos engines
 */
export const ENGINE_METADATA = {
  CIG_PROTOCOL: {
    id: 'cig-protocol-v2.0',
    name: {
      en: 'CIG Protocol 2.0',
      pt_BR: 'Protocolo CIG 2.0',
      es: 'Protocolo CIG 2.0'
    } as I18nText,
    version: '2.0.0',
    type: 'core',
    capabilities: [
      'zero_errors_guarantee',
      'type_safety_enforcement',
      'progressive_validation',
      'learning_optimization'
    ]
  },
  
  DEPENDENCY_GRAPH: {
    id: 'dgi-v2.0',
    name: {
      en: 'Dependency Graph Intelligence',
      pt_BR: 'Inteligência de Grafo de Dependências',
      es: 'Inteligencia de Grafo de Dependencias'
    } as I18nText,
    version: '2.0.0',
    type: 'analysis',
    capabilities: [
      'circular_detection',
      'critical_path_analysis',
      'generation_optimization'
    ]
  },
  
  TYPE_INFERENCE: {
    id: 'pti-v2.0',
    name: {
      en: 'Progressive Type Inference',
      pt_BR: 'Inferência Progressiva de Tipos',
      es: 'Inferencia Progresiva de Tipos'
    } as I18nText,
    version: '2.0.0',
    type: 'inference',
    capabilities: [
      'context_analysis',
      'type_suggestion',
      'confidence_scoring'
    ]
  },
  
  CONTRACT_EVOLUTION: {
    id: 'cet-v2.0',
    name: {
      en: 'Contract Evolution Tracking',
      pt_BR: 'Rastreamento de Evolução de Contratos',
      es: 'Seguimiento de Evolución de Contratos'
    } as I18nText,
    version: '2.0.0',
    type: 'versioning',
    capabilities: [
      'breaking_change_detection',
      'migration_generation',
      'consumer_notification'
    ]
  },
  
  TYPE_COVERAGE: {
    id: 'tcm-v2.0',
    name: {
      en: 'Type Coverage Metrics',
      pt_BR: 'Métricas de Cobertura de Tipos',
      es: 'Métricas de Cobertura de Tipos'
    } as I18nText,
    version: '2.0.0',
    type: 'metrics',
    capabilities: [
      'coverage_analysis',
      'implicit_any_detection',
      'safety_scoring'
    ]
  },
  
  PROJECT_CONTEXT: {
    id: 'pca-v2.0',
    name: {
      en: 'Project Context Awareness',
      pt_BR: 'Consciência de Contexto do Projeto',
      es: 'Conciencia de Contexto del Proyecto'
    } as I18nText,
    version: '2.0.0',
    type: 'context',
    capabilities: [
      'architecture_analysis',
      'pattern_detection',
      'convention_extraction'
    ]
  },
  
  LEARNING_LOOP: {
    id: 'cll-v2.0',
    name: {
      en: 'Cognitive Learning Loop',
      pt_BR: 'Loop de Aprendizado Cognitivo',
      es: 'Bucle de Aprendizaje Cognitivo'
    } as I18nText,
    version: '2.0.0',
    type: 'learning',
    capabilities: [
      'feedback_processing',
      'pattern_learning',
      'rule_adjustment',
      'continuous_improvement'
    ]
  }
} as const;

/**
 * Engine Priority Levels
 */
export const ENGINE_PRIORITIES = {
  CRITICAL: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
  BACKGROUND: 5
} as const;

/**
 * Engine Status Constants
 */
export const ENGINE_STATUS = {
  INITIALIZING: 'initializing',
  READY: 'ready',
  RUNNING: 'running',
  PAUSED: 'paused',
  ERROR: 'error',
  STOPPED: 'stopped',
  MAINTENANCE: 'maintenance'
} as const;

/*
 * ═══════════════════════════════════════════════════════════════
 * END OF ENGINE METADATA CONSTANTS
 * ═══════════════════════════════════════════════════════════════
 */
