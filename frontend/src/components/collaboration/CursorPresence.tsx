/**
 * ============================================================================
 * ORUS BUILDER - CURSOR PRESENCE COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T09:44:00-03:00
 * LAST_MODIFIED: 2025-10-10T09:44:00-03:00
 * COMPONENT_HASH: orus.frontend.component.cursorpresence.20251010.CRP2S3T4
 * 
 * PURPOSE:
 * - Display live cursors of other users
 * - Show user selections and highlights
 * - Real-time cursor position tracking
 * - User presence indicators
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: PresenceVisualizationAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 68
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useWebSocket } from '@hooks/useWebSocket';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface CursorPresenceProps {
  /**
   * Room/document ID
   */
  roomId: string;

  /**
   * Current user info
   */
  currentUser: UserInfo;

  /**
   * Container ref
   */
  containerRef: React.RefObject<HTMLElement>;

  /**
   * Enable cursor tracking
   * @default true
   */
  enabled?: boolean;
}

export interface UserInfo {
  id: string;
  name: string;
  color: string;
  avatar?: string;
}

export interface CursorPosition {
  userId: string;
  userName: string;
  userColor: string;
  x: number;
  y: number;
  timestamp: number;
}

export interface Selection {
  userId: string;
  userName: string;
  userColor: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  timestamp: number;
}

// ============================================================================
// CURSOR PRESENCE COMPONENT
// ============================================================================

export const CursorPresence: React.FC<CursorPresenceProps> = ({
  roomId,
  currentUser,
  containerRef,
  enabled = true,
}) => {
  const [cursors, setCursors] = useState<Map<string, CursorPosition>>(new Map());
  const [selections, setSelections] = useState<Map<string, Selection>>(new Map());
  const throttleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { sendMessage, subscribe, isConnected } = useWebSocket({
    url: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
    autoConnect: true,
  });

  // Subscribe to cursor updates
  useEffect(() => {
    if (!enabled) return;

    const unsubscribeCursor = subscribe('cursor:move', (data: CursorPosition) => {
      if (data.userId !== currentUser.id) {
        setCursors((prev) => new Map(prev).set(data.userId, data));

        // Remove stale cursors after 5 seconds
        setTimeout(() => {
          setCursors((prev) => {
            const newMap = new Map(prev);
            const cursor = newMap.get(data.userId);
            if (cursor && cursor.timestamp === data.timestamp) {
              newMap.delete(data.userId);
            }
            return newMap;
          });
        }, 5000);
      }
    });

    const unsubscribeSelection = subscribe('cursor:selection', (data: Selection) => {
      if (data.userId !== currentUser.id) {
        setSelections((prev) => new Map(prev).set(data.userId, data));

        // Remove stale selections after 10 seconds
        setTimeout(() => {
          setSelections((prev) => {
            const newMap = new Map(prev);
            const selection = newMap.get(data.userId);
            if (selection && selection.timestamp === data.timestamp) {
              newMap.delete(data.userId);
            }
            return newMap;
          });
        }, 10000);
      }
    });

    const unsubscribeLeave = subscribe('cursor:leave', (data: { userId: string }) => {
      setCursors((prev) => {
        const newMap = new Map(prev);
        newMap.delete(data.userId);
        return newMap;
      });
      setSelections((prev) => {
        const newMap = new Map(prev);
        newMap.delete(data.userId);
        return newMap;
      });
    });

    return () => {
      unsubscribeCursor();
      unsubscribeSelection();
      unsubscribeLeave();
    };
  }, [enabled, roomId, currentUser.id, subscribe]);

  // Track current user cursor
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Throttle cursor updates
      if (throttleTimerRef.current) return;

      throttleTimerRef.current = setTimeout(() => {
        throttleTimerRef.current = null;

        sendMessage('cursor:move', {
          roomId,
          userId: currentUser.id,
          userName: currentUser.name,
          userColor: currentUser.color,
          x,
          y,
          timestamp: Date.now(),
        });
      }, 50);
    };

    const handleMouseLeave = () => {
      sendMessage('cursor:leave', {
        roomId,
        userId: currentUser.id,
      });
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
      }
    };
  }, [enabled, roomId, currentUser, containerRef, sendMessage]);

  if (!enabled || !isConnected) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {/* Selections */}
      <AnimatePresence>
        {Array.from(selections.values()).map((selection) => (
          <motion.div
            key={selection.userId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            className="absolute"
            style={{
              left: Math.min(selection.start.x, selection.end.x),
              top: Math.min(selection.start.y, selection.end.y),
              width: Math.abs(selection.end.x - selection.start.x),
              height: Math.abs(selection.end.y - selection.start.y),
              backgroundColor: selection.userColor,
              borderRadius: '2px',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Cursors */}
      <AnimatePresence>
        {Array.from(cursors.values()).map((cursor) => (
          <RemoteCursor
            key={cursor.userId}
            cursor={cursor}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// REMOTE CURSOR COMPONENT
// ============================================================================

interface RemoteCursorProps {
  cursor: CursorPosition;
}

const RemoteCursor: React.FC<RemoteCursorProps> = ({ cursor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1, x: cursor.x, y: cursor.y }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="absolute pointer-events-none"
      style={{ left: 0, top: 0 }}
    >
      {/* Cursor SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
      >
        <path
          d="M5 3L19 12L12 13L9 20L5 3Z"
          fill={cursor.userColor}
          stroke="white"
          strokeWidth="1"
        />
      </svg>

      {/* User name label */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute left-6 top-0 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap shadow-elevated"
        style={{ backgroundColor: cursor.userColor }}
      >
        {cursor.userName}
      </motion.div>
    </motion.div>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: CursorPresence (Live cursor tracking component)
 * NAMED_EXPORTS: CursorPresenceProps, CursorPosition
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
