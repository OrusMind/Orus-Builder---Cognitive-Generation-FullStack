/**
 * ═══════════════════════════════════════════════════════════════
 * SHARED ENGINE TYPES - TYPES COMPARTILHADOS
 * ═══════════════════════════════════════════════════════════════
 */

export interface GeneratedFile {
  path: string;
  fileName: string;
  content: string;
  language: string;
  type: 'component' | 'service' | 'util' | 'test' | 'config';
  lines: number;
  complexity: number;
}

export interface UIEnhancementOptions {
  addTailwind: boolean;
  addAnimations: boolean;
  addResponsive: boolean;
  style: 'modern' | 'classic' | 'minimal' | 'vibrant' | 'corporate';
  colorScheme: 'light' | 'dark' | 'auto';
  addAccessibility: boolean;
  enhancementLevel: 'basic' | 'standard' | 'advanced' | 'premium';
  customTheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export interface UIEnhancementResult {
  enhancedFiles: GeneratedFile[];
  configFiles: GeneratedFile[];
  statistics: {
    totalFiles: number;
    enhancedFiles: number;
    addedClasses: number;
    addedAnimations: number;
    processingTime: number;
  };
}
