/**
 * ============================================================================
 * ORUS BUILDER - BUTTON COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:01:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:01:00-03:00
 * COMPONENT_HASH: orus.frontend.component.button.20251009.BTN1L2M3
 * 
 * PURPOSE:
 * - Reusable button component with ORUS design system
 * - Multiple variants (primary, secondary, ghost, danger)
 * - Size options and loading states
 * - Full accessibility support (WCAG 2.1 AA)
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: InteractiveUIAgent
 * - COGNITIVE_LEVEL: Basic
 * - AUTONOMY_DEGREE: 70
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React from 'react';
import { clsx } from 'clsx';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

  /**
   * Button size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Icon element (left side)
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon element (right side)
   */
  rightIcon?: React.ReactNode;

  /**
   * Children content
   */
  children: React.ReactNode;
}

// ============================================================================
// VARIANT STYLES (ORUS DARK COGNITIVE THEME)
// ============================================================================

const variantStyles = {
  primary: clsx(
    'bg-gradient-cognitive',
    'text-background',
    'hover:shadow-glow-cyan',
    'active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none'
  ),
  secondary: clsx(
    'bg-background-surface',
    'text-foreground',
    'border border-primary/30',
    'hover:border-primary/60',
    'hover:bg-background-elevated',
    'active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ),
  ghost: clsx(
    'bg-transparent',
    'text-foreground',
    'hover:bg-background-surface',
    'active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ),
  danger: clsx(
    'bg-error',
    'text-white',
    'hover:bg-error/90',
    'hover:shadow-glow-green',
    'active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ),
  success: clsx(
    'bg-gradient-success',
    'text-background',
    'hover:shadow-glow-green',
    'active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ),
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
};

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const buttonClasses = clsx(
      // Base styles
      'inline-flex items-center justify-center gap-2',
      'font-semibold',
      'rounded-lg',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
      
      // Variant styles
      variantStyles[variant],
      
      // Size styles
      sizeStyles[size],
      
      // Full width
      fullWidth && 'w-full',
      
      // Loading state
      isLoading && 'cursor-wait',
      
      // Custom className
      className
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {/* Left Icon */}
        {leftIcon && !isLoading && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            <svg
              className="animate-spin h-5 w-5"
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
          </span>
        )}

        {/* Button Text */}
        <span>{children}</span>

        {/* Right Icon */}
        {rightIcon && !isLoading && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: Button (Reusable button component)
 * NAMED_EXPORTS: ButtonProps
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
