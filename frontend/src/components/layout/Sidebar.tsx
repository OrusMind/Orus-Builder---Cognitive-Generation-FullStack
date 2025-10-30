/**
 * ============================================================================
 * ORUS BUILDER - SIDEBAR COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:05:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:05:00-03:00
 * COMPONENT_HASH: orus.frontend.component.sidebar.20251009.SDB8S9T0
 * 
 * PURPOSE:
 * - Collapsible sidebar navigation
 * - Icon-based navigation with tooltips
 * - Active state indication
 * - Responsive behavior
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: NavigationSidebarAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 72
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  FolderKanban,
  FileCode,
  Users,
  Cloud,
  Store,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Tooltip } from '@components/common/Tooltip';

// ============================================================================
// TYPES
// ============================================================================

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
}

// ============================================================================
// NAVIGATION ITEMS
// ============================================================================

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/dashboard',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <FolderKanban className="w-5 h-5" />,
    path: '/projects',
  },
  {
    id: 'editor',
    label: 'Code Editor',
    icon: <FileCode className="w-5 h-5" />,
    path: '/editor',
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    icon: <Users className="w-5 h-5" />,
    path: '/collaboration',
    badge: '3',
  },
  {
    id: 'deployment',
    label: 'Deployment',
    icon: <Cloud className="w-5 h-5" />,
    path: '/deployment',
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: <Store className="w-5 h-5" />,
    path: '/marketplace',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    path: '/settings',
  },
];

// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.aside
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      transition={{ duration: 0.3 }}
      className="h-screen sticky top-0 bg-background-surface border-r border-primary/20 flex flex-col"
    >
      {/* Collapse Toggle */}
      <div className="p-4 flex justify-end">
        <button
          onClick={toggleCollapse}
          className="p-2 rounded-lg hover:bg-background-elevated transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-foreground-muted" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-foreground-muted" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.path);

          const linkContent = (
            <Link
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                'hover:bg-background-elevated',
                active && 'bg-primary/10 border border-primary/30',
                !isCollapsed && 'justify-start',
                isCollapsed && 'justify-center'
              )}
            >
              <span
                className={clsx(
                  'transition-colors',
                  active ? 'text-primary' : 'text-foreground-muted'
                )}
              >
                {item.icon}
              </span>

              {!isCollapsed && (
                <>
                  <span
                    className={clsx(
                      'text-sm font-medium transition-colors',
                      active ? 'text-foreground' : 'text-foreground-muted'
                    )}
                  >
                    {item.label}
                  </span>

                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-accent text-background rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );

          // Wrap with Tooltip when collapsed
          if (isCollapsed) {
            return (
              <Tooltip key={item.id} content={item.label} position="right">
                {linkContent}
              </Tooltip>
            );
          }

          return <div key={item.id}>{linkContent}</div>;
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-primary/20">
          <div className="text-xs text-foreground-muted text-center">
            <p>ORUS Builder v1.0.0</p>
            <p className="text-primary">Powered by Trinity AI</p>
          </div>
        </div>
      )}
    </motion.aside>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: Sidebar (Collapsible navigation sidebar)
 * NAMED_EXPORTS: None
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
