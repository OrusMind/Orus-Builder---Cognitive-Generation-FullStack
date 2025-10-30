/**
 * ============================================================================
 * ORUS BUILDER - NAVIGATION COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:05:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:05:00-03:00
 * COMPONENT_HASH: orus.frontend.component.navigation.20251009.NAV0U1V2
 * 
 * PURPOSE:
 * - Reusable navigation wrapper component
 * - Combines Header, Sidebar, and Footer
 * - Provides main layout structure
 * - Handles responsive behavior
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: LayoutOrchestratorAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 80
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface NavigationProps {
  /**
   * Show sidebar
   * @default true
   */
  showSidebar?: boolean;

  /**
   * Show footer
   * @default true
   */
  showFooter?: boolean;

  /**
   * Children content
   */
  children: React.ReactNode;
}

// ============================================================================
// NAVIGATION COMPONENT
// ============================================================================

export const Navigation: React.FC<NavigationProps> = ({
  showSidebar = true,
  showFooter = true,
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>

          {/* Footer */}
          {showFooter && <Footer />}
        </main>
      </div>
    </div>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: Navigation (Layout wrapper with Header/Sidebar/Footer)
 * NAMED_EXPORTS: NavigationProps
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
