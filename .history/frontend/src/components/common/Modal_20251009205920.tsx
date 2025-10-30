/**
 * ============================================================================
 * ORUS BUILDER - MODAL COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:01:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:01:00-03:00
 * COMPONENT_HASH: orus.frontend.component.modal.20251009.MOD3N4O5
 * 
 * PURPOSE:
 * - Accessible modal dialog component with ORUS design
 * - Overlay backdrop with click-outside to close
 * - Focus trap and keyboard navigation (Esc to close)
 * - Animation with framer-motion
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: OverlayUIAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 75
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ModalProps {
  /**
   * Modal open state
   */
  isOpen: boolean;

  /**
   * Close handler
   */
  onClose: () => void;

  /**
   * Modal title
   */
  title?: string;

  /**
   * Modal size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * Close on overlay click
   * @default true
   */
  closeOnOverlayClick?: boolean;

  /**
   * Close on Escape key
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Show close button
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Children content
   */
  children: React.ReactNode;

  /**
   * Footer content
   */
  footer?: React.ReactNode;
}

// ============================================================================
// SIZE STYLES
// ============================================================================

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl mx-4',
};

// ============================================================================
// MODAL COMPONENT
// ============================================================================

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  footer,
}) => {
  // Handle Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={clsx(
                'relative w-full pointer-events-auto',
                'bg-background-surface',
                'border border-primary/20',
                'rounded-lg shadow-elevated',
                'flex flex-col max-h-[90vh]',
                sizeStyles[size]
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-primary/20">
                  {title && (
                    <h2
                      id="modal-title"
                      className="text-xl font-bold text-foreground"
                    >
                      {title}
                    </h2>
                  )}

                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="ml-auto p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-elevated transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="px-6 py-4 border-t border-primary/20 bg-background-elevated">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: Modal (Accessible modal dialog)
 * NAMED_EXPORTS: ModalProps
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
