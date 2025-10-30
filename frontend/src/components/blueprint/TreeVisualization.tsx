/**
 * ============================================================================
 * ORUS BUILDER - TREE VISUALIZATION COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T09:00:00-03:00
 * LAST_MODIFIED: 2025-10-10T09:00:00-03:00
 * COMPONENT_HASH: orus.frontend.component.treevisual.20251010.TRE8N9O0
 * 
 * PURPOSE:
 * - Auto-generated file tree visualization
 * - Interactive tree from blueprint
 * - Export and download tree
 * - Visual project structure preview
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: TreeVisualizationAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 70
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
  Folder,
  FolderOpen,
  File,
  FileCode,
  FileJson,
  FileText,
  Download,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@components/common/Button';
import { Tooltip } from '@components/common/Tooltip';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface TreeVisualizationProps {
  /**
   * Tree structure
   */
  structure: TreeNode[];

  /**
   * Show file count
   * @default true
   */
  showCount?: boolean;

  /**
   * Enable export
   * @default true
   */
  enableExport?: boolean;
}

export interface TreeNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
}

// ============================================================================
// TREE VISUALIZATION COMPONENT
// ============================================================================

export const TreeVisualization: React.FC<TreeVisualizationProps> = ({
  structure,
  showCount = true,
  enableExport = true,
}) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['/']));
  const [copied, setCopied] = useState(false);

  const togglePath = (path: string) => {
    setExpandedPaths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const isExpanded = (path: string) => expandedPaths.has(path);

  const countFiles = (nodes: TreeNode[]): { files: number; folders: number } => {
    let files = 0;
    let folders = 0;

    const count = (node: TreeNode) => {
      if (node.type === 'file') {
        files++;
      } else {
        folders++;
        if (node.children) {
          node.children.forEach(count);
        }
      }
    };

    nodes.forEach(count);
    return { files, folders };
  };

  const generateTreeText = (nodes: TreeNode[], prefix = ''): string => {
    let text = '';

    nodes.forEach((node, index) => {
      const isLast = index === nodes.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const icon = node.type === 'folder' ? '📁' : '📄';

      text += `${prefix}${connector}${icon} ${node.name}\n`;

      if (node.type === 'folder' && node.children) {
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        text += generateTreeText(node.children, newPrefix);
      }
    });

    return text;
  };

  const handleCopy = async () => {
    const treeText = generateTreeText(structure);
    try {
      await navigator.clipboard.writeText(treeText);
      setCopied(true);
      toast.success('Tree copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy tree');
    }
  };

  const handleDownload = () => {
    const treeText = generateTreeText(structure);
    const blob = new Blob([treeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-structure.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Tree downloaded');
  };

  const counts = countFiles(structure);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">Project Structure</h3>
          {showCount && (
            <p className="text-sm text-foreground-muted">
              {counts.folders} folders • {counts.files} files
            </p>
          )}
        </div>

        {enableExport && (
          <div className="flex items-center gap-2">
            <Tooltip content="Copy tree">
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-background-elevated transition-colors"
                aria-label="Copy"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-accent" />
                ) : (
                  <Copy className="w-5 h-5 text-foreground-muted" />
                )}
              </button>
            </Tooltip>

            <Tooltip content="Download tree">
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg hover:bg-background-elevated transition-colors"
                aria-label="Download"
              >
                <Download className="w-5 h-5 text-foreground-muted" />
              </button>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Tree */}
      <div className="p-4 rounded-lg bg-background-surface border border-primary/20 font-mono text-sm">
        {structure.map((node) => (
          <TreeNodeComponent
            key={node.path}
            node={node}
            level={0}
            isExpanded={isExpanded(node.path)}
            onToggle={() => togglePath(node.path)}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// TREE NODE COMPONENT
// ============================================================================

interface TreeNodeComponentProps {
  node: TreeNode;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const TreeNodeComponent: React.FC<TreeNodeComponentProps> = ({
  node,
  level,
  isExpanded,
  onToggle,
}) => {
  const isFolder = node.type === 'folder';
  const hasChildren = isFolder && node.children && node.children.length > 0;

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();

    switch (ext) {
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
      default:
        return <File className="w-4 h-4 text-foreground-muted" />;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={clsx(
          'flex items-center gap-2 py-1 hover:bg-background-elevated rounded transition-colors',
          'cursor-pointer'
        )}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={isFolder ? onToggle : undefined}
      >
        {/* Expand/Collapse */}
        {hasChildren && (
          <span className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-foreground-muted" />
            ) : (
              <ChevronRight className="w-4 h-4 text-foreground-muted" />
            )}
          </span>
        )}

        {!hasChildren && isFolder && <span className="w-4" />}

        {/* Icon */}
        <span className="flex-shrink-0">
          {isFolder ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-primary" />
            ) : (
              <Folder className="w-4 h-4 text-primary" />
            )
          ) : (
            getFileIcon(node.name)
          )}
        </span>

        {/* Name */}
        <span className={clsx('text-foreground', isFolder && 'font-medium')}>
          {node.name}
        </span>
      </motion.div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {node.children!.map((child) => (
            <TreeNodeComponent
              key={child.path}
              node={child}
              level={level + 1}
              isExpanded={false}
              onToggle={() => {}}
            />
          ))}
        </motion.div>
      )}
    </>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: TreeVisualization (File tree visualization)
 * NAMED_EXPORTS: TreeVisualizationProps, TreeNode
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
