/**
 * ============================================================================
 * ORUS BUILDER - AVATAR COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T09:49:00-03:00
 * LAST_MODIFIED: 2025-10-10T09:49:00-03:00
 * COMPONENT_HASH: orus.frontend.component.avatar.20251010.AVT3T4U5
 * 
 * PURPOSE:
 * - User avatar display component
 * - Fallback to initials
 * - Multiple sizes
 * - Status indicator support
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: AvatarVisualizationAgent
 * - COGNITIVE_LEVEL: Basic
 * - AUTONOMY_DEGREE: 60
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React from 'react';
import { clsx } from 'clsx';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface AvatarProps {
  /**
   * Image URL
   */
  src?: string;

  /**
   * User name (for initials fallback)
   */
  name?: string;

  /**
   * Size
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Status indicator
   */
  status?: 'online' | 'offline' | 'away' | 'busy';

  /**
   * Custom className
   */
  className?: string;

  /**
   * Alt text
   */
  alt?: string;
}

// ============================================================================
// SIZE STYLES
// ============================================================================

const sizeStyles = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const statusSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
};

// ============================================================================
// STATUS STYLES
// ============================================================================

const statusStyles = {
  online: 'bg-accent',
  offline: 'bg-foreground-muted',
  away: 'bg-primary',
  busy: 'bg-error',
};

// ============================================================================
// AVATAR COMPONENT
// ============================================================================

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  status,
  className,
  alt,
}) => {
  const [imageError, setImageError] = React.useState(false);

  // Get initials from name
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
   return `${parts[0]?.[0] || ''}${parts[parts.length - 1]?.[0] || ''}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(name);
  const showImage = src && !imageError;

  return (
    <div className={clsx('relative inline-block', className)}>
      <div
        className={clsx(
          'rounded-full overflow-hidden flex items-center justify-center font-semibold',
          sizeStyles[size],
          showImage ? 'bg-background-elevated' : 'bg-gradient-cognitive text-background'
        )}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-2 border-background',
            statusSizes[size],
            statusStyles[status]
          )}
        />
      )}
    </div>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: Avatar (Avatar component)
 * NAMED_EXPORTS: AvatarProps
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
