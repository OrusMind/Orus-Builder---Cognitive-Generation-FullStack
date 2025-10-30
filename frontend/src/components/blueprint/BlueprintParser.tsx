/**
 * ============================================================================
 * ORUS BUILDER - BLUEPRINT PARSER COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T09:00:00-03:00
 * LAST_MODIFIED: 2025-10-10T09:00:00-03:00
 * COMPONENT_HASH: orus.frontend.component.blueprintparser.20251010.BLP7M8N9
 * 
 * PURPOSE:
 * - Visual blueprint parsing display
 * - Real-time parsing progress
 * - Extracted metadata visualization
 * - ORUS pattern recognition results
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: BlueprintVisualizationAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 78
 * - TRINITY_INTEGRATED: Voz (Document Reading)
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  FileText,
  Check,
  AlertCircle,
  Sparkles,
  Loader2,
  ChevronRight,
  ChevronDown,
  Code,
  Hash,
  Tag,
  Info,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Progress } from '@/components/common/Progress';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BlueprintParserProps {
  /**
   * Blueprint content to parse
   */
  content: string;

  /**
   * File name
   */
  fileName: string;

  /**
   * Parse complete callback
   */
  onParseComplete?: (result: ParsedBlueprint) => void;

  /**
   * Parse error callback
   */
  onParseError?: (error: Error) => void;
}

export interface ParsedBlueprint {
  metadata: BlueprintMetadata;
  structure: ProjectStructure;
  components: ComponentDefinition[];
  dependencies: string[];
  patterns: DetectedPattern[];
}

export interface BlueprintMetadata {
  title: string;
  hash: string;
  version: string;
  author?: string;
  createdDate?: Date;
  framework?: string;
  language?: string;
  description?: string;
}

export interface ProjectStructure {
  folders: FolderNode[];
  totalFiles: number;
  totalFolders: number;
}

export interface FolderNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: FolderNode[];
}

export interface ComponentDefinition {
  name: string;
  type: string;
  purpose: string;
  hash: string;
  dependencies: string[];
}

export interface DetectedPattern {
  type: 'ORUS' | 'CIG' | 'COGNITIVE' | 'TRINITY';
  confidence: number;
  location: string;
  data: Record<string, unknown>;
}

type ParseStage = 'metadata' | 'structure' | 'components' | 'patterns' | 'validation' | 'complete';

// ============================================================================
// BLUEPRINT PARSER COMPONENT
// ============================================================================

