/**
 * ============================================================================
 * ORUS BUILDER - API TYPES & INTERFACES
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T20:53:00-03:00
 * LAST_MODIFIED: 2025-10-09T20:53:00-03:00
 * COMPONENT_HASH: orus.frontend.types.api.20251009.API1B2C3
 * 
 * PURPOSE:
 * - Define all API request/response types for ORUS Builder backend
 * - Type-safe communication between frontend and backend
 * - Shared interfaces for all API services
 * - Error handling types and utilities
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: TypeSafetyAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 95
 * - TRINITY_INTEGRATED: Cerebro (Type Logic)
 * ============================================================================
 */

// ============================================================================
// GENERIC API TYPES
// ============================================================================

/**
 * Standard API Response wrapper
 * All API endpoints return this structure
 */
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: APIError;
  metadata?: ResponseMetadata;
}

/**
 * API Error structure
 */
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  path?: string;
}

/**
 * Response Metadata
 */
export interface ResponseMetadata {
  timestamp: string;
  requestId: string;
  duration: number; // milliseconds
  version: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Login Response
 */
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

/**
 * Register Request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  acceptTerms: boolean;
}

/**
 * User type
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
}

/**
 * User Role enum
 */
export enum UserRole {
  USER = 'user',
  PREMIUM = 'premium',
  ADMIN = 'admin',
}

/**
 * Refresh Token Request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============================================================================
// PROJECT TYPES
// ============================================================================

/**
 * Project type
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  framework: Framework;
  language: ProgrammingLanguage;
  template?: string;
  status: ProjectStatus;
  files: FileNode[];
  createdAt: string;
  updatedAt: string;
  owner: string;
  collaborators?: string[];
}

/**
 * Framework enum
 */
export enum Framework {
  REACT = 'react',
  VUE = 'vue',
  ANGULAR = 'angular',
  NEXTJS = 'nextjs',
  NUXTJS = 'nuxtjs',
  SVELTE = 'svelte',
}

/**
 * Programming Language enum
 */
export enum ProgrammingLanguage {
  TYPESCRIPT = 'typescript',
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
}

/**
 * Project Status enum
 */
export enum ProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  GENERATING = 'generating',
  ERROR = 'error',
}

/**
 * File Node structure
 */
export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  language?: string;
  size?: number;
}

/**
 * Create Project Request
 */
export interface CreateProjectRequest {
  name: string;
  description?: string;
  framework: Framework;
  language: ProgrammingLanguage;
  template?: string;
}

/**
 * Update Project Request
 */
export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

// ============================================================================
// GENERATION TYPES
// ============================================================================

/**
 * Generation Request
 */
export interface GenerationRequest {
  prompt: string;
  framework: Framework;
  language: ProgrammingLanguage;
  projectId?: string;
  options?: GenerationOptions;
}

/**
 * Generation Options
 */
export interface GenerationOptions {
  template?: string;
  style?: 'minimal' | 'standard' | 'feature-rich';
  includeTests?: boolean;
  includeDocumentation?: boolean;
  useTrinity?: boolean;
}

/**
 * Generation Response
 */
export interface GenerationResponse {
  projectId: string;
  files: GeneratedFile[];
  metadata: GenerationMetadata;
  status: GenerationStatus;
}

/**
 * Generated File
 */
export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
  size: number;
  hash: string;
}

/**
 * Generation Metadata
 */
export interface GenerationMetadata {
  totalFiles: number;
  totalLines: number;
  executionTime: number; // milliseconds
  cigValidation: CIGValidationResult;
  trinityUsed: boolean;
}

/**
 * CIG Validation Result
 */
export interface CIGValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number; // 0-100
}

/**
 * Validation Error
 */
export interface ValidationError {
  file: string;
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Validation Warning
 */
export interface ValidationWarning {
  file: string;
  message: string;
}

/**
 * Generation Status enum
 */
export enum GenerationStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// ============================================================================
// COLLABORATION TYPES
// ============================================================================

/**
 * Collaboration Session
 */
export interface CollaborationSession {
  id: string;
  projectId: string;
  participants: Participant[];
  startedAt: string;
  endedAt?: string;
}

/**
 * Participant
 */
export interface Participant {
  userId: string;
  name: string;
  avatar?: string;
  cursor?: CursorPosition;
  isActive: boolean;
}

/**
 * Cursor Position
 */
export interface CursorPosition {
  fileId: string;
  line: number;
  column: number;
}

/**
 * Chat Message
 */
export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}

// ============================================================================
// BLUEPRINT TYPES
// ============================================================================

/**
 * Blueprint Upload Request
 */
export interface BlueprintUploadRequest {
  file: File;
  projectId?: string;
  options?: BlueprintOptions;
}

/**
 * Blueprint Options
 */
export interface BlueprintOptions {
  autoGenerate?: boolean;
  framework?: Framework;
  language?: ProgrammingLanguage;
}

/**
 * Blueprint Parse Response
 */
export interface BlueprintParseResponse {
  tree: FileTree;
  metadata: BlueprintMetadata;
  preview: string;
}

/**
 * File Tree
 */
export interface FileTree {
  root: TreeNode;
  totalNodes: number;
}

/**
 * Tree Node
 */
export interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  metadata?: NodeMetadata;
}

/**
 * Node Metadata
 */
export interface NodeMetadata {
  purpose?: string;
  dependencies?: string[];
  exports?: string[];
}

/**
 * Blueprint Metadata
 */
export interface BlueprintMetadata {
  fileName: string;
  fileSize: number;
  parsedAt: string;
  confidence: number; // 0-1
  detectedPatterns: string[];
}

// ============================================================================
// DEPLOYMENT TYPES
// ============================================================================

/**
 * Deployment Request
 */
export interface DeploymentRequest {
  projectId: string;
  platform: DeploymentPlatform;
  config: DeploymentConfig;
}

/**
 * Deployment Platform enum
 */
export enum DeploymentPlatform {
  VERCEL = 'vercel',
  NETLIFY = 'netlify',
  AWS = 'aws',
  GCP = 'gcp',
  DOCKER = 'docker',
}

/**
 * Deployment Config
 */
export interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  envVars?: Record<string, string>;
  buildCommand?: string;
  outputDir?: string;
}

/**
 * Deployment Response
 */
export interface DeploymentResponse {
  deploymentId: string;
  url?: string;
  status: DeploymentStatus;
  logs: string[];
}

/**
 * Deployment Status enum
 */
export enum DeploymentStatus {
  QUEUED = 'queued',
  BUILDING = 'building',
  DEPLOYING = 'deploying',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

// ============================================================================
// MARKETPLACE TYPES
// ============================================================================

/**
 * Marketplace Item
 */
export interface MarketplaceItem {
  id: string;
  type: 'template' | 'plugin' | 'api';
  name: string;
  description: string;
  author: string;
  price: number; // 0 for free
  rating: number; // 0-5
  downloads: number;
  tags: string[];
  thumbnail?: string;
  createdAt: string;
}

/**
 * Install Request
 */
export interface InstallRequest {
  itemId: string;
  projectId?: string;
}

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: None (types only)
 * NAMED_EXPORTS: All interfaces and enums
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal + backend shared
 * ============================================================================
 */
