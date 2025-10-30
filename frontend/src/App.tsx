/**
 * ============================================================================
 * ORUS BUILDER - ROOT APP COMPONENT (UPDATED WITH GENERATE + THEME PROVIDER)
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T20:38:00-03:00
 * LAST_MODIFIED: 2025-10-30T18:08:00-03:00
 * COMPONENT_HASH: orus.frontend.app.root.20251030.APP9I0J1.V4
 * 
 * PURPOSE:
 * - Root application component with routing setup
 * - All pages accessible for testing
 * - ✅ THEME PROVIDER & LANGUAGE CONTEXT initialization
 * - Navigation structure
 * - ✅ ADDED: /generate route for generation page
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: ApplicationOrchestratorAgent
 * - COGNITIVE_LEVEL: Supreme
 * - AUTONOMY_DEGREE: 99
 * - TRINITY_INTEGRATED: All (Alma, Cerebro, Voz)
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// ✅ ADICIONAR: THEME PROVIDER
import { ThemeProvider } from './context/ThemeContext';

// ✅ PÁGINAS PRINCIPAIS
import { HomePage } from '@pages/HomePage';
import { GeneratePage } from '@pages/GeneratePage'; // ← NOVO!
import { DashboardPage } from '@pages/DashboardPage';
import { ProjectPage } from '@pages/ProjectPage';
import { EditorPage } from '@pages/EditorPage';
import { SettingsPage } from '@pages/SettingsPage';
import { PreviewPage } from './pages/PreviewPage';

// Components for testing
import { PromptInput } from '@components/generation/PromptInput';
import { GenerationProgress } from '@components/generation/GenerationProgress';
import { CodePreview } from '@components/generation/CodePreview';
import { BlueprintUploader } from '@/components/blueprint/BlueprintUploader';
import { BlueprintParser } from '@components/blueprint/BlueprintParser';
import { TreeVisualization } from '@components/blueprint/TreeVisualization';
// ✅ ADICIONE APÓS OS IMPORTS E ANTES DAS FUNÇÕES

// ============================================================================
// TYPES PARA TEST PAGES
// ============================================================================

interface PromptOptions {
  framework?: string;
  language?: string;
  includeTests?: boolean;
  style?: string;
}

interface GeneratedFile {
  path: string;
  fileName: string;
  language: string;
  content: string;
  lines: number;
 type: 'component' | 'style' | 'test' | 'config'; 
}

// ============================================================================

/**
 * Theme Management
 * Dark Cognitive theme by default, toggleable to Light Minimal
 */
type Theme = 'dark' | 'light';

/**
 * INNER APP COMPONENT
 * ✅ Dentro do ThemeProvider para ter acesso ao contexto
 */
const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize theme on mount
   */
  useEffect(() => {
    setIsLoading(false);
  }, []);

  /**
   * Loading state while initializing
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="text-4xl font-heading font-bold gradient-text">
            ORUS
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
            Initializing Cognitive Builder...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#f1f5f9',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f1f5f9',
            },
          },
        }}
      />

      {/* Main Application */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Routes */}
        <Routes>
          {/* ✅ ROTAS PRINCIPAIS */}

          {/* Landing Page */}
          <Route path="/" element={<HomePage />} />

          {/* ✅ NOVO: Generation Page */}
          <Route path="/generate" element={<GeneratePage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Projects */}
          <Route path="/projects" element={<DashboardPage />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
          <Route path="/preview" element={<PreviewPage />} />

          {/* Editor */}
          <Route path="/editor/:projectId" element={<EditorPage />} />
          <Route path="/editor" element={<EditorPage />} />

          {/* Settings */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* Component Testing Routes */}
          <Route path="/test/prompt" element={<TestPromptInput />} />
          <Route path="/test/progress" element={<TestGenerationProgress />} />
          <Route path="/test/preview" element={<TestCodePreview />} />
          <Route path="/test/blueprint" element={<TestBlueprint />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

/**
 * ROOT APP COMPONENT
 * ✅ ENVOLVIDO COM THEME PROVIDER
 */
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

// ============================================================================
// TEST PAGES FOR COMPONENTS
// ============================================================================

/**
 * Test page for PromptInput component
 */
const TestPromptInput: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4">Prompt Input Test</h1>
     <PromptInput
  onSubmit={(prompt: string, options: PromptOptions) => {
    console.log('Prompt:', prompt);
    console.log('Options:', options);
  }}
  isGenerating={false}
/>
      </div>
    </div>
  );
};

/**
 * Test page for GenerationProgress component
 */
const TestGenerationProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4">Generation Progress Test</h1>
        <GenerationProgress
          currentStage="components"
          stages={[
            { stage: 'analyzing', status: 'complete' },
            { stage: 'architecture', status: 'complete' },
            { stage: 'components', status: 'processing', message: 'Generating React components...' },
            { stage: 'styling', status: 'pending' },
            { stage: 'tests', status: 'pending' },
            { stage: 'optimization', status: 'pending' },
            { stage: 'validation', status: 'pending' },
          ]}
          progress={progress}
          estimatedTimeRemaining={30}
          metadata={{
            totalFiles: 25,
            totalLines: 1523,
            filesGenerated: 15,
            componentsCreated: 8,
            testsGenerated: 4,
          }}
          trinityStatus={{
            alma: 'active',
            cerebro: 'active',
            voz: 'idle',
          }}
        />
      </div>
    </div>
  );
};

const TestCodePreview: React.FC = () => {
  const sampleCode = `import React from 'react';\n\nfunction App() {\n  return (\n    <div className="App">\n      <h1>Hello ORUS!</h1>\n    </div>\n  );\n}\n\nexport default App;`;

  const testFiles: GeneratedFile[] = [
    {
      path: '/src/App.tsx',
      fileName: 'App.tsx',
      language: 'typescript',
      content: sampleCode,
      lines: 10,
       type: 'component',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4">Code Preview Test</h1>
        <div className="h-[600px]">
          <CodePreview files={testFiles} />
        </div>
      </div>
    </div>
  );
};


/**
 * Test page for Blueprint components
 */
const TestBlueprint: React.FC = () => {
  const [content, setContent] = useState('');
  const [showParser, setShowParser] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4">Blueprint Test</h1>

        {!showParser ? (
          <BlueprintUploader
            onUpload={(file, fileContent) => {
              setContent(fileContent);
              setShowParser(true);
            }}
          />
        ) : (
          <>
            <button
              onClick={() => setShowParser(false)}
              className="mb-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Upload
            </button>
            <BlueprintParser
              content={content}
              fileName="test-blueprint.md"
              onParseComplete={(result) => console.log('Parse complete:', result)}
            />
            <div className="mt-8">
              <TreeVisualization
                structure={[
                  {
                    name: 'src',
                    path: '/src',
                    type: 'folder',
                    children: [
                      { name: 'App.tsx', path: '/src/App.tsx', type: 'file' },
                      { name: 'index.tsx', path: '/src/index.tsx', type: 'file' },
                    ],
                  },
                ]}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: App (Root component with ThemeProvider wrapper)
 * NAMED_EXPORTS: None
 * DEFAULT_AVAILABLE: true
 * COMPATIBILITY: internal
 * STATUS: ✅ THEME PROVIDER INTEGRATED - READY FOR PRODUCTION
 * ============================================================================
 */