export const BlueprintParser: React.FC<BlueprintParserProps> = ({
  content,
  fileName,
  onParseComplete,
  onParseError,
}) => {
  const [isParsing, setIsParsing] = useState(false);
  const [currentStage, setCurrentStage] = useState<ParseStage>('metadata');
  const [progress, setProgress] = useState(0);
  const [parsedData, setParsedData] = useState<ParsedBlueprint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['metadata']));

  // Start parsing on mount
  useEffect(() => {
    startParsing();
  }, [content]);

  const startParsing = async () => {
    setIsParsing(true);
    setProgress(0);
    setError(null);

    try {
      // Stage 1: Extract Metadata
      setCurrentStage('metadata');
      setProgress(20);
      await delay(500);
      const metadata = extractMetadata(content);

      // Stage 2: Parse Structure
      setCurrentStage('structure');
      setProgress(40);
      await delay(500);
      const structure = parseStructure(content);

      // Stage 3: Extract Components
      setCurrentStage('components');
      setProgress(60);
      await delay(500);
      const components = extractComponents(content);

      // Stage 4: Detect Patterns
      setCurrentStage('patterns');
      setProgress(80);
      await delay(500);
      const patterns = detectPatterns(content);

      // Stage 5: Validate
      setCurrentStage('validation');
      setProgress(90);
      await delay(300);
      const dependencies = extractDependencies(content);

      // Complete
      setCurrentStage('complete');
      setProgress(100);

      const result: ParsedBlueprint = {
        metadata,
        structure,
        components,
        dependencies,
        patterns,
      };

      setParsedData(result);
      setIsParsing(false);

      if (onParseComplete) {
        onParseComplete(result);
      }
    } catch (err) {
      setError((err as Error).message);
      setIsParsing(false);
      if (onParseError) {
        onParseError(err as Error);
      }
    }
  };

  // Parsing functions (mock implementations)
  const extractMetadata = (content: string): BlueprintMetadata => {
    const titleMatch = content.match(/# (.+)/);
    const hashMatch = content.match(/Hash[:\s]+([^\s\n]+)/i);
    const frameworkMatch = content.match(/Framework[:\s]+([^\s\n]+)/i);
    const languageMatch = content.match(/Language[:\s]+([^\s\n]+)/i);

    return {
      title: titleMatch?.[1] || 'Untitled Project',
      hash: hashMatch?.[1] || 'unknown',
      version: '1.0.0',
      framework: frameworkMatch?.[1] || 'react',
      language: languageMatch?.[1] || 'typescript',
      description: content.slice(0, 200),
    };
  };

  const parseStructure = (content: string): ProjectStructure => {
    // Mock structure parsing
    return {
      folders: [
        {
          name: 'src',
          path: '/src',
          type: 'folder',
          children: [
            { name: 'components', path: '/src/components', type: 'folder' },
            { name: 'pages', path: '/src/pages', type: 'folder' },
            { name: 'App.tsx', path: '/src/App.tsx', type: 'file' },
          ],
        },
        { name: 'package.json', path: '/package.json', type: 'file' },
      ],
      totalFiles: 10,
      totalFolders: 5,
    };
  };

  const extractComponents = (content: string): ComponentDefinition[] => {
  // Mock component extraction
  const componentMatches = content.matchAll(/##\s+(.+)/g);
  const components: ComponentDefinition[] = [];

  for (const match of componentMatches) {
    // ✅ FIXED: Added null check and fallback
    const componentName = match[1] || 'Unnamed Component';
    
    components.push({
      name: componentName,
      type: 'Component',
      purpose: 'Extracted from blueprint',
      hash: `comp${components.length}`,
      dependencies: [],
    });
  }

  return components.slice(0, 5);
};


  const detectPatterns = (content: string): DetectedPattern[] => {
    const patterns: DetectedPattern[] = [];

    // Detect ORUS pattern
    if (content.toLowerCase().includes('orus')) {
      patterns.push({
        type: 'ORUS',
        confidence: 95,
        location: 'Document header',
        data: { type: 'ORUS Blueprint' },
      });
    }

    // Detect CIG protocol
    if (content.toLowerCase().includes('cig')) {
      patterns.push({
        type: 'CIG',
        confidence: 88,
        location: 'Architecture section',
        data: { version: '2.0' },
      });
    }

    // Detect Cognitive DNA
    if (content.toLowerCase().includes('cognitive') || content.toLowerCase().includes('dna')) {
      patterns.push({
        type: 'COGNITIVE',
        confidence: 92,
        location: 'Component definitions',
        data: { hasDNA: true },
      });
    }

    // Detect Trinity
    if (content.toLowerCase().includes('trinity') || content.toLowerCase().includes('alma')) {
      patterns.push({
        type: 'TRINITY',
        confidence: 97,
        location: 'Integration layer',
        data: { integrated: true },
      });
    }

    return patterns;
  };

  const extractDependencies = (content: string): string[] => {
    const deps = new Set<string>();

    // Common dependencies patterns
    if (content.includes('react')) deps.add('react');
    if (content.includes('typescript')) deps.add('typescript');
    if (content.includes('mongodb')) deps.add('mongodb');
    if (content.includes('redis')) deps.add('redis');
    if (content.includes('express')) deps.add('express');

    return Array.from(deps);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const isExpanded = (section: string) => expandedSections.has(section);

  const getStageIcon = (stage: ParseStage) => {
    if (currentStage === stage) {
      return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
    }
    if (progress >= getStageProgress(stage)) {
      return <Check className="w-4 h-4 text-accent" />;
    }
    return <div className="w-4 h-4 rounded-full border-2 border-foreground-muted" />;
  };

  const getStageProgress = (stage: ParseStage): number => {
    const stageMap = {
      metadata: 20,
      structure: 40,
      components: 60,
      patterns: 80,
      validation: 90,
      complete: 100,
    };
    return stageMap[stage];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-xl font-bold text-foreground">Blueprint Parser</h3>
          <p className="text-sm text-foreground-muted">{fileName}</p>
        </div>
      </div>

      {/* Progress */}
      {isParsing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <Progress value={progress} />

          <div className="space-y-2">
            {['metadata', 'structure', 'components', 'patterns', 'validation'].map((stage) => (
              <div key={stage} className="flex items-center gap-3">
                {getStageIcon(stage as ParseStage)}
                <span className="text-sm text-foreground-muted capitalize">{stage}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-lg bg-error/10 border border-error flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-error mb-1">Parse Error</h4>
            <p className="text-sm text-foreground-muted">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {parsedData && !isParsing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Metadata */}
            <Section
              title="Metadata"
              icon={<Info className="w-5 h-5" />}
              isExpanded={isExpanded('metadata')}
              onToggle={() => toggleSection('metadata')}
            >
              <div className="grid grid-cols-2 gap-4">
                <MetadataItem label="Title" value={parsedData.metadata.title} />
                <MetadataItem label="Hash" value={parsedData.metadata.hash} />
                <MetadataItem label="Framework" value={parsedData.metadata.framework} />
                <MetadataItem label="Language" value={parsedData.metadata.language} />
              </div>
            </Section>

            {/* Detected Patterns */}
            <Section
              title="Detected Patterns"
              icon={<Sparkles className="w-5 h-5" />}
              isExpanded={isExpanded('patterns')}
              onToggle={() => toggleSection('patterns')}
              badge={parsedData.patterns.length}
            >
              <div className="space-y-2">
                {parsedData.patterns.map((pattern, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-background-elevated"
                  >
                    <div className="flex items-center gap-3">
                      <Tag className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{pattern.type}</p>
                        <p className="text-xs text-foreground-muted">{pattern.location}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-accent">
                      {pattern.confidence}%
                    </span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Components */}
            <Section
              title="Components"
              icon={<Code className="w-5 h-5" />}
              isExpanded={isExpanded('components')}
              onToggle={() => toggleSection('components')}
              badge={parsedData.components.length}
            >
              <div className="space-y-2">
                {parsedData.components.map((comp, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-background-elevated"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="w-4 h-4 text-foreground-muted" />
                      <span className="font-medium text-foreground">{comp.name}</span>
                    </div>
                    <p className="text-xs text-foreground-muted">{comp.purpose}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Dependencies */}
            <Section
              title="Dependencies"
              icon={<Tag className="w-5 h-5" />}
              isExpanded={isExpanded('dependencies')}
              onToggle={() => toggleSection('dependencies')}
              badge={parsedData.dependencies.length}
            >
              <div className="flex flex-wrap gap-2">
                {parsedData.dependencies.map((dep, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </Section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  badge?: number;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, isExpanded, onToggle, badge, children }) => (
  <div className="rounded-lg bg-background-surface border border-primary/20 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-background-elevated transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-primary">{icon}</span>
        <span className="font-semibold text-foreground">{title}</span>
        {badge !== undefined && (
          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
            {badge}
          </span>
        )}
      </div>
      {isExpanded ? (
        <ChevronDown className="w-5 h-5 text-foreground-muted" />
      ) : (
        <ChevronRight className="w-5 h-5 text-foreground-muted" />
      )}
    </button>

    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-primary/20"
        >
          <div className="p-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

interface MetadataItemProps {
  label: string;
  value?: string;
}

const MetadataItem: React.FC<MetadataItemProps> = ({ label, value }) => (
  <div>
    <p className="text-xs text-foreground-muted mb-1">{label}</p>
    <p className="text-sm font-medium text-foreground">{value || 'N/A'}</p>
  </div>
);

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: BlueprintParser (Blueprint parser visualization)
 * NAMED_EXPORTS: BlueprintParserProps, ParsedBlueprint
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
