/**
 * ============================================================================
 * ORUS BUILDER - APP ROOT WITH ROUTING
 * ============================================================================
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Pages
import { HomePage } from '@/pages/HomePage';
import { GeneratePage } from '@/pages/GeneratePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { EditorPage } from '@/pages/EditorPage';
import { ProjectPage } from '@/pages/ProjectPage';
import { BlueprintUploadPage } from '@/pages/BlueprintUploadPage';
import { CollaborationPage } from '@/pages/CollaborationPage';
import { DeploymentPage } from '@/pages/DeploymentPage';
import { MarketplacePage } from '@/pages/MarketplacePage';
import { SettingsPage } from '@/pages/SettingsPage';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// ============================================================================
// APP COMPONENT
// ============================================================================

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/generate" element={<GeneratePage />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Project Routes */}
          <Route path="/projects" element={<DashboardPage />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
          <Route path="/projects/:projectId/editor" element={<EditorPage />} />
          
          {/* Blueprint Routes */}
          <Route path="/blueprint/upload" element={<BlueprintUploadPage />} />
          
          {/* Collaboration Routes */}
          <Route path="/collaborate/:projectId" element={<CollaborationPage />} />
          
          {/* Deployment Routes */}
          <Route path="/deploy/:projectId" element={<DeploymentPage />} />
          
          {/* Marketplace Routes */}
          <Route path="/marketplace" element={<MarketplacePage />} />
          
          {/* Settings Routes */}
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast Notifications */}
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
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
