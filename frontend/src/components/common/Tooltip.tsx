/**
 * ============================================================================
 * ORUS BUILDER - TOOLTIP COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:01:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:01:00-03:00
 * COMPONENT_HASH: orus.frontend.component.tooltip.20251009.TTP4O5P6
 * 
 * PURPOSE:
 * - Accessible tooltip component with ORUS design
 * - Multiple positioning options
 * - Hover and focus triggers
 * - Smooth animations
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: ContextualHelpAgent
 * - COGNITIVE_LEVEL: Basic
 * - AUTONOMY_DEGREE: 70
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface TooltipProps {
  /**
   * Tooltip content
   */
  content: React.ReactNode;

  /**
   * Tooltip position
   * @default 'top'
   */
  position?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * Delay before showing (ms)
   * @default 200
   */
  delay?: number;

  /**
   * Children element to attach tooltip
   */
  children: React.ReactElement;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
}

// ============================================================================
// POSITION STYLES
// ============================================================================

const positionStyles = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowStyles = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-background-elevated',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-background-elevated',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-background-elevated',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-background-elevated',
};

// ============================================================================
// TOOLTIP COMPONENT
// ============================================================================

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  delay = 200,
  disabled = false,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {/* Trigger Element */}
      {children}

      {/* Tooltip */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={clsx(
              'absolute z-50 pointer-events-none',
              positionStyles[position]
            )}
            role="tooltip"
          >
            <div className="relative">
              {/* Tooltip Content */}
              <div className="bg-background-elevated border border-primary/20 rounded-lg px-3 py-2 shadow-elevated max-w-xs">
                <div className="text-sm text-foreground whitespace-nowrap">
                  {content}
                </div>
              </div>

              {/* Arrow */}
              <div
                className={clsx(
                  'absolute w-0 h-0',
                  'border-4 border-transparent',
                  arrowStyles[position]
                )}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: Tooltip (Accessible tooltip component)
 * NAMED_EXPORTS: TooltipProps
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
