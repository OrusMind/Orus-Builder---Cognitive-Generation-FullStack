/**
 * ═══════════════════════════════════════════════════════════════
 * ORUS BUILDER - UI ENHANCEMENT ENGINE v1.0
 * ═══════════════════════════════════════════════════════════════
 */

import { logger } from '../utils/logger';
import { metricsAggregator } from '../monitoring/metrics-aggregator';

// ═══════════════════════════════════════════════════════════════
// TYPES - Usando tipos compatíveis com cognitive-generation-engine
// ═══════════════════════════════════════════════════════════════

export interface UIEnhancementOptions {
  addTailwind: boolean;
  addAnimations: boolean;
  addResponsive: boolean;
  style: 'modern' | 'classic' | 'minimal' | 'vibrant' | 'corporate';
  colorScheme?: 'light' | 'dark' | 'auto';
  addAccessibility?: boolean;
  enhancementLevel?: 'basic' | 'standard' | 'advanced' | 'premium';
}

export interface UIEnhancementResult<T = any> {
  enhancedFiles: T[];
  configFiles: T[];
  statistics: {
    totalFiles: number;
    enhancedFiles: number;
    addedClasses: number;
    processingTime: number;
  };
}

// ═══════════════════════════════════════════════════════════════
// STYLE PRESETS
// ═══════════════════════════════════════════════════════════════

const STYLE_PRESETS = {
  modern: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    card: 'bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow',
    button: 'px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all',
    heading: 'text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white',
    text: 'text-gray-700 dark:text-gray-300',
  },
  classic: {
    container: 'max-w-6xl mx-auto px-6',
    card: 'bg-white border border-gray-200 rounded-lg p-6',
    button: 'px-5 py-2.5 bg-blue-600 text-white font-medium rounded hover:bg-blue-700',
    heading: 'text-3xl font-bold text-gray-900',
    text: 'text-gray-600',
  },
  minimal: {
    container: 'max-w-5xl mx-auto px-4',
    card: 'bg-white border border-gray-100 rounded-lg p-8',
    button: 'px-6 py-2 border-2 border-black text-black font-medium hover:bg-black hover:text-white',
    heading: 'text-4xl font-light text-black',
    text: 'text-gray-500',
  },
  vibrant: {
    container: 'max-w-7xl mx-auto px-4',
    card: 'bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8',
    button: 'px-8 py-4 bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-bold rounded-full',
    heading: 'text-4xl font-black bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent',
    text: 'text-gray-600',
  },
  corporate: {
    container: 'max-w-6xl mx-auto px-6',
    card: 'bg-white rounded-lg shadow-md border border-gray-200 p-6',
    button: 'px-6 py-3 bg-blue-900 text-white font-semibold rounded',
    heading: 'text-3xl font-semibold text-gray-900',
    text: 'text-gray-700',
  },
};

// ═══════════════════════════════════════════════════════════════
// UI ENHANCEMENT ENGINE CLASS
// ═══════════════════════════════════════════════════════════════

export class UIEnhancementEngine {
  private addedClasses: number = 0;

  constructor() {
    logger.info('🎨 [UI Enhancement Engine] Initialized');
  }

