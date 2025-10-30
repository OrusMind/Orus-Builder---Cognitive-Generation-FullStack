/**
 * ============================================================================
 * ORUS BUILDER - LOADING COMPONENT (PREMIUM SUBTLE)
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:05:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:05:00-03:00
 * COMPONENT_HASH: orus.frontend.component.loading.20251009.LOD6Q7R8
 * 
 * PURPOSE:
 * - Premium loading component with ORUS cognitive design
 * - Multiple variants (spinner, dots, pulse, skeleton)
 * - Smooth animations without cognitive fatigue
 * - Subtle and elegant visual feedback
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: FeedbackVisualizationAgent
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

export interface LoadingProps {
  /**
   * Loading variant
   * @default 'spinner'
   */
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'neural';

  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Color theme
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'accent' | 'white';

  /**
   * Loading message
   */
  message?: string;

  /**
   * Fullscreen overlay
   * @default false
   */
  fullscreen?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

// ============================================================================
// SIZE STYLES
// ============================================================================

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const dotSizes = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2.5 h-2.5',
  lg: 'w-3.5 h-3.5',
  xl: 'w-5 h-5',
};

// ============================================================================
// COLOR STYLES
// ============================================================================

const colorStyles = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  white: 'text-white',
};

const glowStyles = {
  primary: 'shadow-glow-cyan',
  secondary: 'shadow-glow-indigo',
  accent: 'shadow-glow-green',
  white: 'shadow-white',
};

// ============================================================================
// LOADING VARIANTS
// ============================================================================

/**
 * Spinner Variant - Classic rotating spinner
 */
const SpinnerLoading: React.FC<{ size: string; color: string }> = ({ size, color }) => (
  <svg
    className={clsx('animate-spin', size, color)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/**
 * Dots Variant - Three animated dots
 */
const DotsLoading: React.FC<{ size: string; color: string }> = ({ size, color }) => {
  const dotAnimation = {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
  };

  const transition = {
    duration: 1.2,
    repeat: Infinity,
    ease: 'easeInOut',
  };

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={clsx('rounded-full', size, `bg-current ${color}`)}
          animate={dotAnimation}
          transition={{
            ...transition,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Pulse Variant - Pulsing circle
 */
const PulseLoading: React.FC<{ size: string; color: string; glow: string }> = ({
  size,
  color,
  glow,
}) => (
  <motion.div
    className={clsx('rounded-full', size, `bg-current ${color}`, glow)}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.6, 1, 0.6],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

/**
 * Skeleton Variant - Shimmer effect
 */
const SkeletonLoading: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={clsx(
      'bg-background-surface rounded-lg overflow-hidden relative',
      className || 'w-full h-20'
    )}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
      animate={{
        x: ['-100%', '100%'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  </div>
);

/**
 * Neural Variant - Neural network animation (ORUS exclusive)
 */
const NeuralLoading: React.FC<{ size: string; color: string }> = ({ size, color }) => {
  const nodePositions = [
    { x: '25%', y: '50%' },
    { x: '50%', y: '25%' },
    { x: '50%', y: '75%' },
    { x: '75%', y: '50%' },
  ];

  return (
    <div className={clsx('relative', size)}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Connections */}
        {nodePositions.map((pos, i) => (
          <motion.line
            key={`line-${i}`}
            x1="50"
            y1="50"
            x2={pos.x}
            y2={pos.y}
            stroke="currentColor"
            strokeWidth="0.5"
            className={clsx('opacity-30', color)}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Center node */}
        <motion.circle
          cx="50"
          cy="50"
          r="3"
          fill="currentColor"
          className={color}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Outer nodes */}
        {nodePositions.map((pos, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={pos.x}
            cy={pos.y}
            r="2"
            fill="currentColor"
            className={color}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

// ============================================================================
// MAIN LOADING COMPONENT
// ============================================================================

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  message,
  fullscreen = false,
  className,
}) => {
  const content = (
    <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
      {/* Loading Animation */}
      {variant === 'spinner' && (
        <SpinnerLoading size={sizeStyles[size]} color={colorStyles[color]} />
      )}

      {variant === 'dots' && (
        <DotsLoading size={dotSizes[size]} color={colorStyles[color]} />
      )}

      {variant === 'pulse' && (
        <PulseLoading
          size={sizeStyles[size]}
          color={colorStyles[color]}
          glow={glowStyles[color]}
        />
      )}

      {variant === 'skeleton' && <SkeletonLoading />}

      {variant === 'neural' && (
        <NeuralLoading size={sizeStyles[size]} color={colorStyles[color]} />
      )}

      {/* Loading Message */}
      {message && (
        <motion.p
          className="text-sm text-foreground-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );

  // Fullscreen overlay
  if (fullscreen) {
    return (
      <motion.div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: Loading (Premium loading component)
 * NAMED_EXPORTS: LoadingProps
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
