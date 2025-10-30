/**
 * ============================================================================
 * ORUS BUILDER - DROPDOWN COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:01:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:01:00-03:00
 * COMPONENT_HASH: orus.frontend.component.dropdown.20251009.DRP5P6Q7
 * 
 * PURPOSE:
 * - Accessible dropdown menu component with ORUS design
 * - Keyboard navigation support
 * - Click outside to close
 * - Smooth animations
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: SelectionUIAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 75
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { ChevronDown, Check } from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  /**
   * Options array
   */
  options: DropdownOption[];

  /**
   * Selected value
   */
  value?: string;

  /**
   * Change handler
   */
  onChange: (value: string) => void;

  /**
   * Placeholder text
   * @default 'Select option'
   */
  placeholder?: string;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Error state
   */
  error?: string;

  /**
   * Full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Label
   */
  label?: string;
}

// ============================================================================
// DROPDOWN COMPONENT
// ============================================================================

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  disabled = false,
  error,
  fullWidth = false,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownId = `dropdown-${React.useId()}`;

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
 const handleKeyDown = (e: React.KeyboardEvent): void => { // ✅ Adicionar tipo de retorno explícito
  if (disabled) return;

  switch (e.key) {
    case 'Enter':
    case ' ':
      if (!isOpen) {
        setIsOpen(true);
      } else if (highlightedIndex >= 0) {
        const option = options[highlightedIndex];
        if (option && !option.disabled) {
          handleSelect(option);
        }
      }
      e.preventDefault();
      break;

    case 'ArrowDown':
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prev) => {
          let next = prev + 1;
          while (next < options.length && options[next]?.disabled) {
            next++;
          }
          return next < options.length ? next : prev;
        });
      }
      e.preventDefault();
      break;

    case 'ArrowUp':
      setHighlightedIndex((prev) => {
        let next = prev - 1;
        while (next >= 0 && options[next]?.disabled) {
          next--;
        }
        return next >= 0 ? next : prev;
      });
      e.preventDefault();
      break;

    case 'Escape':
      setIsOpen(false);
      e.preventDefault();
      break;

    default:
      // ✅ Opcional mas boa prática
      break;
  }
}; // ✅ Agora TypeScript sabe que sempre retorna void
  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    onChange(option.value);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <div
      ref={containerRef}
      className={clsx('relative', fullWidth && 'w-full')}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={dropdownId}
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        id={dropdownId}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={clsx(
          'w-full flex items-center justify-between gap-2',
          'px-4 py-2 rounded-lg border',
          'text-left transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
          error
            ? 'border-error bg-error/10'
            : 'border-primary/30 bg-background hover:border-primary/60',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon && (
            <span className="text-foreground-muted">{selectedOption.icon}</span>
          )}
          <span className="text-foreground">
            {selectedOption?.label || placeholder}
          </span>
        </span>

        <ChevronDown
          className={clsx(
            'w-5 h-5 text-foreground-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-sm text-error" role="alert">
          {error}
        </p>
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-background-surface border border-primary/20 rounded-lg shadow-elevated overflow-hidden"
            role="listbox"
          >
            <div className="max-h-60 overflow-y-auto">
              {options.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  disabled={option.disabled}
                  className={clsx(
                    'w-full flex items-center justify-between gap-2 px-4 py-2.5',
                    'text-left transition-colors',
                    option.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:bg-background-elevated',
                    highlightedIndex === index && 'bg-background-elevated',
                    option.value === value && 'bg-primary/10'
                  )}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <span className="flex items-center gap-2">
                    {option.icon && (
                      <span className="text-foreground-muted">{option.icon}</span>
                    )}
                    <span className="text-foreground">{option.label}</span>
                  </span>

                  {option.value === value && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </button>
              ))}
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
 * PRIMARY_EXPORT: Dropdown (Accessible dropdown component)
 * NAMED_EXPORTS: DropdownProps, DropdownOption
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
