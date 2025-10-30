/**
 * ============================================================================
 * ORUS BUILDER - COLLABORATION TYPES
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T20:53:00-03:00
 * LAST_MODIFIED: 2025-10-09T20:53:00-03:00
 * COMPONENT_HASH: orus.frontend.types.collaboration.20251009.COL4E5F6
 * 
 * PURPOSE:
 * - Real-time collaboration types
 * - WebSocket event types
 * - Chat and comment types
 * - Presence and cursor types
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: CollaborationSyncAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 92
 * - TRINITY_INTEGRATED: Voz (Communication)
 * ============================================================================
 */

import { User } from './api.types';

// ============================================================================
// WEBSOCKET EVENT TYPES
// ============================================================================

/**
 * WebSocket Event
 */
export interface WebSocketEvent<T = unknown> {
  type: WebSocketEventType;
  payload: T;
  timestamp: string;
  userId: string;
  sessionId: string;
}

/**
 * WebSocket Event Type enum
 */
export enum WebSocketEventType {
  // Connection
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  
  // Session
  JOIN_SESSION = 'join_session',
  LEAVE_SESSION = 'leave_session',
  
  // Code
  CODE_UPDATE = 'code_update',
  FILE_OPEN = 'file_open',
  FILE_CLOSE = 'file_close',
  
  // Cursor
  CURSOR_MOVE = 'cursor_move',
  SELECTION_CHANGE = 'selection_change',
  
  // Chat
  CHAT_MESSAGE = 'chat_message',
  TYPING_START = 'typing_start',
  TYPING_STOP = 'typing_stop',
  
  // Comments
  COMMENT_ADD = 'comment_add',
  COMMENT_RESOLVE = 'comment_resolve',
  
  // Presence
  USER_JOIN = 'user_join',
  USER_LEAVE = 'user_leave',
  USER_ACTIVITY = 'user_activity',
}

// ============================================================================
// CODE COLLABORATION TYPES
// ============================================================================

/**
 * Code Update Event
 */
export interface CodeUpdateEvent {
  fileId: string;
  filePath: string;
  changes: CodeChange[];
  version: number;
}

/**
 * Code Change
 */
export interface CodeChange {
  range: CodeRange;
  text: string;
  operation: 'insert' | 'delete' | 'replace';
}

/**
 * Code Range
 */
export interface CodeRange {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

/**
 * File State
 */
export interface FileState {
  fileId: string;
  version: number;
  content: string;
  lockedBy?: string;
  editors: string[]; // User IDs
}

// ============================================================================
// CURSOR AND PRESENCE TYPES
// ============================================================================

/**
 * User Presence
 */
export interface UserPresence {
  userId: string;
  user: User;
  status: PresenceStatus;
  currentFile?: string;
  cursor?: CursorPosition;
  selection?: SelectionRange;
  lastActivity: string;
  color: string; // Hex color for cursor
}

/**
 * Presence Status enum
 */
export enum PresenceStatus {
  ONLINE = 'online',
  AWAY = 'away',
  BUSY = 'busy',
  OFFLINE = 'offline',
}

/**
 * Cursor Position
 */
export interface CursorPosition {
  fileId: string;
  line: number;
  column: number;
}

/**
 * Selection Range
 */
export interface SelectionRange {
  fileId: string;
  start: Position;
  end: Position;
}

/**
 * Position
 */
export interface Position {
  line: number;
  column: number;
}

// ============================================================================
// CHAT TYPES
// ============================================================================

/**
 * Chat Message
 */
export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  user: User;
  message: string;
  timestamp: string;
  replyTo?: string;
  reactions: Reaction[];
  edited: boolean;
  editedAt?: string;
}

/**
 * Reaction
 */
export interface Reaction {
  emoji: string;
  userId: string;
  timestamp: string;
}

/**
 * Typing Indicator
 */
export interface TypingIndicator {
  userId: string;
  userName: string;
  isTyping: boolean;
}

// ============================================================================
// COMMENT TYPES
// ============================================================================

/**
 * Code Comment
 */
export interface CodeComment {
  id: string;
  fileId: string;
  line: number;
  userId: string;
  user: User;
  text: string;
  timestamp: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  replies: CommentReply[];
}

/**
 * Comment Reply
 */
export interface CommentReply {
  id: string;
  userId: string;
  user: User;
  text: string;
  timestamp: string;
}

/**
 * Comment Thread
 */
export interface CommentThread {
  id: string;
  fileId: string;
  line: number;
  comments: CodeComment[];
  resolved: boolean;
  participants: string[]; // User IDs
}

// ============================================================================
// ACTIVITY TYPES
// ============================================================================

/**
 * Activity Event
 */
export interface ActivityEvent {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/**
 * Activity Type enum
 */
export enum ActivityType {
  USER_JOINED = 'user_joined',
  USER_LEFT = 'user_left',
  FILE_CREATED = 'file_created',
  FILE_EDITED = 'file_edited',
  FILE_DELETED = 'file_deleted',
  COMMENT_ADDED = 'comment_added',
  COMMENT_RESOLVED = 'comment_resolved',
  PROJECT_DEPLOYED = 'project_deployed',
}

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: None (types only)
 * NAMED_EXPORTS: All interfaces and enums
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
