/**
 * ============================================================================
 * ORUS BUILDER - USE WEBSOCKET HOOK
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T09:49:00-03:00
 * LAST_MODIFIED: 2025-10-10T09:49:00-03:00
 * COMPONENT_HASH: orus.frontend.hook.websocket.20251010.WSH4U5V6
 * 
 * PURPOSE:
 * - Custom WebSocket hook for real-time communication
 * - Auto-reconnect on disconnect
 * - Event subscription management
 * - Message queue for offline mode
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: WebSocketManagementAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 85
 * - TRINITY_INTEGRATED: Full (Real-time sync)
 * ============================================================================
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface UseWebSocketOptions {
  /**
   * WebSocket URL
   */
  url: string;

  /**
   * Auto-connect on mount
   * @default true
   */
  autoConnect?: boolean;

  /**
   * Reconnection options
   */
  reconnection?: {
    enabled?: boolean;
    delay?: number;
    maxAttempts?: number;
  };

  /**
   * Authentication token
   */
  token?: string;

  /**
   * Connection callback
   */
  onConnect?: () => void;

  /**
   * Disconnection callback
   */
  onDisconnect?: () => void;

  /**
   * Error callback
   */
  onError?: (error: Error) => void;
}

export type SubscriptionCallback = (data: any) => void;

interface EventSubscription {
  event: string;
  callback: SubscriptionCallback;
}

// ============================================================================
// USE WEBSOCKET HOOK
// ============================================================================

export function useWebSocket(options: UseWebSocketOptions) {
  const {
    url,
    autoConnect = true,
    reconnection = { enabled: true, delay: 1000, maxAttempts: 5 },
    token,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [error, setError] = useState<Error | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const subscriptionsRef = useRef<EventSubscription[]>([]);
  const messageQueueRef = useRef<{ event: string; data: any }[]>([]);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Connect to WebSocket
   */
  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      console.warn('[WebSocket] Already connected');
      return;
    }

    setConnectionStatus('connecting');

    const socket = io(url, {
      transports: ['websocket', 'polling'],
      auth: token ? { token } : undefined,
      reconnection: false, // We handle reconnection manually
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('[WebSocket] Connected');
      setIsConnected(true);
      setConnectionStatus('connected');
      setError(null);
      reconnectAttemptsRef.current = 0;

      // Send queued messages
      while (messageQueueRef.current.length > 0) {
        const { event, data } = messageQueueRef.current.shift()!;
        socket.emit(event, data);
      }

      if (onConnect) {
        onConnect();
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');

      if (onDisconnect) {
        onDisconnect();
      }

      // Auto-reconnect
      if (reconnection.enabled && reason !== 'io client disconnect') {
        attemptReconnect();
      }
    });

    socket.on('error', (err: Error) => {
      console.error('[WebSocket] Error:', err);
      setError(err);
      setConnectionStatus('error');

      if (onError) {
        onError(err);
      }
    });

    // Re-subscribe to events
    subscriptionsRef.current.forEach(({ event, callback }) => {
      socket.on(event, callback);
    });
  }, [url, token, reconnection.enabled, onConnect, onDisconnect, onError]);

  /**
   * Disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  /**
   * Attempt reconnection
   */
  const attemptReconnect = useCallback(() => {
    if (!reconnection.enabled) return;

    if (reconnectAttemptsRef.current >= (reconnection.maxAttempts || 5)) {
      console.error('[WebSocket] Max reconnection attempts reached');
      setError(new Error('Failed to reconnect after maximum attempts'));
      return;
    }

    reconnectAttemptsRef.current++;
    const delay = (reconnection.delay || 1000) * reconnectAttemptsRef.current;

    console.log(`[WebSocket] Attempting to reconnect (${reconnectAttemptsRef.current}/${reconnection.maxAttempts}) in ${delay}ms`);

    reconnectTimerRef.current = setTimeout(() => {
      connect();
    }, delay);
  }, [reconnection, connect]);

  /**
   * Send message
   */
  const sendMessage = useCallback((event: string, data?: any) => {
    if (!socketRef.current) {
      console.warn('[WebSocket] Not connected. Queueing message...');
      messageQueueRef.current.push({ event, data });
      return;
    }

    if (!socketRef.current.connected) {
      console.warn('[WebSocket] Connection lost. Queueing message...');
      messageQueueRef.current.push({ event, data });
      return;
    }

    socketRef.current.emit(event, data);
  }, []);

  /**
   * Subscribe to event
   */
  const subscribe = useCallback((event: string, callback: SubscriptionCallback): (() => void) => {
    // Add to subscriptions list
    const subscription: EventSubscription = { event, callback };
    subscriptionsRef.current.push(subscription);

    // Subscribe if connected
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }

    // Return unsubscribe function
    return () => {
      subscriptionsRef.current = subscriptionsRef.current.filter((sub) => sub !== subscription);

      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    };
  }, []);

  /**
   * Auto-connect on mount
   */
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    connectionStatus,
    error,
    connect,
    disconnect,
    sendMessage,
    subscribe,
  };
}

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: useWebSocket (WebSocket hook)
 * NAMED_EXPORTS: UseWebSocketOptions, SubscriptionCallback
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
