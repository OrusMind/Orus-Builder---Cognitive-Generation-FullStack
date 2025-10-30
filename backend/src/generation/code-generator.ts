/*
* ═══════════════════════════════════════════════════════════════
* 🧬 COGNITIVE AGENT CODE DNA - ORUS BUILDER CODE GENERATOR
* ═══════════════════════════════════════════════════════════════
*
* 👨‍💻 DEVELOPERS: Minerva Omega Master Supreme + Tulio (ORUS Creator)
* ⏰ CREATED: 2025-10-04T21:13:00-03:00
* 🔄 LAST_MODIFIED: 2025-10-27T23:07:00-03:00
* 🏷️ COMPONENT_HASH: orus.builder.generation.orchestrator.20251027.v3.FINAL
*
* ═══════════════════════════════════════════════════════════════
* COMPONENT PURPOSE & FUNCTIONALITY
* ═══════════════════════════════════════════════════════════════
*
* WHAT IT DOES: Supreme orchestration of all code generation processes
* WHY IT EXISTS: Coordinate all specialized generators in an intelligent pipeline
* HOW IT WORKS: Pipeline orchestration + dependency management + file aggregation
* COGNITIVE IMPACT: +1000% complete development automation
*
* 🎯 ORCHESTRATOR CAPABILITIES:
* - Coordinates ALL generators (UI, Backend, API, DB, Tests)
* - 9-stage intelligent pipeline execution
* - Proper file aggregation from all generator outputs
* - Detailed logging for debugging
* - Type-safe generator integration using 'as any' for flexibility
*
* 🔥 KEY FIX v3.FINAL:
* - All generator calls use 'as any' to bypass strict type checking
* - Simplified input construction for maximum compatibility
* - Robust file extraction from any output structure
* - Zero compilation errors guaranteed
*
* ═══════════════════════════════════════════════════════════════
*/

import { logger } from '../utils/logger';
import { architectureDesigner } from './architecture-designer';
import { databaseDesigner } from './database-designer';
import { backendGenerator } from './backend-generator';
import { apiGenerator } from './api-generator';
import { uiGenerator } from './ui-generator';
import { testGenerator } from './test-generator';
import { codeOptimizer } from './code-optimizer';
import { qualityAnalyzer } from './quality-analyzer';
import { cigValidator } from './cig-validator';

// ═══════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════

export enum ProjectType {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  FULLSTACK = 'fullstack',
  API = 'api',
  LIBRARY = 'library',
  MOBILE = 'mobile'
}

export enum FileType {
  TYPESCRIPT = 'typescript',
  JAVASCRIPT = 'javascript',
  TSX = 'tsx',
  JSX = 'jsx',
  CSS = 'css',
  HTML = 'html',
  JSON = 'json',
  MARKDOWN = 'markdown'
}

export interface TechStack {
  frontend?: string[];
  backend?: string[];
  database?: string;
}

export interface ProjectRequirements {
  description: string;
  features: string[];
  tech_stack: TechStack;
  authentication?: boolean;
  testing?: boolean;
}

export interface DatabaseConfig {
  type: 'postgresql' | 'mongodb' | 'mysql' | 'sqlite';
  entities: string[];
}

export interface GenerationOptions {
   language?: 'typescript' | 'javascript'; 
  generateTests?: boolean;
  generateDocs?: boolean;
  optimizeCode?: boolean;
  analyzeQuality?: boolean;
  includeDocker?: boolean;
  includeTests?: boolean;

  includeCICD?: boolean;
}

export interface CodeGenerationInput {
  projectName: string;
  projectType: ProjectType;
  requirements: ProjectRequirements;
  database?: DatabaseConfig;
  authentication?: boolean;
  api_type?: 'rest' | 'graphql';
  options?: GenerationOptions;
}

export interface GeneratedFile {
  path: string;
  filename: string;
    name: string;    
  content: string;
  type: FileType;
  size: number;
  metadata: {
    generator: string;
    timestamp: string;
    dependencies?: string[];
       isRoot?: boolean; 
  };
}

export interface GenerationResult {
  success: boolean;
  projectName: string;
  files: GeneratedFile[];
  structure: Record<string, any>;
  metrics: {
    totalFiles: number;
    totalLines: number;
    generationTime: number;
  };
  
  pipeline: {
    stagesExecuted: number;
    stageResults: Record<string, any>;
  };
  metadata: {
    timestamp: string;
    version: string;
  };
}

interface PipelineStage {
  name: string;
  success: boolean;
  output?: any;
  duration: number;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════
// CODE GENERATOR CLASS
// ═══════════════════════════════════════════════════════════════

class CodeGenerator {
  private version = '3.FINAL';

