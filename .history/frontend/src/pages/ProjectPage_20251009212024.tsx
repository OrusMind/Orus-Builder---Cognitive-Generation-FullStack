/**
 * ============================================================================
 * ORUS BUILDER - PROJECT CARD COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:19:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:19:00-03:00
 * COMPONENT_HASH: orus.frontend.component.projectcard.20251009.PRC8D9E0
 * 
 * PURPOSE:
 * - Display project information in card format
 * - Quick actions (edit, delete, duplicate)
 * - Visual status indicators
 * - Framework and language badges
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: ProjectVisualizationAgent
 * - COGNITIVE_LEVEL: Basic
 * - AUTONOMY_DEGREE: 65
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  FolderOpen,
  Code,
  Calendar,
} from 'lucide-react';
import { Project } from '@/types/api.types';
import { Dropdown, DropdownOption } from '@components/common/Dropdown';
import { Modal } from '@components/common/Modal';
import { Button } from '@components/common/Button';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES
// ============================================================================

export interface ProjectCardProps {
  /**
   * Project data
   */
  project: Project;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Edit handler
   */
  onEdit?: (project: Project) => void;

  /**
   * Delete handler
   */
  onDelete?: (projectId: string) => void;

  /**
   * Duplicate handler
   */
  onDuplicate?: (project: Project) => void;
}

// ============================================================================
// FRAMEWORK ICONS & COLORS
// ============================================================================

const FRAMEWORK_CONFIG = {
  react: {
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    label: 'React',
  },
  vue: {
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    label: 'Vue',
  },
  angular: {
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    label: 'Angular',
  },
  nextjs: {
    color: 'text-white',
    bg: 'bg-white/10',
    label: 'Next.js',
  },
};

const LANGUAGE_CONFIG = {
  typescript: {
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    label: 'TypeScript',
  },
  javascript: {
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    label: 'JavaScript',
  },
};

const STATUS_CONFIG = {
  active: {
    color: 'text-accent',
    bg: 'bg-accent/10',
    label: 'Active',
  },
  archived: {
    color: 'text-foreground-muted',
    bg: 'bg-foreground-muted/10',
    label: 'Archived',
  },
  draft: {
    color: 'text-primary',
    bg: 'bg-primary/10',
    label: 'Draft',
  },
};

// ============================================================================
// PROJECT CARD COMPONENT
// ============================================================================

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const frameworkConfig = FRAMEWORK_CONFIG[project.framework] || FRAMEWORK_CONFIG.react;
  const languageConfig = LANGUAGE_CONFIG[project.language] || LANGUAGE_CONFIG.typescript;
  const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.draft;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(project);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(project.id);
      toast.success(`Project "${project.name}" deleted`);
    }
    setShowDeleteModal(false);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDuplicate) {
      onDuplicate(project);
      toast.success(`Project "${project.name}" duplicated`);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
        className={clsx(
          'relative group',
          'p-6 rounded-lg',
          'bg-background-surface border border-primary/20',
          'hover:border-primary/60 hover:shadow-elevated',
          'transition-all duration-200',
          'cursor-pointer'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground truncate mb-1">
              {project.name}
            </h3>
            {project.description && (
              <p className="text-sm text-foreground-muted line-clamp-2">
                {project.description}
              </p>
            )}
          </div>

          {/* Actions Menu */}
          <div className="relative ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActionsMenu(!showActionsMenu);
              }}
              className="p-2 rounded-lg hover:bg-background-elevated transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Project actions"
            >
              <MoreVertical className="w-5 h-5 text-foreground-muted" />
            </button>

            {/* Actions Dropdown */}
            {showActionsMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 rounded-lg bg-background-surface border border-primary/20 shadow-elevated overflow-hidden z-10"
                onMouseLeave={() => setShowActionsMenu(false)}
              >
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-background-elevated transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>

                <button
                  onClick={handleDuplicate}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-background-elevated transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>

                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="
