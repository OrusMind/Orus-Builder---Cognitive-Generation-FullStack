/**
 * ============================================================================
 * ORUS BUILDER - PROJECT TYPES
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T20:53:00-03:00
 * LAST_MODIFIED: 2025-10-09T20:53:00-03:00
 * COMPONENT_HASH: orus.frontend.types.project.20251009.PRJ2C3D4
 * 
 * PURPOSE:
 * - Extended project-specific types
 * - Project state management types
 * - File system types
 * - Project settings and configuration
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: ProjectManagementAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 90
 * - TRINITY_INTEGRATED: Cerebro (Organization Logic)
 * ============================================================================
 */

import { Framework, ProgrammingLanguage, ProjectStatus, FileNode } from './api.types';

// ============================================================================
// EXTENDED PROJECT TYPES
// ============================================================================

/**
 * Project Settings
 */
export interface ProjectSettings {
  autoSave: boolean;
  autoFormat: boolean;
  linting: boolean;
  typescript: TypeScriptSettings;
  deployment: DeploymentSettings;
  collaboration: CollaborationSettings;
}

/**
 * TypeScript Settings
 */
export interface TypeScriptSettings {
  enabled: boolean;
  strict: boolean;
  target: 'ES5' | 'ES2015' | 'ES2020' | 'ESNext';
  module: 'CommonJS' | 'ES2015' | 'ESNext';
}

/**
 * Deployment Settings
 */
export interface DeploymentSettings {
  autoDeployOnPush: boolean;
  platform?: string;
  environment: 'development' | 'staging' | 'production';
}

/**
 * Collaboration Settings
 */
export interface CollaborationSettings {
  enabled: boolean;
  allowComments: boolean;
  allowEditing: boolean;
  maxParticipants: number;
}

/**
 * Project Statistics
 */
export interface ProjectStatistics {
  totalFiles: number;
  totalLines: number;
  totalSize: number; // bytes
  languages: LanguageStats[];
  lastModified: string;
  buildStatus?: BuildStatus;
}

/**
 * Language Statistics
 */
export interface LanguageStats {
  language: string;
  files: number;
  lines: number;
  percentage: number;
}

/**
 * Build Status
 */
export interface BuildStatus {
  status: 'success' | 'error' | 'building' | 'not-built';
  lastBuild?: string;
  duration?: number; // milliseconds
  errors?: BuildError[];
}

/**
 * Build Error
 */
export interface BuildError {
  file: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Project Filter
 */
export interface ProjectFilter {
  status?: ProjectStatus[];
  framework?: Framework[];
  language?: ProgrammingLanguage[];
  searchQuery?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * File Operation
 */
export interface FileOperation {
  type: 'create' | 'update' | 'delete' | 'rename' | 'move';
  fileId: string;
  path: string;
  newPath?: string;
  content?: string;
  timestamp: string;
}

/**
 * Project Backup
 */
export interface ProjectBackup {
  id: string;
  projectId: string;
  timestamp: string;
  size: number;
  description?: string;
}


/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: None (types only)
 * NAMED_EXPORTS: All interfaces
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
