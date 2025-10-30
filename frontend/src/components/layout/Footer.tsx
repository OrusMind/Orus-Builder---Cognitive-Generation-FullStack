/**
 * ============================================================================
 * ORUS BUILDER - FOOTER COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:05:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:05:00-03:00
 * COMPONENT_HASH: orus.frontend.component.footer.20251009.FTR9T0U1
 * 
 * PURPOSE:
 * - Application footer with links and branding
 * - Social media links
 * - Copyright and version info
 * - Responsive layout
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: InformationDisplayAgent
 * - COGNITIVE_LEVEL: Basic
 * - AUTONOMY_DEGREE: 60
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Sparkles } from 'lucide-react';

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-surface border-t border-primary/20 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-cognitive">
                <Sparkles className="w-5 h-5 text-background" />
              </div>
              <span className="text-lg font-bold bg-gradient-cognitive bg-clip-text text-transparent">
                ORUS Builder
              </span>
            </div>
            <p className="text-sm text-foreground-muted">
              AI-Powered cognitive code generation platform. Build production-ready apps in seconds.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/templates" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/integrations" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/docs" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-foreground-muted">
            © {currentYear} ORUS Builder. All rights reserved. v1.0.0
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/orus-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/orusbuilder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/company/orus-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:contact@orusbuilder.com"
              className="text-foreground-muted hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: Footer (Application footer)
 * NAMED_EXPORTS: None
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