  /**
   * Enhance files with UI styling
   * Generic type T allows compatibility with any GeneratedFile structure
   */
  public async enhance<T extends { path: string; fileName: string; content: string; language: string; type: string; lines: number; complexity: number }>(
    files: T[],
    options: UIEnhancementOptions
  ): Promise<UIEnhancementResult<T>> {
    const startTime = Date.now();

    try {
      logger.info('🎨 [UI Enhancement] Starting', {
        filesCount: files.length,
        style: options.style,
      });

      this.addedClasses = 0;

      // Enhance component files
      const enhancedFiles: T[] = files.map(file => {
        if (this.isComponentFile(file)) {
          return this.enhanceComponent(file, options);
        }
        return file;
      });

      // Generate config files
      const configFiles = this.generateConfigFiles<T>(options);

      const processingTime = Date.now() - startTime;

      metricsAggregator.recordHistogram('ui.enhancement.time', processingTime);

      logger.info('✅ [UI Enhancement] Completed', {
        totalFiles: files.length,
        enhancedFiles: enhancedFiles.length,
        processingTime: `${processingTime}ms`,
      });

      return {
        enhancedFiles,
        configFiles,
        statistics: {
          totalFiles: files.length,
          enhancedFiles: enhancedFiles.length,
          addedClasses: this.addedClasses,
          processingTime,
        },
      };
    } catch (error: any) {
      logger.error('❌ [UI Enhancement] Failed', {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Enhance individual component
   */
  private enhanceComponent<T extends { content: string; lines?: number }>(
    file: T,
    options: UIEnhancementOptions
  ): T {
    let content = file.content;

    // Add imports
    if (options.addAnimations && !content.includes('framer-motion')) {
      content = `import { motion } from 'framer-motion';\n${content}`;
    }

    // Add Tailwind
    if (options.addTailwind) {
      content = this.enhanceWithTailwind(content, options.style);
    }

    // Add animations
    if (options.addAnimations) {
      content = this.addAnimations(content);
    }

    // Add responsive
    if (options.addResponsive) {
      content = this.addResponsiveClasses(content);
    }

    return {
      ...file,
      content,
      lines: content.split('\n').length,
    };
  }

  /**
   * Enhance with Tailwind CSS
   */
  private enhanceWithTailwind(content: string, style: string): string {
    const preset = STYLE_PRESETS[style as keyof typeof STYLE_PRESETS] || STYLE_PRESETS.modern;

    // Enhance divs
    content = content.replace(/<div>/g, `<div className="${preset.container}">`);

    // Enhance headings
    content = content.replace(/<h1>/g, `<h1 className="${preset.heading}">`);
    content = content.replace(/<h2>/g, `<h2 className="text-2xl font-bold mb-4">`);

    // Enhance paragraphs
    content = content.replace(/<p>/g, `<p className="${preset.text} leading-relaxed mb-4">`);

    // Enhance buttons
    content = content.replace(/<button([^>]*?)>/g, `<button$1 className="${preset.button}">`);

    // Enhance inputs
    content = content.replace(/<input([^>]*?)>/g, `<input$1 className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500">`);

    // Enhance forms
    content = content.replace(/<form([^>]*?)>/g, `<form$1 className="space-y-6">`);

    // Enhance lists
    content = content.replace(/<ul>/g, '<ul className="space-y-3">');

    this.addedClasses += 50;
    return content;
  }

  /**
   * Add animations
   */
  private addAnimations(content: string): string {
    content = content.replace(
      /<div className="([^"]*container[^"]*)"/g,
      `<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="$1"`
    );
    return content;
  }

  /**
   * Add responsive classes
   */
  private addResponsiveClasses(content: string): string {
    content = content.replace(/className="flex"/g, 'className="flex flex-col md:flex-row"');
    content = content.replace(/className="grid"/g, 'className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"');
    return content;
  }

  /**
   * Generate config files
   */
  private generateConfigFiles<T extends { path: string; fileName: string; content: string; language: string; type: string; lines: number; complexity: number }>(
    options: UIEnhancementOptions
  ): T[] {
    if (!options.addTailwind) return [];

    return [
      {
        path: 'tailwind.config.js',
        fileName: 'tailwind.config.js',
        content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media',
  theme: { extend: {} },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};`,
        language: 'javascript',
        type: 'config',
        lines: 9,
        complexity: 1,
      } as T,
      {
        path: 'postcss.config.js',
        fileName: 'postcss.config.js',
        content: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,
        language: 'javascript',
        type: 'config',
        lines: 6,
        complexity: 1,
      } as T,
    ];
  }

  /**
   * Check if file is a component
   */
  private isComponentFile(file: { path?: string; fileName: string }): boolean {
    return (
      (file.fileName?.endsWith('.tsx') || file.fileName?.endsWith('.jsx')) &&
      (file.path?.includes('components/') || file.path?.includes('App.'))
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════

export const uiEnhancementEngine = new UIEnhancementEngine();
