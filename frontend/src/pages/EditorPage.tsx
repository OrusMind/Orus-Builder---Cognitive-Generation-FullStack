/**
 * ============================================================================
 * ORUS BUILDER - EDITOR PAGE (FIXED)
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  Save,
  Play,
  Download,
  Menu,
} from 'lucide-react';
import { Navigation } from '@components/layout/Navigation';
import { CodeEditor } from '@components/editor/CodeEditor';
import { FileTree } from '@components/editor/FileTree';
import { Terminal } from '@components/editor/Terminal';
import { PreviewPane } from '@components/editor/PreviewPane';
import { Button } from '@components/common/Button';
import { useProjectStore } from '@store/project.store';
import { FileNode } from '@/types/api.types';
import toast from 'react-hot-toast';
import type { FileAction } from '@components/editor/FileTree';

// ============================================================================
// TYPES
// ============================================================================

interface OpenFile extends FileNode {
  content: string;
}

// ============================================================================
// EDITOR PAGE COMPONENT
// ============================================================================

export const EditorPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // Local state for editor
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [showFileTree, setShowFileTree] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { projects, isLoading } = useProjectStore();

  // Get current project
  const project = projects.find((p) => p.id === projectId);

  // Mock file tree data
  const [fileTree] = useState<FileNode[]>([
    {
      id: '1',
      name: 'src',
      path: '/src',
      type: 'folder',
      children: [
        {
          id: '2',
          name: 'App.tsx',
          path: '/src/App.tsx',
          type: 'file',
          content: `import React from 'react';\n\nfunction App() {\n  return (\n    <div className="App">\n      <h1>Hello ORUS!</h1>\n    </div>\n  );\n}\n\nexport default App;`,
        },
        {
          id: '3',
          name: 'index.tsx',
          path: '/src/index.tsx',
          type: 'file',
          content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);`,
        },
        {
          id: '4',
          name: 'components',
          path: '/src/components',
          type: 'folder',
          children: [
            {
              id: '5',
              name: 'Header.tsx',
              path: '/src/components/Header.tsx',
              type: 'file',
              content: `import React from 'react';\n\nexport const Header = () => {\n  return <header>Header Component</header>;\n};`,
            },
          ],
        },
      ],
    },
    {
      id: '6',
      name: 'package.json',
      path: '/package.json',
      type: 'file',
      content: `{\n  "name": "orus-project",\n  "version": "1.0.0",\n  "type": "module"\n}`,
    },
  ]);

  useEffect(() => {
    if (!project) {
      toast.error('Project not found');
      navigate('/projects');
    }
  }, [project, navigate]);

  // Handle file selection
  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file' && file.content) {
      const openFile: OpenFile = {
        ...file,
        content: file.content,
      };

      // Check if file is already open
      const existingFile = openFiles.find((f) => f.id === file.id);
      if (!existingFile) {
        setOpenFiles([...openFiles, openFile]);
      }
      setActiveFileId(file.id);
    }
  };

  // Handle file content change
  const handleFileChange = (content: string) => {
    if (activeFileId) {
      setOpenFiles(
        openFiles.map((f) =>
          f.id === activeFileId ? { ...f, content } : f
        )
      );
    }
  };

  // Handle file save
  const handleFileSave = async (content: string) => {
    if (!activeFileId) return;

    setIsSaving(true);
    try {
      // TODO: Implement actual save to backend
      setOpenFiles(
        openFiles.map((f) =>
          f.id === activeFileId ? { ...f, content } : f
        )
      );
      toast.success('File saved successfully');
    } catch (error) {
      toast.error('Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle file context menu actions
  const handleFileContextMenu = (file: FileNode, action: FileAction) => {
    console.log('Context menu action:', action, 'on file:', file.name);
    
    // Implementar ações conforme necessário
    switch (action) {
      case 'rename':
        toast.success(`Rename ${file.name}`);
        break;
      case 'delete':
        toast.success(`Delete ${file.name}`);
        break;
      case 'duplicate':
        toast.success(`Duplicate ${file.name}`);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Get active file
  const activeFile = openFiles.find((f: OpenFile) => f.id === activeFileId);

  // Get preview content
  const getPreviewContent = () => {
    const htmlFile = openFiles.find((f: OpenFile) => f.name.endsWith('.html'));
    const cssFile = openFiles.find((f: OpenFile) => f.name.endsWith('.css'));
    const jsFile = openFiles.find((f: OpenFile) => f.name.endsWith('.js') || f.name.endsWith('.jsx'));

    return {
      html: htmlFile?.content || activeFile?.content || '',
      css: cssFile?.content || '',
      javascript: jsFile?.content || '',
    };
  };

  const previewContent = getPreviewContent();

  if (isLoading) {
    return (
      <Navigation>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-foreground-muted">Loading editor...</div>
        </div>
      </Navigation>
    );
  }

  return (
    <Navigation showSidebar={false} showFooter={false}>
      <div className="h-screen flex flex-col bg-background">
        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-background-surface border-b border-primary/20">
          {/* Left - Project Info */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFileTree(!showFileTree)}
              className="p-2 rounded-lg hover:bg-background-elevated transition-colors"
              aria-label="Toggle file tree"
            >
              <Menu className="w-5 h-5 text-foreground-muted" />
            </button>

            <div>
              <h1 className="text-lg font-bold text-foreground">{project?.name}</h1>
              <p className="text-xs text-foreground-muted">{project?.framework} • {project?.language}</p>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleFileSave(activeFile?.content || '')}
              disabled={isSaving || !activeFile}
              size="sm"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save
            </Button>

            <Button
              onClick={() => toast('Run project (coming soon)', { icon: 'ℹ️' })}
              variant="secondary"
              size="sm"
              leftIcon={<Play className="w-4 h-4" />}
            >
              Run
            </Button>

            <Button
              onClick={() => toast('Download project (coming soon)', { icon: 'ℹ️' })}
              variant="ghost"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Editor Layout */}
        <div className="flex-1 overflow-hidden flex">
          {/* File Tree Pane */}
          {showFileTree && (
            <div className="w-64 h-full border-r border-primary/20 overflow-hidden">
              <FileTree
                files={fileTree}
                selectedFileId={activeFileId ?? undefined} // ✅ CORREÇÃO AQUI
                onFileSelect={handleFileSelect}
                onFileContextMenu={handleFileContextMenu}
              />
            </div>
          )}

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col">
            {/* Code Editor */}
            <div className="flex-1 overflow-hidden">
              {activeFile ? (
                <CodeEditor
                  value={activeFile.content}
                  language={
                    activeFile.name.endsWith('.ts') || activeFile.name.endsWith('.tsx')
                      ? 'typescript'
                      : activeFile.name.endsWith('.js') || activeFile.name.endsWith('.jsx')
                      ? 'javascript'
                      : activeFile.name.endsWith('.json')
                      ? 'json'
                      : activeFile.name.endsWith('.css')
                      ? 'css'
                      : activeFile.name.endsWith('.html')
                      ? 'html'
                      : 'plaintext'
                  }
                  onChange={handleFileChange}
                  onSave={handleFileSave}
                  height="100%"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-foreground-muted">
                  Select a file to start editing
                </div>
              )}
            </div>

            {/* Preview or Terminal */}
            {showPreview && (
              <div className="h-80 border-t border-primary/20 overflow-hidden">
                <PreviewPane
                  html={previewContent.html}
                  css={previewContent.css}
                  javascript={previewContent.javascript}
                  hotReload={true}
                />
              </div>
            )}

            {showTerminal && !showPreview && (
              <div className="h-80 border-t border-primary/20 overflow-hidden">
                <Terminal
                  cwd={`/projects/${projectId}`}
                  onClose={() => setShowTerminal(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar - Terminal Toggle */}
        <div className="flex items-center justify-between px-4 py-2 bg-background-surface border-t border-primary/20">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowTerminal(!showTerminal);
                if (showTerminal) setShowPreview(true);
              }}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                showTerminal
                  ? 'bg-primary text-background'
                  : 'text-foreground-muted hover:bg-background-elevated'
              )}
            >
              Terminal
            </button>

            <button
              onClick={() => {
                setShowPreview(!showPreview);
                if (showPreview) setShowTerminal(true);
              }}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                showPreview
                  ? 'bg-primary text-background'
                  : 'text-foreground-muted hover:bg-background-elevated'
              )}
            >
              Preview
            </button>
          </div>

          <div className="text-xs text-foreground-muted">
            {activeFile && `${activeFile.path} • ${activeFile.content?.length || 0} characters`}
          </div>
        </div>
      </div>
    </Navigation>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: EditorPage (Full editor page)
 * NAMED_EXPORTS: None
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
