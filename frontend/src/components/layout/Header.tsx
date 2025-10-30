/**
 * ============================================================================
 * ORUS BUILDER - HEADER COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:05:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:05:00-03:00
 * COMPONENT_HASH: orus.frontend.component.header.20251009.HDR7R8S9
 * 
 * PURPOSE:
 * - Top header with ORUS branding and navigation
 * - User profile menu and notifications
 * - Theme switcher integration
 * - Responsive design
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: NavigationControlAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 75
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Sun, 
  Moon,
  Sparkles 
} from 'lucide-react';
import { useAuthStore } from '@store/auth.store';
import { Dropdown, DropdownOption } from '@components/common/Dropdown';
import { Tooltip } from '@components/common/Tooltip';

// ============================================================================
// HEADER COMPONENT
// ============================================================================

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('orus-theme', newTheme);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const userMenuOptions: DropdownOption[] = [
    {
      value: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
    },
    {
      value: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      value: 'logout',
      label: 'Logout',
      icon: <LogOut className="w-4 h-4" />,
    },
  ];

  const handleUserMenuChange = (value: string) => {
    if (value === 'logout') {
      handleLogout();
    } else if (value === 'profile') {
      window.location.href = '/profile';
    } else if (value === 'settings') {
      window.location.href = '/settings';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background-surface/80 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <motion.div
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-cognitive"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-6 h-6 text-background" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-cognitive bg-clip-text text-transparent">
              ORUS Builder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/projects"
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              Projects
            </Link>
            <Link
              to="/templates"
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              Templates
            </Link>
            <Link
              to="/docs"
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              Docs
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Tooltip content={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-background-elevated transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-foreground-muted" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground-muted" />
                )}
              </button>
            </Tooltip>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Tooltip content="Notifications">
                  <button
                    className="relative p-2 rounded-lg hover:bg-background-elevated transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 text-foreground-muted" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                  </button>
                </Tooltip>

                {/* User Menu */}
<div className="hidden md:block">
  {/* Avatar e Nome fora do Dropdown */}
  <div className="flex items-center gap-3">
    {/* Avatar Visual */}
    <div className="w-8 h-8 rounded-full bg-gradient-cognitive flex items-center justify-center">
      <span className="text-sm font-semibold text-background">
        {user?.name.charAt(0).toUpperCase()}
      </span>
    </div>
    
    {/* Dropdown com nome do usuário */}
    <Dropdown
      options={userMenuOptions}
      onChange={handleUserMenuChange}
      placeholder={user?.name || 'User'} // ✅ String simples
    />
  </div>
</div>
</>
) : (
  <div className="hidden md:flex items-center gap-3">
    <Link
      to="/login"
      className="text-foreground-muted hover:text-foreground transition-colors"
    >
      Login
    </Link>
    <Link
      to="/register"
      className="px-4 py-2 bg-gradient-cognitive text-background rounded-lg hover:shadow-glow-cyan transition-shadow"
    >
      Get Started
    </Link>
  </div>
)}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-background-elevated transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-primary/20"
          >
            <nav className="flex flex-col gap-3">
              <Link
                to="/dashboard"
                className="px-4 py-2 text-foreground-muted hover:text-foreground hover:bg-background-elevated rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/projects"
                className="px-4 py-2 text-foreground-muted hover:text-foreground hover:bg-background-elevated rounded-lg transition-colors"
              >
                Projects
              </Link>
              <Link
                to="/templates"
                className="px-4 py-2 text-foreground-muted hover:text-foreground hover:bg-background-elevated rounded-lg transition-colors"
              >
                Templates
              </Link>
              <Link
                to="/docs"
                className="px-4 py-2 text-foreground-muted hover:text-foreground hover:bg-background-elevated rounded-lg transition-colors"
              >
                Docs
              </Link>

              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-foreground-muted hover:text-foreground hover:bg-background-elevated rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-cognitive text-background rounded-lg text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: Header (Top navigation header)
 * NAMED_EXPORTS: None
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
