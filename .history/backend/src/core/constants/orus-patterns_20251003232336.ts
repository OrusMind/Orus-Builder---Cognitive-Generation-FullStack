 
/*
 * ═══════════════════════════════════════════════════════════════
 * 🧬 COGNITIVE AGENT CODE DNA - ORUS PATTERN CONSTANTS
 * ═══════════════════════════════════════════════════════════════
 * 
 * 👨‍💻 DEVELOPERS: Minerva Omega TypeScript Supreme + Tulio (ORUS Creator)
 * ⏰ CREATED: 2025-10-03T23:24:00-03:00
 * 🔄 LAST_MODIFIED: 2025-10-03T23:24:00-03:00
 * 🏷️ COMPONENT_HASH: orus.builder.constants.patterns.20251003.v1.0
 * 
 * TAGS: [ORUS BUILDER CREATION] [CONSTANTS] [ORUS-PATTERNS] [ALPHALANG]
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * AlphaLang Header Patterns - Padrões de reconhecimento AlphaLang
 */
export const ALPHALANG_PATTERNS = {
  HEADER_START: /BEGINORUS[A-Z]+HIERARCHYCRYPTOV\d+/,
  HEADER_END: /ENDORUS[A-Z]+HIERARCHY/,
  MASTER_TEMPLATE: /MASTERTEMPLATE:\s*([^\n]+)/,
  SPECIALIZATION: /SPECIALIZATION:\s*([^\n]+)/,
  AUTHORITY_LEVEL: /AUTHORITYLEVEL:\s*([^\n]+)/,
  OMEGA_HIERARCHY: /OMEGAHIERARCHY:\s*([^\n]+)/,
  COGNITIVE_LEVEL: /COGNITIVELEVEL:\s*([^\n]+)/,
  AUTONOMY_DEGREE: /AUTONOMYDEGREE:\s*(\d+)/,
  HASH_MASTER: /Hash Master Universal:\s*`([^`]+)`/,
  FRAGMENT_ID: /Fragment ID:\s*([^\n]+)/,
  ACTIVATION_COMMAND: /Comando de Ativação:\s*([^\n]+)/
} as const;

/**
 * ORUS Fragment Types
 */
export const ORUS_FRAGMENT_TYPES = {
  OMEGA: 'omega',
  SKILL: 'skill',
  ENGINE: 'engine',
  BLUEPRINT: 'blueprint',
  PROTOCOL: 'protocol',
  STANDARD: 'standard'
} as const;

/**
 * ORUS Component Tags
 */
export const ORUS_TAGS = {
  ORUS_BUILDER_CREATION: '[ORUS BUILDER CREATION]',
  CIG_PROTOCOL: '[CIG-2.0]',
  FOUNDATION: '[FOUNDATION]',
  TYPE_SYSTEM: '[TYPE-SYSTEM]',
  ENGINE_ARCHITECTURE: '[ENGINE-ARCHITECTURE]',
  TRINITY_INTEGRATION: '[TRINITY-INTEGRATION]',
  BLUEPRINT_RECOGNITION: '[BLUEPRINT-RECOGNITION]',
  COGNITIVE_DNA: '[COGNITIVE-DNA]',
  ZERO_ERRORS: '[ZERO-ERRORS]',
  MULTILINGUAL: '[MULTILINGUAL]',
  ALPHALANG: '[ALPHALANG]',
  AUTO_GENERATION: '[AUTO-GENERATION]',
  PATTERN_RECOGNITION: '[PATTERN-RECOGNITION]',
  LEARNING_SYSTEM: '[LEARNING-SYSTEM]',
  SELF_IMPROVING: '[SELF-IMPROVING]'
} as const;

/**
 * Cognitive DNA Sections
 */
export const DNA_SECTIONS = {
  HEADER: 'COGNITIVE AGENT CODE DNA',
  DEVELOPERS: 'DEVELOPERS',
  CREATED: 'CREATED',
  MODIFIED: 'LAST_MODIFIED',
  HASH: 'COMPONENT_HASH',
  PURPOSE: 'COMPONENT PURPOSE & FUNCTIONALITY',
  AGENT_DNA: 'AGENT/COMPONENT DNA',
  OMEGA_METADATA: 'OMEGA METADATA',
  QUALITY_GATES: 'QUALITY_GATES',
  TAGS: 'TAGS'
} as const;

/**
 * Blueprint Section Markers
 */
export const BLUEPRINT_MARKERS = {
  BLOCK_START: /# BLOCO \d+:/,
  BLOCK_TITLE: /\*\*Nome do Projeto:\*\*\s*"([^"]+)"/,
  MODULE_START: /# MÓDULO \d+:/,
  COMPONENT_START: /## Componente \d+:/,
  ARCHITECTURE: /# ARQUITETURA/,
  TECHNOLOGY_STACK: /# STACK TECNOLÓGICO/,
  FILE_STRUCTURE: /# ESTRUTURA DE ARQUIVOS/
} as const;

/**
 * Recognition Confidence Thresholds
 */
export const RECOGNITION_THRESHOLDS = {
  ALPHALANG_HEADER: 0.9,
  ORUS_FRAGMENT: 0.85,
  COGNITIVE_DNA: 0.8,
  BLUEPRINT: 0.75,
  PATTERN: 0.7
} as const;

/**
 * Validation Patterns
 */
export const VALIDATION_PATTERNS = {
  // TypeScript patterns
  INTERFACE_DECLARATION: /interface\s+([A-Z][a-zA-Z0-9]*)/g,
  TYPE_ALIAS: /type\s+([A-Z][a-zA-Z0-9]*)/g,
  CLASS_DECLARATION: /class\s+([A-Z][a-zA-Z0-9]*)/g,
  ENUM_DECLARATION: /enum\s+([A-Z][a-zA-Z0-9]*)/g,
  
  // Import patterns
  IMPORT_STATEMENT: /import\s+.*\s+from\s+['"]([^'"]+)['"]/g,
  IMPORT_TYPE: /import\s+type\s+.*\s+from\s+['"]([^'"]+)['"]/g,
  
  // Export patterns
  EXPORT_STATEMENT: /export\s+(?:interface|type|class|enum|const|function)\s+([a-zA-Z0-9_]+)/g,
  
  // Comment patterns
  DNA_COMMENT: /\/\*[\s\S]*?COGNITIVE AGENT CODE DNA[\s\S]*?\*\//,
  BLOCK_COMMENT: /\/\*[\s\S]*?\*\//g,
  LINE_COMMENT: /\/\/.*$/gm
} as const;

/*
 * ═══════════════════════════════════════════════════════════════
 * END OF ORUS PATTERN CONSTANTS
 * ═══════════════════════════════════════════════════════════════
 */
