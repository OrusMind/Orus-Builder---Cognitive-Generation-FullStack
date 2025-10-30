/**
 * ============================================================================
 * ORUS BUILDER - INPUT COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:01:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:01:00-03:00
 * COMPONENT_HASH: orus.frontend.component.input.20251009.INP2M3N4
 * 
 * PURPOSE:
 * - Reusable input component with ORUS design system
 * - Support for text, email, password, number types
 * - Error states and helper text
 * - Full accessibility support (WCAG 2.1 AA)
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: FormInputAgent
 * - COGNITIVE_LEVEL: Basic
 * - AUTONOMY_DEGREE: 65
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React from 'react';
import { clsx } from 'clsx';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input label
   */
  label?: string;

  /**
   * Helper text below input
   */
  helperText?: string;

  /**
   * Error message
   */
  error?: string;

  /**
   * Input size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Full width input
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Left icon element
   */
  leftIcon?: React.ReactNode;

  /**
   * Right icon element
   */
  rightIcon?: React.ReactNode;
}

// ============================================================================
// SIZE STYLES
// ============================================================================

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
};

// ============================================================================
// INPUT COMPONENT
// ============================================================================

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${React.useId()}`;
    const helperTextId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const inputClasses = clsx(
      // Base styles
      'w-full',
      'rounded-lg',
      'border',
      'font-sans',
      'transition-all duration-200',
      'placeholder:text-foreground-subtle',
      
      // Focus styles
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
      
      // Size styles
      sizeStyles[size],
      
      // Icon padding
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      
      // Error state
      error
        ? 'border-error bg-error/10 text-error focus:ring-error'
        : 'border-primary/30 bg-background text-foreground focus:border-primary focus:ring-primary',
      
      // Disabled state
      disabled && 'opacity-50 cursor-not-allowed bg-background-surface',
      
      // Custom className
      className
    );

    return (
      <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground flex items-center gap-1"
          >
            {label}
            {required && <span className="text-error" aria-label="required">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={clsx(
              error && errorId,
              helperText && helperTextId
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper Text or Error */}
        {error ? (
          <p id={errorId} className="text-sm text-error" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperTextId} className="text-sm text-foreground-muted">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: Input (Reusable input component)
 * NAMED_EXPORTS: InputProps
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
