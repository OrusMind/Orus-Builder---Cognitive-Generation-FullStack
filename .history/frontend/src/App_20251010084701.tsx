/**
 * ============================================================================
 * ORUS BUILDER - ROOT APP COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T20:38:00-03:00
 * LAST_MODIFIED: 2025-10-10T08:50:00-03:00
 * COMPONENT_HASH: orus.frontend.app.root.20251009.APP7H8I9
 * 
 * PURPOSE:
 * - Root application component with routing setup
 * - Theme provider and global state initialization
 * - Layout structure and navigation
 * - Authentication state management
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

// Pages
import { DashboardPage } from '@pages/DashboardPage';
import { GenerationPage } from '@pages/GenerationPage';
import { ProjectPage } from '@pages/ProjectPage';
import { ProjectListPage } from '@pages/ProjectListPage';

/**
 * Theme Management
 * Dark Cognitive theme by default, toggleable to Light Minimal
 */
type Theme = 'dark' | 'light';

function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize theme from localStorage or default to dark
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem('orus-theme') as Theme | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    setIsLoading(false);
  }, []);

  /**
   * Toggle theme handler
   */
  const toggleTheme = () => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('orus-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  /**
   * Loading state while initializing
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-cognitive">
          <div className="text-4xl font-bold bg-gradient-cognitive bg-clip-text text-transparent">
            ORUS
          </div>
          <div className="text-sm text-foreground-muted text-center mt-2">
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
            background: 'var(--background-surface)',
            color: 'var(--foreground)',
            border: '1px solid var(--primary)',
          },
          success: {
            iconTheme: {
              primary: 'var(--accent)',
              secondary: 'var(--background)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--error)',
              secondary: 'var(--background)',
            },
          },
        }}
      />

      {/* Main Application */}
      <div className="min-h-screen bg-background text-foreground">
        {/* Theme Toggle Button (Top Right) */}
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 z-50 p-3 bg-background-surface border border-primary/20 rounded-lg hover:border-primary/50 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Routes */}
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Generation */}
          <Route path="/generate" element={<GenerationPage />} />

          {/* Projects */}
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: App (Root component)
 * NAMED_EXPORTS: None
 * DEFAULT_AVAILABLE: true
 * COMPATIBILITY: internal
 * ============================================================================
 */
