/**
 * ============================================================================
 * ORUS BUILDER - PROGRESS COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T09:06:00-03:00
 * LAST_MODIFIED: 2025-10-10T09:06:00-03:00
 * COMPONENT_HASH: orus.frontend.component.progress.20251010.PRG1Q2R3
 * 
 * PURPOSE:
 * - Progress bar component
 * - Linear and circular variants
 * - Animated transitions
 * - Customizable colors and sizes
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: ProgressVisualizationAgent
 * - COGNITIVE_LEVEL: Basic
 * - AUTONOMY_DEGREE: 60
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ProgressProps {
  /**
   * Progress value (0-100)
   */
  value: number;

  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Color variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'accent' | 'gradient';

  /**
   * Show percentage label
   * @default false
   */
  showLabel?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Animated
   * @default true
   */
  animated?: boolean;
}

// ============================================================================
// SIZE STYLES
// ============================================================================

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

// ============================================================================
// VARIANT STYLES
// ============================================================================

const variantStyles = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  gradient: 'bg-gradient-cognitive',
};

// ============================================================================
// PROGRESS COMPONENT
// ============================================================================

export const Progress: React.FC<ProgressProps> = ({
  value,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className,
  animated = true,
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-foreground-muted">Progress</span>
          <span className="text-sm font-medium text-foreground">{Math.round(clampedValue)}%</span>
        </div>
      )}

      <div
        className={clsx(
          'w-full bg-background-elevated rounded-full overflow-hidden',
          sizeStyles[size]
        )}
      >
        <motion.div
          className={clsx('h-full rounded-full', variantStyles[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={
            animated
              ? {
                  duration: 0.5,
                  ease: 'easeInOut',
                }
              : { duration: 0 }
          }
        />
      </div>
    </div>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: Progress (Progress bar component)
 * NAMED_EXPORTS: ProgressProps
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
