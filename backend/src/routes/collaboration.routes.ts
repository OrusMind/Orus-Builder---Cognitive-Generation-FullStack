/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - COLLABORATION ROUTES (FIXED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module routes/collaboration.routes
 * @description Real-time collaboration endpoints (WebSocket + REST)
 * @version 1.1.0
 * @created 2025-10-09
 * @updated 2025-10-11
 * 
 * Handles collaborative sessions, real-time editing, chat, presence,
 * and team coordination features.
 * 
 * FIXES APPLIED (v1.1):
 * - Fixed controller method calls using .bind()
 * - Aligned method names with controller
 * - Fixed parameter passing
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Router } from 'express';
import { collaborationController } from '../controllers/collaboration.controller';
import { authenticationMiddleware } from '../middleware/authentication.middleware';
import { authorizationMiddleware } from '../middleware/authorization.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { rateLimiterMiddleware } from '../middleware/rate-limiter.middleware';

const router = Router();

// All collaboration routes require authentication
router.use(authenticationMiddleware.authenticate);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLLABORATION SESSIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Create Collaboration Session
 * POST /api/v1/collaboration/sessions
 */
router.post(
  '/sessions',
  authorizationMiddleware.checkProjectAccess,
  rateLimiterMiddleware.rateLimiter({ max: 20, windowMs: 60 * 1000 }),
  validationMiddleware.validateSessionCreation,
  collaborationController.createSession.bind(collaborationController)
);

/**
 * Join Collaboration Session
 * POST /api/v1/collaboration/sessions/:sessionId/join
 */
router.post(
  '/sessions/:sessionId/join',
  rateLimiterMiddleware.rateLimiter({ max: 50, windowMs: 60 * 1000 }),
  collaborationController.joinSession.bind(collaborationController)
);

/**
 * Leave Collaboration Session
 * POST /api/v1/collaboration/sessions/:sessionId/leave
 */
router.post(
  '/sessions/:sessionId/leave',
  collaborationController.leaveSession.bind(collaborationController)
);

/**
 * Get Session State
 * GET /api/v1/collaboration/sessions/:sessionId
 */
router.get(
  '/sessions/:sessionId',
  collaborationController.getSessionState.bind(collaborationController)
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REAL-TIME CHAT
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Send Chat Message
 * POST /api/v1/collaboration/sessions/:sessionId/chat
 */
router.post(
  '/sessions/:sessionId/chat',
  rateLimiterMiddleware.rateLimiter({ max: 100, windowMs: 60 * 1000 }),
  validationMiddleware.validateChatMessage,
  collaborationController.sendChatMessage.bind(collaborationController)
);

/**
 * Get Chat History
 * GET /api/v1/collaboration/sessions/:sessionId/chat
 */
router.get(
  '/sessions/:sessionId/chat',
  collaborationController.getChatHistory.bind(collaborationController)
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PRESENCE & CURSORS
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Update User Presence
 * POST /api/v1/collaboration/sessions/:sessionId/presence
 */
router.post(
  '/sessions/:sessionId/presence',
  rateLimiterMiddleware.rateLimiter({ max: 200, windowMs: 60 * 1000 }),
  collaborationController.updatePresence.bind(collaborationController)
);

/**
 * Get Active Participants
 * GET /api/v1/collaboration/sessions/:sessionId/participants
 */
router.get(
  '/sessions/:sessionId/participants',
  collaborationController.getActiveParticipants.bind(collaborationController)
);

export { router as collaborationRoutes };

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * END OF COLLABORATION ROUTES (FIXED)
 * ═══════════════════════════════════════════════════════════════════════════
 * VERSION: 1.1.0
 * ALL ERRORS RESOLVED: ✅
 * READY FOR: Testing
 * ═══════════════════════════════════════════════════════════════════════════
 */
