/**
 * ============================================================================
 * ORUS BUILDER - BLUEPRINT TYPES
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T20:53:00-03:00
 * LAST_MODIFIED: 2025-10-09T20:53:00-03:00
 * COMPONENT_HASH: orus.frontend.types.blueprint.20251009.BLP5F6G7
 * 
 * PURPOSE:
 * - Blueprint parsing types
 * - Image-to-code types
 * - Tree structure types
 * - Cognitive metadata types
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: BlueprintRecognitionAgent
 * - COGNITIVE_LEVEL: Supreme
 * - AUTONOMY_DEGREE: 99
 * - TRINITY_INTEGRATED: Alma (Pattern Recognition)
 * ============================================================================
 */

// ============================================================================
// BLUEPRINT UPLOAD TYPES
// ============================================================================

/**
 * Blueprint File
 */
export interface BlueprintFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  status: BlueprintStatus;
}

/**
 * Blueprint Status enum
 */
export enum BlueprintStatus {
  UPLOADING = 'uploading',
  PARSING = 'parsing',
  PARSED = 'parsed',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Blueprint Parse Progress
 */
export interface BlueprintParseProgress {
  stage: ParseStage;
  progress: number; // 0-100
  message: string;
  estimatedTimeRemaining?: number; // seconds
}

/**
 * Parse Stage enum
 */
export enum ParseStage {
  UPLOADING = 'uploading',
  ANALYZING_IMAGE = 'analyzing_image',
  DETECTING_PATTERNS = 'detecting_patterns',
  BUILDING_TREE = 'building_tree',
  EXTRACTING_METADATA = 'extracting_metadata',
  FINALIZING = 'finalizing',
}

// ============================================================================
// TREE STRUCTURE TYPES
// ============================================================================

/**
 * Parsed Blueprint Tree
 */
export interface ParsedBlueprintTree {
  root: BlueprintTreeNode;
  metadata: BlueprintTreeMetadata;
  visualization: TreeVisualization;
}

/**
 * Blueprint Tree Node
 */
export interface BlueprintTreeNode {
  id: string;
  name: string;
  type: NodeType;
  path: string;
  children: BlueprintTreeNode[];
  metadata: BlueprintNodeMetadata;
  visualData?: NodeVisualData;
}

/**
 * Node Type enum
 */
export enum NodeType {
  ROOT = 'root',
  FOLDER = 'folder',
  FILE = 'file',
  COMPONENT = 'component',
  SERVICE = 'service',
  UTIL = 'util',
  CONFIG = 'config',
}

/**
 * Blueprint Node Metadata
 */
export interface BlueprintNodeMetadata {
  purpose?: string;
  description?: string;
  dependencies?: string[];
  exports?: string[];
  imports?: string[];
  cognitiveContext?: string;
  confidence: number; // 0-1
}

/**
 * Node Visual Data
 */
export interface NodeVisualData {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  icon?: string;
}

/**
 * Blueprint Tree Metadata
 */
export interface BlueprintTreeMetadata {
  totalNodes: number;
  totalFiles: number;
  totalFolders: number;
  depth: number;
  estimatedComplexity: 'low' | 'medium' | 'high';
  detectedPatterns: DetectedPattern[];
  confidence: number; // 0-1
}

/**
 * Detected Pattern
 */
export interface DetectedPattern {
  name: string;
  type: PatternType;
  confidence: number;
  description: string;
  occurrences: number;
}

/**
 * Pattern Type enum
 */
export enum PatternType {
  ARCHITECTURE = 'architecture',
  DESIGN = 'design',
  COMPONENT = 'component',
  FOLDER_STRUCTURE = 'folder_structure',
  NAMING = 'naming',
}

// ============================================================================
// VISUALIZATION TYPES
// ============================================================================

/**
 * Tree Visualization
 */
export interface TreeVisualization {
  type: VisualizationType;
  layout: LayoutType;
  nodes: VisualNode[];
  edges: VisualEdge[];
  dimensions: Dimensions;
}

/**
 * Visualization Type enum
 */
export enum VisualizationType {
  TREE = 'tree',
  GRAPH = 'graph',
  CIRCULAR = 'circular',
  HIERARCHICAL = 'hierarchical',
}

/**
 * Layout Type enum
 */
export enum LayoutType {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  RADIAL = 'radial',
  FORCE = 'force',
}

/**
 * Visual Node
 */
export interface VisualNode {
  id: string;
  label: string;
  type: NodeType;
  position: Position2D;
  size: Size;
  color: string;
  metadata: Record<string, unknown>;
}

/**
 * Visual Edge
 */
export interface VisualEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
}

/**
 * Edge Type enum
 */
export enum EdgeType {
  PARENT_CHILD = 'parent_child',
  DEPENDENCY = 'dependency',
  IMPORT = 'import',
  EXPORT = 'export',
}

/**
 * Position 2D
 */
export interface Position2D {
  x: number;
  y: number;
}

/**
 * Size
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Dimensions
 */
export interface Dimensions {
  width: number;
  height: number;
  padding: number;
}

// ============================================================================
// COGNITIVE METADATA TYPES
// ============================================================================

/**
 * Cognitive Metadata
 */
export interface CognitiveMetadata {
  projectPurpose: string;
  architecturalPattern: string;
  cognitiveComplexity: number; // 0-10
  userIntent: string;
  suggestedImprovements: Improvement[];
  aiAnalysis: AIAnalysis;
}

/**
 * Improvement
 */
export interface Improvement {
  category: 'architecture' | 'structure' | 'naming' | 'patterns';
  description: string;
  priority: 'low' | 'medium' | 'high';
  autoFixable: boolean;
}

/**
 * AI Analysis
 */
export interface AIAnalysis {
  confidence: number;
  processingTime: number; // milliseconds
  modelsUsed: string[];
  insights: string[];
}

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: None (types only)
 * NAMED_EXPORTS: All interfaces and enums
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal + backend shared (blueprint parsing)
 * ============================================================================
 */
