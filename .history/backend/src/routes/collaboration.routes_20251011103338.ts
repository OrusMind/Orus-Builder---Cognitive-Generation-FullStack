 
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - COLLABORATION ROUTES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module routes/collaboration.routes
 * @description Real-time collaboration endpoints (WebSocket + REST)
 * @version 1.0.0
 * @created 2025-10-09
 * 
 * Handles collaborative sessions, real-time editing, chat, presence,
 * and team coordination features.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Router, Request, Response, NextFunction } from 'express';
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
 * 
 * @body {
 *   projectId: string,
 *   maxParticipants?: number,
 *   allowChat?: boolean
 * }
 * 
 * @returns {
 *   session: CollaborationSession,
 *   wsUrl: string
 * }
 */
router.post(
  '/sessions',
  authorizationMiddleware.checkProjectAccess,
  rateLimiterMiddleware.rateLimiter({ max: 20, windowMs: 60 * 1000 }),
  validationMiddleware.validateSessionCreation,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await collaborationController.createSession(userId, req.body);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Collaboration session created'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Join Collaboration Session
 * POST /api/v1/collaboration/sessions/:sessionId/join
 * 
 * @param sessionId - Session ID
 * 
 * @returns {
 *   participant: Participant,
 *   sessionState: SessionState,
 *   wsToken: string
 * }
 */
router.post(
  '/sessions/:sessionId/join',
  rateLimiterMiddleware.rateLimiter({ max: 50, windowMs: 60 * 1000 }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user!.userId;
      const username = req.user!.username;
      
      const result = await collaborationController.joinSession(sessionId, userId, username);
      
      res.json({
        success: true,
        data: result,
        message: 'Joined collaboration session'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Leave Collaboration Session
 * POST /api/v1/collaboration/sessions/:sessionId/leave
 * 
 * @param sessionId - Session ID
 * 
 * @returns {
 *   message: string
 * }
 */
router.post(
  '/sessions/:sessionId/leave',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user!.userId;
      
      await collaborationController.leaveSession(sessionId, userId);
      
      res.json({
        success: true,
        message: 'Left collaboration session'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get Session State
 * GET /api/v1/collaboration/sessions/:sessionId
 * 
 * @param sessionId - Session ID
 * 
 * @returns {
 *   session: CollaborationSession,
 *   participants: Participant[],
 *   recentActivity: Activity[]
 * }
 */
router.get(
  '/sessions/:sessionId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;
      const session = await collaborationController.getSession(sessionId);
      
      res.json({
        success: true,
        data: session
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REAL-TIME CHAT
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Send Chat Message
 * POST /api/v1/collaboration/sessions/:sessionId/chat
 * 
 * @param sessionId - Session ID
 * @body {
 *   message: string,
 *   useTrinity?: boolean
 * }
 * 
 * @returns {
 *   messageId: string,
 *   timestamp: Date
 * }
 */
router.post(
  '/sessions/:sessionId/chat',
  rateLimiterMiddleware.rateLimiter({ max: 100, windowMs: 60 * 1000 }),
  validationMiddleware.validateChatMessage,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user!.userId;
      const username = req.user!.username;
      const { message, useTrinity } = req.body;
      
      const result = await collaborationController.sendMessage(
        sessionId,
        userId,
        username,
        message,
        useTrinity
      );
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get Chat History
 * GET /api/v1/collaboration/sessions/:sessionId/chat
 * 
 * @param sessionId - Session ID
 * @query {
 *   limit?: number,
 *   before?: string
 * }
 * 
 * @returns {
 *   messages: ChatMessage[]
 * }
 */
router.get(
  '/sessions/:sessionId/chat',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;
      const { limit = 50, before } = req.query;
      
      const messages = await collaborationController.getChatHistory(
        sessionId,
        Number(limit),
        before as string
      );
      
      res.json({
        success: true,
        data: { messages }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PRESENCE & CURSORS
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Update User Presence
 * POST /api/v1/collaboration/sessions/:sessionId/presence
 * 
 * @param sessionId - Session ID
 * @body {
 *   file?: string,
 *   cursor?: { line: number, column: number },
 *   status?: 'active' | 'idle' | 'away'
 * }
 * 
 * @returns {
 *   acknowledged: boolean
 * }
 */
router.post(
  '/sessions/:sessionId/presence',
  rateLimiterMiddleware.rateLimiter({ max: 200, windowMs: 60 * 1000 }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user!.userId;
      
      await collaborationController.updatePresence(sessionId, userId, req.body);
      
      res.json({
        success: true,
        data: { acknowledged: true }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get Active Participants
 * GET /api/v1/collaboration/sessions/:sessionId/participants
 * 
 * @param sessionId - Session ID
 * 
 * @returns {
 *   participants: Participant[]
 * }
 */
router.get(
  '/sessions/:sessionId/participants',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;
      const participants = await collaborationController.getParticipants(sessionId);
      
      res.json({
        success: true,
        data: { participants }
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as collaborationRoutes };