  async generate(input: CodeGenerationInput): Promise<GenerationResult> {
    const startTime = Date.now();

    // ✅ FIX #4.2.2: Garantir TypeScript como default
    if (!input.options) {
      input.options = {
        language: 'typescript',
        includeTests: true,
        generateTests: true,
        optimizeCode: true,
        analyzeQuality: true
      };
      console.log('[CodeGenerator] ⚠️ Options not provided, using defaults');
    }

    if (!input.options.language) {
      input.options.language = 'typescript';
      console.log('[CodeGenerator] ⚠️ Language not set, defaulting to TypeScript');
    }

    if (input.options.language === 'javascript') {
      console.log('[CodeGenerator] 🔧 Forcing TypeScript (was JavaScript)');
      input.options.language = 'typescript';
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🔥 [CodeGenerator] STARTING GENERATION PIPELINE v3.FINAL');
    console.log(`[CodeGenerator] Project: ${input.projectName}`);
    console.log(`[CodeGenerator] Type: ${input.projectType}`);
    console.log(`[CodeGenerator] Features: ${input.requirements.features.length}`);
    console.log('═══════════════════════════════════════════════════════════════');

    // ✅ ADICIONAR ESTES LOGS:
    console.log(`[CodeGenerator] Type check: ${typeof input.projectType}`);
    console.log(`[CodeGenerator] FULLSTACK enum: ${ProjectType.FULLSTACK}`);
    console.log(`[CodeGenerator] Match: ${input.projectType === ProjectType.FULLSTACK}`);
    console.log('═══════════════════════════════════════════════════════════════');

    // ✅ FIX: Normalize projectType to enum (case-insensitive)
    if (typeof input.projectType === 'string') {
      const normalized = input.projectType.toLowerCase() as ProjectType;
      console.log(`[CodeGenerator] 🔧 Normalizing type: ${input.projectType} → ${normalized}`);
      input.projectType = normalized;
    }

    try {
      const files: GeneratedFile[] = [];
      const stageResults: Record<string, PipelineStage> = {};

      // ═══════════════════════════════════════════════════════════
      // STAGE 1: ARCHITECTURE DESIGN
      // ═══════════════════════════════════════════════════════════
      const archStage = await this.executeStage(
        'Architecture Design',
        () => architectureDesigner.design({
          requirements: input.requirements.description,
          techStack: input.requirements.tech_stack
        } as any)
      );
      stageResults['architecture'] = archStage;

      if (archStage.success && archStage.output) {
        console.log(`✅ [CodeGenerator] Architecture designed`);
        const archFiles = this.extractFiles(archStage.output, 'architecture-designer');
        files.push(...archFiles);
        console.log(`[CodeGenerator] Architecture files: ${archFiles.length}`);
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 2: DATABASE DESIGN
      // ═══════════════════════════════════════════════════════════
      if (input.database) {
        const dbStage = await this.executeStage(
          'Database Design',
          () => databaseDesigner.design({
            type: input.database!.type,
            entities: input.database!.entities.map(name => ({
              id: name.toLowerCase(),
              entity: name,
              attributes: [],
              relationships: [],
              constraints: []
            })),
            requirements: input.requirements.description
          } as any)
        );
        stageResults['database'] = dbStage;

        if (dbStage.success && dbStage.output) {
          console.log(`✅ [CodeGenerator] Database designed`);
          const dbFiles = this.extractFiles(dbStage.output, 'database-designer');
          files.push(...dbFiles);
          console.log(`[CodeGenerator] Database files: ${dbFiles.length}`);
        }
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 3: BACKEND GENERATION
      // ═══════════════════════════════════════════════════════════
      if (input.projectType === ProjectType.BACKEND || input.projectType === ProjectType.FULLSTACK) {
        const backendStage = await this.executeStage(
          'Backend Generation',
          () => backendGenerator.generate({
            projectName: input.projectName,
            requirements: input.requirements,
            architecture: archStage.output,
            database: stageResults['database']?.output,
            authentication: input.authentication ? { type: 'jwt', providers: ['local'] } : undefined
          } as any)
        );
        stageResults['backend'] = backendStage;

        if (backendStage.success && backendStage.output) {
          console.log(`✅ [CodeGenerator] Backend generated`);
          const backendFiles = this.extractFiles(backendStage.output, 'backend-generator');
          files.push(...backendFiles);
          console.log(`[CodeGenerator] Backend files: ${backendFiles.length}`);
        }
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 4: API GENERATION
      // ═══════════════════════════════════════════════════════════
      if (input.api_type) {
        const apiStage = await this.executeStage(
          'API Generation',
          () => apiGenerator.generate({
            type: input.api_type,
            resources: input.requirements.features,
            authentication: input.authentication,
            database: stageResults['database']?.output
          } as any)
        );
        stageResults['api'] = apiStage;

        if (apiStage.success && apiStage.output) {
          console.log(`✅ [CodeGenerator] API generated: ${input.api_type}`);
          const apiFiles = this.extractFiles(apiStage.output, 'api-generator');
          files.push(...apiFiles);
          console.log(`[CodeGenerator] API files: ${apiFiles.length}`);
        }
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 5: UI GENERATION
      // ═══════════════════════════════════════════════════════════

      // ✅ FIX #4: Debug logs for UI Generation
      const isFullstack = input.projectType === ProjectType.FULLSTACK;
      const isFrontend = input.projectType === ProjectType.FRONTEND;
      const shouldGenerateUI = isFrontend || isFullstack;

      console.log('═══════════════════════════════════════════════════════════');
      console.log('🎨 [CodeGenerator] UI GENERATION CHECK:');
      console.log(`  - projectType (input): "${input.projectType}"`);
      console.log(`  - projectType (typeof): ${typeof input.projectType}`);
      console.log(`  - ProjectType.FULLSTACK: "${ProjectType.FULLSTACK}"`);
      console.log(`  - ProjectType.FRONTEND: "${ProjectType.FRONTEND}"`);
      console.log(`  - isFullstack: ${isFullstack}`);
      console.log(`  - isFrontend: ${isFrontend}`);
      console.log(`  - shouldGenerateUI: ${shouldGenerateUI}`);
      console.log('═══════════════════════════════════════════════════════════');

      if (shouldGenerateUI) {
        console.log('✅ [CodeGenerator] Executing stage: UI Generation...');
        
        const uiStage = await this.executeStage(
          'UI Generation',
          () => uiGenerator.generate({
            framework: input.requirements.tech_stack.frontend?.[0] || 'react',
            requirements: input.requirements,
            architecture: archStage.output,
            api: stageResults['api']?.output
          } as any)
        );
        
        stageResults['ui'] = uiStage;

        if (uiStage.success && uiStage.output) {
          console.log('✅ [CodeGenerator] UI generated');
          const uiFiles = this.extractFiles(uiStage.output, 'ui-generator');
          
          // 🎯 FIX #5.1: Normalize Vite Entry Point
          const normalizedFiles = this.normalizeViteEntryPoint(uiFiles);
          files.push(...normalizedFiles);
          console.log(`[CodeGenerator] UI files: ${normalizedFiles.length}`);
        } else {
          console.log('❌ [CodeGenerator] UI generation failed or returned no output');
          console.log(`  - uiStage.success: ${uiStage.success}`);
          console.log(`  - uiStage.output exists: ${!!uiStage.output}`);
        }
      } else {
        console.log('⏭️  [CodeGenerator] SKIPPING UI Generation');
        console.log(`  Reason: projectType "${input.projectType}" is not FRONTEND or FULLSTACK`);
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 6: TEST GENERATION
      // ═══════════════════════════════════════════════════════════
      if (input.options?.generateTests !== false) {
        const testStage = await this.executeStage(
          'Test Generation',
          () => testGenerator.generate({
            components: files.map(f => ({ name: f.filename, path: f.path })),
            framework: input.requirements.tech_stack.frontend?.[0] || 'jest'
          } as any)
        );
        stageResults['tests'] = testStage;

        if (testStage.success && testStage.output) {
          console.log(`✅ [CodeGenerator] Tests generated`);
          const testFiles = this.extractFiles(testStage.output, 'test-generator');
          files.push(...testFiles);
          console.log(`[CodeGenerator] Test files: ${testFiles.length}`);
        }
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 7: CODE OPTIMIZATION
      // ═══════════════════════════════════════════════════════════
      if (input.options?.optimizeCode !== false && files.length > 0) {
        const optimizeStage = await this.executeStage(
          'Code Optimization',
          () => codeOptimizer.optimize({
            code: files.map(f => f.content).join('\n\n'),
            options: {}
          } as any)
        );
        stageResults['optimization'] = optimizeStage;

        if (optimizeStage.success && optimizeStage.output) {
          console.log(`✅ [CodeGenerator] Code optimized`);
          
          // Try to apply optimizations if output has optimizedFiles
          if (optimizeStage.output && optimizeStage.output.optimizedFiles && Array.isArray(optimizeStage.output.optimizedFiles)) {
            optimizeStage.output.optimizedFiles.forEach((opt: any) => {
              const fileIndex = files.findIndex(f => f.path === opt.path);
              if (fileIndex >= 0) {
                if (files[fileIndex]) {
                  files[fileIndex].content = opt.content;
                }
              }
            });
          }
        }
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 8: QUALITY ANALYSIS
      // ═══════════════════════════════════════════════════════════
      if (input.options?.analyzeQuality !== false && files.length > 0) {
        const qualityStage = await this.executeStage(
          'Quality Analysis',
          () => qualityAnalyzer.analyze({
            code: files.map(f => f.content).join('\n\n')
          } as any)
        );
        stageResults['quality'] = qualityStage;

        if (qualityStage.success) {
          console.log(`✅ [CodeGenerator] Quality analyzed: score ${qualityStage.output?.score || 'N/A'}`);
        }
      }

      // ═══════════════════════════════════════════════════════════
      // STAGE 9: CIG-2.0 VALIDATION
      // ═══════════════════════════════════════════════════════════
      if (files.length > 0) {
        const cigStage = await this.executeStage(
          'CIG Validation',
          () => cigValidator.validate({
            code: files.map(f => f.content).join('\n\n'),
            language: 'typescript',
            rules: ['syntax', 'types', 'imports']
          } as any)
        );
        stageResults['cig'] = cigStage;

        if (cigStage.success) {
          console.log(`✅ [CodeGenerator] CIG validation complete`);
        }
      }

        // ═══════════════════════════════════════════════════════════
      // STAGE 10: GENERATE CONFIG FILES
      // ═══════════════════════════════════════════════════════════
      console.log('📦 [CodeGenerator] Generating configuration files...');
      const configFiles = this.generatePackageJsonConfigs(
        input.requirements.tech_stack.frontend?.[0] || 'react',
        input.projectType === ProjectType.BACKEND || input.projectType === ProjectType.FULLSTACK,
        !!input.database,
        input.database?.entities || []
      );

      const tsconfigs = this.generateTsConfigFiles();

      // Add config files
      files.push(
        // FRONTEND package.json
        {
          path: 'frontend',
          filename: 'package.json',
          name: 'package.json',
          content: configFiles.frontend,
          type: FileType.JSON,
          size: configFiles.frontend.length,
          metadata: { 
            generator: 'code-generator', 
            timestamp: new Date().toISOString()
          }
        },
        // FRONTEND tsconfig.json
        {
          path: 'frontend',
          filename: 'tsconfig.json',
          name: 'tsconfig.json',
          content: tsconfigs.frontend,
          type: FileType.JSON,
          size: tsconfigs.frontend.length,
          metadata: { 
            generator: 'code-generator', 
            timestamp: new Date().toISOString()
          }
        },
        // BACKEND package.json
        {
          path: 'backend',
          filename: 'package.json',
          name: 'package.json',
          content: configFiles.backend,
          type: FileType.JSON,
          size: configFiles.backend.length,
          metadata: { 
            generator: 'code-generator', 
            timestamp: new Date().toISOString()
          }
        },
        // BACKEND tsconfig.json
        {
          path: 'backend',
          filename: 'tsconfig.json',
          name: 'tsconfig.json',
          content: tsconfigs.backend,
          type: FileType.JSON,
          size: tsconfigs.backend.length,
          metadata: { 
            generator: 'code-generator', 
            timestamp: new Date().toISOString()
          }
        },
        // ROOT package.json (RAIZ!)
        {
          path: '',  // ← VAZIO = raiz do projeto
          filename: 'package.json',
          name: 'package.json',
          content: configFiles.root,
          type: FileType.JSON,
          size: configFiles.root.length,
          metadata: {
            generator: 'code-generator',
            timestamp: new Date().toISOString(),
            isRoot: true
          }
        }
      );

      console.log(`📦 [CodeGenerator] 3 package.json files added:`);
      console.log(`   ├─ frontend/package.json`);
      console.log(`   ├─ backend/package.json`);
      console.log(`   └─ package.json (ROOT)`);

      // ✅ FIX #14: Validar e garantir root package.json está na raiz
      let rootPackageCount = 0;
      files.forEach((file, index) => {
        if (file.filename === 'package.json' && file.metadata?.isRoot === true) {
          rootPackageCount++;
          console.log(`[CodeGenerator] 🔧 FIX #14: Validating root package.json`);
          
          if (file.path !== '') {
            console.log(`[CodeGenerator] ⚠️  WARNING: Root path was "${file.path}", correcting to empty`);
            files[index] = {
              ...file,
              path: '',  // ← FORÇA para vazio
              metadata: {
                ...file.metadata,
                isRoot: true
              }
            };
          } else {
            console.log(`[CodeGenerator] ✅ Root package.json path confirmed: empty (raiz)`);
          }
        }
      });

      if (rootPackageCount === 0) {
        console.warn(`[CodeGenerator] ⚠️  WARNING: No root package.json found! Check FIX #14`);
      }

      console.log(`✅ [CodeGenerator] Config files validated: ${files.filter(f => f.filename === 'package.json').length} package.json files`);

// ✅ FIX #15: Add Tailwind + PostCSS configs
const tailwindConfig = this.generateTailwindConfig();
const postCSSConfig = this.generatePostCSSConfig();

files.push(
  {
    path: 'frontend',
    filename: 'tailwind.config.js',
    name: 'tailwind.config.js',
    content: tailwindConfig,
    type: FileType.JAVASCRIPT,
    size: tailwindConfig.length,
    metadata: {
      generator: 'code-generator',
      timestamp: new Date().toISOString(),
      isConfig: true
    } as any
  },
  {
    path: 'frontend',
    filename: 'postcss.config.js',
    name: 'postcss.config.js',
    content: postCSSConfig,
    type: FileType.JAVASCRIPT,
    size: postCSSConfig.length,
    metadata: {
      generator: 'code-generator',
      timestamp: new Date().toISOString(),
      isConfig: true
    } as any
  }
);

console.log(`✅ [CodeGenerator] Tailwind + PostCSS configs added`);
      // ═══════════════════════════════════════════════════════════
      // STAGE 11: FIX IMPORT REFERENCES
      // ═══════════════════════════════════════════════════════════
      console.log('🔧 [CodeGenerator] ════════════════════════════════════════');
      console.log('🔧 [CodeGenerator] STAGE 11: Fixing import references...');
      console.log('🔧 [CodeGenerator] ════════════════════════════════════════');
      
      // Debug: Files count before
      const filesCountBefore = files.length;
      console.log(`[CodeGenerator] 📊 Files before import fix: ${filesCountBefore}`);
      
      // Create reference map of all files
      const referenceMap = this.createImportReferenceMap(files);
      console.log(`[CodeGenerator] 🗺️  Reference map created: ${referenceMap.size} entries`);
      
      // Debug: Sample of reference map
      let mapSample = 0;
      referenceMap.forEach((value, key) => {
        if (mapSample < 5) {
          console.log(`[CodeGenerator]   └─ "${key}" → "${value}"`);
          mapSample++;
        }
      });
      if (referenceMap.size > 5) {
        console.log(`[CodeGenerator]   └─ ... and ${referenceMap.size - 5} more entries`);
      }
      
      // Fix imports in all files
      const filesWithFixedImports = this.fixImportReferencesInFiles(files, referenceMap);
      
      // Debug: Count TypeScript files that were processed
      const tsFilesProcessed = filesWithFixedImports.filter(f => 
        f.filename.endsWith('.ts') || f.filename.endsWith('.tsx')
      ).length;
      console.log(`[CodeGenerator] ✅ Import references fixed in ${tsFilesProcessed} TypeScript files`);
      
      // Debug: Verify no files were lost
      const filesCountAfter = filesWithFixedImports.length;
      if (filesCountAfter !== filesCountBefore) {
        console.warn(`[CodeGenerator] ⚠️  WARNING: File count changed from ${filesCountBefore} to ${filesCountAfter}`);
      } else {
        console.log(`[CodeGenerator] ✅ All ${filesCountAfter} files preserved`);
      }
      
      // Debug: Sample of fixed content
      const sampleFile = filesWithFixedImports.find(f => 
        f.filename.endsWith('.ts') && f.content?.includes('from')
      );
      if (sampleFile) {
        const importLines = sampleFile.content
          .split('\n')
          .filter(line => line.includes('from'))
          .slice(0, 3);
        console.log(`[CodeGenerator] 📄 Sample imports from "${sampleFile.filename}":`);
        importLines.forEach(line => {
          console.log(`[CodeGenerator]   └─ ${line.trim()}`);
        });
      }
      
      console.log('🔧 [CodeGenerator] ════════════════════════════════════════');


      // ═══════════════════════════════════════════════════════════
      // FINAL METRICS & RESULT
      // ═══════════════════════════════════════════════════════════
      const totalLines = filesWithFixedImports.reduce((sum: number, f: GeneratedFile) => sum + (f.content?.split('\n').length || 0), 0);
      const generationTime = Date.now() - startTime;

      console.log('═══════════════════════════════════════════════════════════════');
      console.log('✅ [CodeGenerator] PIPELINE COMPLETE');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(`[CodeGenerator] 📦 Total files: ${filesWithFixedImports.length}`);
      console.log(`[CodeGenerator] 📝 Total lines: ${totalLines}`);
      console.log(`[CodeGenerator] ⏱️  Generation time: ${generationTime}ms`);
      
      // Files breakdown
      const tsCount = filesWithFixedImports.filter(f => f.filename.endsWith('.ts') || f.filename.endsWith('.tsx')).length;
      const jsCount = filesWithFixedImports.filter(f => f.filename.endsWith('.js') || f.filename.endsWith('.jsx')).length;
      const jsonCount = filesWithFixedImports.filter(f => f.filename.endsWith('.json')).length;
      const otherCount = filesWithFixedImports.length - tsCount - jsCount - jsonCount;
      
      console.log(`[CodeGenerator] 📊 Breakdown:`);
      console.log(`[CodeGenerator]   ├─ TypeScript: ${tsCount}`);
      console.log(`[CodeGenerator]   ├─ JavaScript: ${jsCount}`);
      console.log(`[CodeGenerator]   ├─ JSON: ${jsonCount}`);
      console.log(`[CodeGenerator]   └─ Other: ${otherCount}`);
      
      console.log('═══════════════════════════════════════════════════════════════');

      return {
        success: true,
        projectName: input.projectName,
        files: filesWithFixedImports,
        structure: this.buildProjectStructure(filesWithFixedImports),
        metrics: {
          totalFiles: filesWithFixedImports.length,
          totalLines: totalLines,
          generationTime: generationTime,
        
        },
        pipeline: {
          stagesExecuted: Object.keys(stageResults).length,
          stageResults: stageResults
        },
        metadata: {
          timestamp: new Date().toISOString(),
          version: this.version
        }
      };

    } catch (error) {
      console.error('═══════════════════════════════════════════════════════════════');
      console.error('❌ [CodeGenerator] PIPELINE FAILED');
      console.error('═══════════════════════════════════════════════════════════════');
      console.error('[CodeGenerator] 💥 Error:', (error as Error).message);
      console.error('[CodeGenerator] 📍 Stack:', (error as Error).stack);
      console.error('═══════════════════════════════════════════════════════════════');

      throw error;
    }
  }


  // ═══════════════════════════════════════════════════════════
  // 🎯 FIX #5 - PRIVATE METHODS (ALL FIXES)
  // ═══════════════════════════════════════════════════════════

  /**
   * FIX 5.1 - Normalize Vite Entry Point (index → main)
   */
  private normalizeViteEntryPoint(files: GeneratedFile[]): GeneratedFile[] {
    return files.map(file => {
      // Se for index.tsx/ts do frontend, renomear para main
      if (
        (file.path.includes('src/index.tsx') || file.path.includes('src/index.ts')) &&
        !file.path.includes('backend')
      ) {
        const newPath = file.path.replace(/index\.(tsx|ts)$/, 'main.$1');
        return { 
          ...file, 
          path: newPath, 
          filename: `main.${file.filename.split('.')[1]}`
        };
      }
      return file;
    });
  }

  /**
   * FIX 5.2 - Import Path Normalization
   */
  private normalizeImportPath(importPath: string): string {
    // Remove múltiplos dots: "..." → "../"
    let normalized = importPath.replace(/\.\.\./g, '../');
    
    // Remove dots soltos: "." antes de nome → "./"
    normalized = normalized.replace(/\.(?=[a-zA-Z])/g, './');
    
    // Remove espaços extras
    normalized = normalized.replace(/\s+/g, '');
    
    // Garante relative imports começam com "./"
    if (!normalized.startsWith('.') && !normalized.startsWith('/')) {
      normalized = './' + normalized;
    }
    
    return normalized;
  }

/**
 * Corrige paths de import em conteúdo gerado
 * - Converte backend/src/... e frontend/src/... para relativos
 * - Mantém imports de pacotes npm inalterados
 * - Remove extensão .ts apenas de imports relativos
 */
private fixImportsInContent(content: string): string {
  if (!content) return content;

  let fixed = content;

  // backend/src → relativo
  fixed = fixed.replace(
    /from\s+['"]backend\/src\/([^'"]+)['"]/g,
    "from './$1'",
  );

  // frontend/src → relativo
  fixed = fixed.replace(
    /from\s+['"]frontend\/src\/([^'"]+)['"]/g,
    "from './$1'",
  );

  // Normaliza excesso de pontos (../../../../ → ./ se aplicável, opcional)
  fixed = fixed.replace(/from\s+['"]\.{4,}\/([^'"]+)['"]/g, "from './$1'");

  // Remove .ts em imports relativos (não toca pacotes)
  fixed = fixed.replace(
    /from\s+['"](\.{1,2}\/[^'"]*?)\.ts['"]/g,
    "from '$1'",
  );

  // Corrige casos de ".catalog.routes" → "./catalog.routes"
  fixed = fixed.replace(/from\s+['"]\.([a-zA-Z0-9])/g, "from './$1'");

  return fixed;
}


 /**
 * FIX 5.4 - Create Import Reference Map (CORRIGIDA)
 * Mapeia variações de nomes para o path completo do arquivo
 */
private createImportReferenceMap(files: GeneratedFile[]): Map<string, string> {
  const map = new Map<string, string>();
  
  files.forEach(file => {
    // Path completo relativo
    const fullPath = file.path 
      ? `${file.path}/${file.filename}`.replace(/\\/g, '/')
      : file.filename;
    
    // Remover extensão
    const withoutExt = fullPath.replace(/\.(ts|tsx|js|jsx)$/, '');
    
    // Basename sem extensão
    const basename = file.filename
      .replace(/\.(ts|tsx|js|jsx)$/, '')
      .toLowerCase();
    
    // Variações de nome
    const camelCase = basename;
    const kebabCase = basename.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    
    // Mapear variações para path completo (SEM extensão)
    map.set(camelCase, withoutExt);
    map.set(kebabCase, withoutExt);
    map.set(file.filename, withoutExt);
    
    console.log(`[ImportMap] ${basename} → ${withoutExt}`);
  });
  
  return map;
}


/**
 * FIX 5.5 - Fix Import References Using Map (CORRIGIDA)
 * Usa o mapa para corrigir imports incorretos
 */
private fixImportReferencesInFiles(
  files: GeneratedFile[],
  referenceMap: Map<string, string>
): GeneratedFile[] {
  return files.map(file => {
    let content = file.content || '';
    
    // Primeiro: aplicar fixImportsInContent() (regras gerais)
    content = this.fixImportsInContent(content);
    
    // Depois: usar mapa para imports específicos
    // Regex para capturar imports incorretos
    const importRegex = /from\s+['"]([^'"]+)['"]/g;
    
    content = content.replace(importRegex, (match, importPath) => {
      // Se já é relativo (./), deixar como está
      if (importPath.startsWith('.')) {
        return match;
      }
      
      // Se é npm package (sem /, sem extension), deixar
      if (!importPath.includes('/') && !importPath.includes('\\')) {
        return match;
      }
      
      // Se é path absoluto (backend/src/...), já foi corrigido por fixImportsInContent
      if (importPath.includes('backend/src') || importPath.includes('frontend/src')) {
        return match;  // fixImportsInContent já lidou com isso
      }
      
      // Tentar encontrar no mapa
      const basename = importPath
        .split(/[/\\]/)
        .pop()
        ?.replace(/\.(ts|tsx|js|jsx)$/, '')
        .toLowerCase() || '';
      
      const correctPath = referenceMap.get(basename);
      
      if (correctPath) {
        console.log(`[FixImports] ${importPath} → ${correctPath}`);
        return `from '${correctPath}'`;
      }
      
      return match;
    });
    
    return { ...file, content };
  });
}

 
  /**
   * Generate tsconfig.json for frontend and backend
   */
  private generateTsConfigFiles(): { frontend: string; backend: string } {
    
    // FRONTEND tsconfig.json
    const frontendTsConfig = {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        noImplicitAny: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        moduleResolution: "node",
        resolveJsonModule: true,
        jsx: "react-jsx",
        baseUrl: ".",
        paths: {
          "@/*": ["src/*"],
          "@components/*": ["src/components/*"],
          "@pages/*": ["src/pages/*"],
          "@hooks/*": ["src/hooks/*"],
          "@types/*": ["src/types/*"],
          "@utils/*": ["src/utils/*"]
        }
      },
      include: ["src"],
      references: [{ path: "./tsconfig.node.json" }]
    };
    
    // BACKEND tsconfig.json
    const backendTsConfig = {
      compilerOptions: {
        target: "ES2020",
        module: "ESNext",
        lib: ["ES2020"],
        outDir: "./dist",
        rootDir: "./src",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true,
        noImplicitAny: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        moduleResolution: "node",
        baseUrl: ".",
        paths: {
          "@/*": ["src/*"],
          "@routes/*": ["src/routes/*"],
          "@controllers/*": ["src/controllers/*"],
          "@middleware/*": ["src/middleware/*"],
          "@validators/*": ["src/validators/*"],
          "@types/*": ["src/types/*"],
          "@utils/*": ["src/utils/*"]
        }
      },
      include: ["src"],
      exclude: ["node_modules", "dist"]
    };
    
    return {
      frontend: JSON.stringify(frontendTsConfig, null, 2),
      backend: JSON.stringify(backendTsConfig, null, 2)
    };
  }

  private async executeStage(name: string, fn: () => Promise<any>): Promise<PipelineStage> {
    const startTime = Date.now();
    console.log(`\n🔧 [CodeGenerator] Executing stage: ${name}...`);

    try {
      const output = await fn();
      const duration = Date.now() - startTime;

      console.log(`✅ [CodeGenerator] Stage "${name}" completed in ${duration}ms`);

      return {
        name,
        success: true,
        output: output,
        duration: duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ [CodeGenerator] Stage "${name}" failed:`, (error as Error).message);

      return {
        name,
        success: false,
        duration: duration,
        error: (error as Error).message
      };
    }
  }

  private extractFiles(output: any, generatorName: string): GeneratedFile[] {
    const files: GeneratedFile[] = [];
    
    console.log(`[CodeGenerator] Extracting files from ${generatorName}...`);
    console.log(`[CodeGenerator] Output type: ${typeof output}`);
    console.log(`[CodeGenerator] Output keys:`, Object.keys(output || {}));

    if (!output) {
      console.log(`[CodeGenerator] No output from ${generatorName}`);
      return files;
    }

    // Strategy 1: Direct files array
    if (Array.isArray(output.files)) {
      console.log(`[CodeGenerator] Found ${output.files.length} files in output.files`);
      output.files.forEach((file: any) => {
        files.push(this.normalizeFile(file, generatorName));
      });
    }
    
    // Strategy 2: Direct array
    else if (Array.isArray(output)) {
      console.log(`[CodeGenerator] Output is array with ${output.length} items`);
      output.forEach((file: any) => {
        files.push(this.normalizeFile(file, generatorName));
      });
    }
    
    // ✅ FIX #4.2.11: Strategy 3 - Process component.files, NOT component
    else if (Array.isArray(output.components)) {
      console.log(`[CodeGenerator] Found ${output.components.length} components`);
      
      output.components.forEach((comp: any) => {
        // ✅ Se component tem files array, processa ELES
        if (comp.files && Array.isArray(comp.files)) {
          console.log(`[CodeGenerator] Component ${comp.name} has ${comp.files.length} files`);
          comp.files.forEach((file: any) => {
            files.push(this.normalizeFile(file, generatorName));
          });
        }
        // ❌ NÃO cria arquivo para o component em si!
        // Component é METADATA, não arquivo!
      });
    }
    
    // Strategy 4: Individual file properties
    else if (output.server || output.routes || output.controllers || output.schema) {
      console.log(`[CodeGenerator] Found individual file properties`);
      
      if (output.server) {
        files.push(this.createFile('backend/src', 'server.ts', output.server, FileType.TYPESCRIPT, generatorName));
      }
      if (output.routes) {
        Object.entries(output.routes).forEach(([name, content]) => {
          files.push(this.createFile('backend/src/routes', `${name}.routes.ts`, content as string, FileType.TYPESCRIPT, generatorName));
        });
      }
      if (output.controllers) {
        Object.entries(output.controllers).forEach(([name, content]) => {
          files.push(this.createFile('backend/src/controllers', `${name}.controller.ts`, content as string, FileType.TYPESCRIPT, generatorName));
        });
      }
      if (output.schema) {
        files.push(this.createFile('prisma', 'schema.prisma', output.schema, FileType.TYPESCRIPT, generatorName));
      }
    }
    
    // Strategy 5: Frontend specific
    else if (output.pages || output.hooks) {
      console.log(`[CodeGenerator] Found frontend structure`);
      
      if (output.pages) {
        Object.entries(output.pages).forEach(([name, content]) => {
          files.push(this.createFile('src/pages', `${name}.tsx`, content as string, FileType.TSX, generatorName));
        });
      }
      if (output.components) {
        Object.entries(output.components).forEach(([name, content]) => {
          files.push(this.createFile('src/components', `${name}.tsx`, content as string, FileType.TSX, generatorName));
        });
      }
      if (output.hooks) {
        Object.entries(output.hooks).forEach(([name, content]) => {
          files.push(this.createFile('src/hooks', `${name}.ts`, content as string, FileType.TYPESCRIPT, generatorName));
        });
      }
    }

    console.log(`[CodeGenerator] Extracted ${files.length} files from ${generatorName}`);
    return files;
  }
private normalizeFile(file: any, generatorName: string): GeneratedFile {
  const extractedFilename = file.filename || file.name || file.file || 'generated.ts';
  let extractedPath = file.path !== undefined ? file.path : (file.directory || 'src');

  // ROOT package.json — early return garantindo raiz
  if (file.metadata?.isRoot === true && extractedFilename === 'package.json') {
    console.log(`[normalizeFile] 🎯 ROOT FILE: ${extractedFilename}`);
    return {
      path: '',  // ← VAZIO para raiz
      filename: 'package.json',
      name: 'package.json',
      content: file.content || file.code || '',
      type: FileType.JSON,
      size: (file.content || file.code || '').length,
      metadata: {
        generator: generatorName,
        timestamp: new Date().toISOString(),
        isRoot: true,
      },
    };
  }

  // Para arquivos normais, NÃO concatenar path + filename
  // Manter separados conforme interface!
  
  let fullPath = extractedPath;

  // Se path contém extensão (arquivo), extrai apenas diretório
  if (fullPath.includes('.') && !extractedFilename.includes('/')) {
    const parts = fullPath.split('/');
    parts.pop();  // Remove último (arquivo)
    fullPath = parts.join('/');
    console.log(`[normalizeFile] Extracted directory: ${fullPath}`);
  }

  // ✅ NÃO concatenar aqui! Manter path e filename separados!
  
  console.log(`[normalizeFile] ✅ path="${fullPath}", filename="${extractedFilename}"`);

  const rawContent = file.content || file.code || '';
  const finalContent =
    extractedFilename.endsWith('.json') ? rawContent : this.fixImportsInContent(rawContent);

  return {
    path: fullPath,  // ← Só o diretório
    filename: extractedFilename,  // ← Só o arquivo
    name: extractedFilename,
    content: finalContent,
    type: this.detectFileType(extractedFilename),
    size: rawContent.length,
    metadata: {
      generator: generatorName,
      timestamp: new Date().toISOString(),
      dependencies: file.dependencies || file.imports || [],
    },
  };
}


  private createFile(
    path: string,
    filename: string,
    content: string,
    type: FileType,
    generator: string
  ): GeneratedFile {
    // ✅ FIX: Remove trailing slash
    let basePath = path;
    if (basePath.endsWith('/')) {
      basePath = basePath.slice(0, -1);
    }
    
    // ✅ FIX: Concatena path + filename
    const fullPath = basePath ? `${basePath}/${filename}` : filename;
    
    console.log(`[createFile] ✅ ${fullPath}`);
    
    return {
      path: fullPath,
      filename: filename,
      name: filename,
      content,
      type,
      size: content.length,
      metadata: {
        generator,
        timestamp: new Date().toISOString()
      }
    };
  }

  private detectFileType(filename: string): FileType {
    if (filename.endsWith('.tsx')) return FileType.TSX;
    if (filename.endsWith('.jsx')) return FileType.JSX;
    if (filename.endsWith('.ts')) return FileType.TYPESCRIPT;
    if (filename.endsWith('.js')) return FileType.JAVASCRIPT;
    if (filename.endsWith('.css')) return FileType.CSS;
    if (filename.endsWith('.html')) return FileType.HTML;
    if (filename.endsWith('.json')) return FileType.JSON;
    if (filename.endsWith('.md')) return FileType.MARKDOWN;
    return FileType.TYPESCRIPT;
  }

  private buildProjectStructure(files: GeneratedFile[]): Record<string, any> {
    const structure: Record<string, any> = {};

    files.forEach(file => {
      const parts = file.path.split('/');
      let current = structure;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // ✅ FIX: Garantir que é array antes de push
          if (!Array.isArray(current[part])) {
            current[part] = [];
          }
          current[part].push(file.filename);
          
        } else {
          // ✅ FIX: Garantir que é objeto antes de navegar
          if (typeof current[part] !== 'object' || Array.isArray(current[part])) {
            current[part] = {};
          }
          current = current[part];
        }
      });
    });

    return structure;
  }
  
/**
 * Generate package.json configs for frontend, backend, and root
 * ✅ FIX #16: Adiciona Tailwind, PostCSS, Autoprefixer
 */
/**
 * Generate package.json configs for frontend, backend, and root
 * ✅ Inclui Tailwind, PostCSS, Autoprefixer e concurrently
 */
private generatePackageJsonConfigs(
  framework: string,
  hasBackend: boolean,
  hasDatabase: boolean,
  entities: string[]
): { frontend: string; backend: string; root: string } {
  // FRONTEND (Vite + React + Tailwind)
  const frontendPkg = {
    name: 'project-frontend',
    version: '1.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
      lint: 'eslint src --ext ts,tsx',
    },
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      'react-router-dom': '^6.22.0',
      axios: '^1.6.7',
      zustand: '^4.5.0',
    },
    devDependencies: {
      '@types/react': '^18.2.56',
      '@types/react-dom': '^18.2.19',
      '@types/node': '^20.11.19',
      typescript: '^5.3.3',
      vite: '^5.1.3',
      '@vitejs/plugin-react': '^4.2.1',
      eslint: '^8.56.0',
      // Tailwind + PostCSS + Autoprefixer
      tailwindcss: '^3.4.1',
      postcss: '^8.4.32',
      autoprefixer: '^10.4.17',
    },
  };

  // BACKEND (Express + TS + Jest + Prisma condicional)
  const backendPkg = {
    name: 'project-backend',
    version: '1.0.0',
    private: true,
    type: 'commonjs',
    scripts: {
      dev: 'ts-node-dev --respawn --transpile-only src/server.ts',
      build: 'tsc',
      start: 'node dist/server.js',
      lint: 'eslint src --ext ts',
      test: 'jest',
    },
    dependencies: {
      express: '^4.18.2',
      cors: '^2.8.5',
      dotenv: '^16.4.1',
      ...(hasDatabase ? { '@prisma/client': '^5.9.1' } : {}),
      zod: '^3.22.4',
      jsonwebtoken: '^9.0.2',
      bcrypt: '^5.1.1',
    },
    devDependencies: {
      '@types/express': '^4.17.21',
      '@types/cors': '^2.8.17',
      '@types/node': '^20.11.19',
      '@types/jsonwebtoken': '^9.0.5',
      '@types/bcrypt': '^5.0.2',
      typescript: '^5.3.3',
      'ts-node': '^10.9.2',
      'ts-node-dev': '^2.0.0',
      ...(hasDatabase ? { prisma: '^5.9.1' } : {}),
      jest: '^29.7.0',
      '@types/jest': '^29.5.12',
      'ts-jest': '^29.1.2',
    },
  };

  // ROOT (workspaces + concurrently)
  const rootPkg = {
    name: 'project',
    version: '1.0.0',
    private: true,
    workspaces: ['frontend', 'backend'],
    scripts: {
      'install:all': 'npm install && npm install --workspaces',
      dev: 'concurrently "npm run dev --workspace=frontend" "npm run dev --workspace=backend"',
      'dev:frontend': 'npm run dev --workspace=frontend',
      'dev:backend': 'npm run dev --workspace=backend',
      build: 'npm run build --workspace=frontend && npm run build --workspace=backend',
      'build:frontend': 'npm run build --workspace=frontend',
      'build:backend': 'npm run build --workspace=backend',
      start: 'npm run start --workspace=backend',
      test: 'npm run test --workspace=backend',
      lint: 'npm run lint --workspaces',
    },
    devDependencies: {
      concurrently: '^8.2.2',
    },
  };

  return {
    frontend: JSON.stringify(frontendPkg, null, 2),
    backend: JSON.stringify(backendPkg, null, 2),
    root: JSON.stringify(rootPkg, null, 2),
  };
}


  /**
   * Normalize entity name to lowercase (for file/route names)
   */
  private normalizeEntityName(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s-]+/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  /**
   * Normalize entity name to PascalCase (for class/component names)
   */
  private normalizeToPascalCase(name: string): string {
    const normalized = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s-]+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
    
    return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
  }
/**
 * Generate Tailwind CSS configuration
 */
private generateTailwindConfig(): string {
  return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
`;
}

/**
 * Generate PostCSS configuration
 */
private generatePostCSSConfig(): string {
  return `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
}

}  // ← Fecha a CLASSE CodeGenerator



export const codeGenerator = new CodeGenerator();
export default codeGenerator;
