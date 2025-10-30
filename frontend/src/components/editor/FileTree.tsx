/**
 * ============================================================================
 * ORUS BUILDER - FILE TREE COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T08:46:00-03:00
 * LAST_MODIFIED: 2025-10-10T08:46:00-03:00
 * COMPONENT_HASH: orus.frontend.component.filetree.20251010.FTR2H3I4
 * 
 * PURPOSE:
 * - Recursive file tree viewer
 * - Drag-and-drop file organization
 * - Context menu for file operations
 * - Search and filter files
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: FileSystemVisualizationAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 75
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  FileCode,
  FileJson,
  FileText,
  Image,
  Settings,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Plus,
  Search,
} from 'lucide-react';
import { FileNode } from '@/types/api.types';
import { Input } from '@components/common/Input';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface FileTreeProps {
  /**
   * Root file nodes
   */
  files: FileNode[];

  /**
   * Selected file ID
   */
  selectedFileId?: string;

  /**
   * File selection callback
   */
  onFileSelect?: (file: FileNode) => void;

  /**
   * File context menu callback
   */
  onFileContextMenu?: (file: FileNode, action: FileAction) => void;

  /**
   * Enable search
   * @default true
   */
  enableSearch?: boolean;

  /**
   * Enable drag and drop
   * @default true
   */
  enableDragDrop?: boolean;
}

export type FileAction = 'rename' | 'delete' | 'duplicate' | 'new-file' | 'new-folder';

// ============================================================================
// FILE ICON MAPPING
// ============================================================================

const getFileIcon = (file: FileNode): React.ReactNode => {
  if (file.type === 'folder') {
    return <Folder className="w-4 h-4" />;
  }

  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
      return <FileCode className="w-4 h-4 text-cyan-400" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-yellow-400" />;
    case 'md':
    case 'txt':
      return <FileText className="w-4 h-4 text-foreground-muted" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
    case 'gif':
      return <Image className="w-4 h-4 text-purple-400" />;
    case 'css':
    case 'scss':
    case 'sass':
      return <FileCode className="w-4 h-4 text-pink-400" />;
    case 'html':
      return <FileCode className="w-4 h-4 text-orange-400" />;
    default:
      return <File className="w-4 h-4 text-foreground-muted" />;
  }
};

// ============================================================================
// FILE TREE COMPONENT
// ============================================================================

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  selectedFileId,
  onFileSelect,
  onFileContextMenu,
  enableSearch = true,
  enableDragDrop = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Filter files by search query
  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files;

    const filterNode = (node: FileNode): FileNode | null => {
      const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase());

      if (node.type === 'file') {
        return matchesSearch ? node : null;
      }

      // For folders, include if any children match
      const filteredChildren = node.children
        ?.map(filterNode)
        .filter(Boolean) as FileNode[];

      if (matchesSearch || (filteredChildren && filteredChildren.length > 0)) {
        return {
          ...node,
          children: filteredChildren,
        };
      }

      return null;
    };

    return files.map(filterNode).filter(Boolean) as FileNode[];
  }, [files, searchQuery]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-col h-full bg-background-surface border-r border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20">
        <h3 className="text-sm font-semibold text-foreground">Files</h3>
        <button
          onClick={() => onFileContextMenu?.({ id: 'root', name: 'root', path: '/', type: 'folder' }, 'new-file')}
          className="p-1.5 rounded-lg hover:bg-background-elevated transition-colors"
          aria-label="New file"
        >
          <Plus className="w-4 h-4 text-foreground-muted" />
        </button>
      </div>

      {/* Search */}
      {enableSearch && (
        <div className="px-3 py-2">
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            size="sm"
            fullWidth
          />
        </div>
      )}

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {filteredFiles.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-foreground-muted">
            {searchQuery ? 'No files found' : 'No files yet'}
          </div>
        ) : (
          <div className="space-y-0.5">
            {filteredFiles.map((file) => (
              <FileTreeNode
                key={file.id}
                file={file}
                level={0}
                selectedFileId={selectedFileId}
                expandedFolders={expandedFolders}
                onToggleFolder={toggleFolder}
                onFileSelect={onFileSelect}
                onFileContextMenu={onFileContextMenu}
                enableDragDrop={enableDragDrop}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// FILE TREE NODE COMPONENT
// ============================================================================

interface FileTreeNodeProps {
  file: FileNode;
  level: number;
  selectedFileId?: string;
  expandedFolders: Set<string>;
  onToggleFolder: (folderId: string) => void;
  onFileSelect?: (file: FileNode) => void;
  onFileContextMenu?: (file: FileNode, action: FileAction) => void;
  enableDragDrop: boolean;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({
  file,
  level,
  selectedFileId,
  expandedFolders,
  onToggleFolder,
  onFileSelect,
  onFileContextMenu,
  enableDragDrop,
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const isFolder = file.type === 'folder';
  const isExpanded = expandedFolders.has(file.id);
  const isSelected = file.id === selectedFileId;

  const handleClick = () => {
    if (isFolder) {
      onToggleFolder(file.id);
    } else {
      onFileSelect?.(file);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, action: FileAction) => {
    e.stopPropagation();
    onFileContextMenu?.(file, action);
    setShowContextMenu(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative"
      >
        <button
          onClick={handleClick}
          className={clsx(
            'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors text-left',
            isSelected && 'bg-primary/20 text-primary',
            !isSelected && 'hover:bg-background-elevated text-foreground-muted hover:text-foreground'
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {/* Folder expand/collapse */}
          {isFolder && (
            <span className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}

          {/* File icon */}
          <span className="flex-shrink-0">{getFileIcon(file)}</span>

          {/* File name */}
          <span className="flex-1 truncate text-sm">{file.name}</span>

          {/* Context menu trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowContextMenu(!showContextMenu);
            }}
            className="flex-shrink-0 p-1 rounded hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-3 h-3" />
          </button>
        </button>

        {/* Context Menu */}
        <AnimatePresence>
          {showContextMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute left-full top-0 ml-2 w-48 bg-background-surface border border-primary/20 rounded-lg shadow-elevated overflow-hidden z-10"
              onMouseLeave={() => setShowContextMenu(false)}
            >
              <button
                onClick={(e) => handleContextMenu(e, 'rename')}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-background-elevated transition-colors"
              >
                <Edit className="w-4 h-4" />
                Rename
              </button>

              <button
                onClick={(e) => handleContextMenu(e, 'duplicate')}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-background-elevated transition-colors"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </button>

              <button
                onClick={(e) => handleContextMenu(e, 'delete')}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Children (recursive) */}
      <AnimatePresence>
        {isFolder && isExpanded && file.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {file.children.map((child) => (
              <FileTreeNode
                key={child.id}
                file={child}
                level={level + 1}
                selectedFileId={selectedFileId}
                expandedFolders={expandedFolders}
                onToggleFolder={onToggleFolder}
                onFileSelect={onFileSelect}
                onFileContextMenu={onFileContextMenu}
                enableDragDrop={enableDragDrop}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: FileTree (Recursive file tree component)
 * NAMED_EXPORTS: FileTreeProps, FileAction
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
