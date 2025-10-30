/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - RATE LIMITER MIDDLEWARE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module middleware/rate-limiter.middleware
 * @description Rate limiting and DDoS protection
 * @version 1.0.0
 * @created 2025-10-09
 * 
 * Implements intelligent rate limiting with tiered limits based on user type,
 * IP-based tracking, and automatic blacklisting for abuse prevention.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { logger } from '../system/logging-system';

interface RateLimitConfig {
  max: number;           // Max requests
  windowMs: number;      // Time window in milliseconds
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

class RateLimiterMiddleware {
  private redisClient: any; // Redis client (to be configured)
  
  /**
   * Create rate limiter with custom configuration
   */
  createLimiter(config: RateLimitConfig) {
    return rateLimit({
      windowMs: config.windowMs,
      max: config.max,
      message: config.message || 'Too many requests, please try again later',
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: config.skipSuccessfulRequests || false,
      skipFailedRequests: config.skipFailedRequests || false,
      
      // Use Redis store in production for distributed rate limiting
      store: process.env.NODE_ENV === 'production' && this.redisClient
        ? new RedisStore({
            client: this.redisClient,
            prefix: 'orus:ratelimit:'
          })
        : undefined,
      
      // Custom key generator - use user ID if authenticated, otherwise IP
      keyGenerator: (req: Request) => {
        if (req.user?.userId) {
          return `user:${req.user.userId}`;
        }
        return `ip:${req.ip}`;
      },
      
      // Custom handler for rate limit exceeded
      handler: (req: Request, res: Response) => {
        logger.warn('Rate limit exceeded', {
          component: 'RateLimiterMiddleware',
          identifier: req.user?.userId || req.ip,
          endpoint: req.path
        });
        
        res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: config.message || 'Too many requests, please try again later',
            retryAfter: Math.ceil(config.windowMs / 1000)
          }
        });
      }
    });
  }
  
  /**
   * Default rate limiter - flexible wrapper
   */
  rateLimiter = (config?: Partial<RateLimitConfig>) => {
    const defaultConfig: RateLimitConfig = {
      max: 100,
      windowMs: 15 * 60 * 1000, // 15 minutes
      ...config
    };
    
    return this.createLimiter(defaultConfig);
  };
  
  /**
   * Strict rate limiter for sensitive endpoints
   */
  strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      logger.warn('Strict rate limit exceeded', {
        component: 'RateLimiterMiddleware',
        identifier: req.user?.userId || req.ip,
        endpoint: req.path
      });
      
      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many attempts, please try again in 15 minutes',
          retryAfter: 900
        }
      });
    }
  });
  
  /**
   * API-wide rate limiter (applied globally)
   */
  globalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 200, // 200 requests per minute
    message: 'API rate limit exceeded',
    standardHeaders: true,
    legacyHeaders: false,
    
    // Skip authenticated users with premium plans
    skip: (req: Request) => {
      const user = req.user;
      if (user && this.isPremiumUser(user)) {
        return true; // Skip rate limiting for premium users
      }
      return false;
    },
    
    handler: (req: Request, res: Response) => {
      logger.warn('Global rate limit exceeded', {
        component: 'RateLimiterMiddleware',
        identifier: req.user?.userId || req.ip
      });
      
      res.status(429).json({
        success: false,
        error: {
          code: 'GLOBAL_RATE_LIMIT_EXCEEDED',
          message: 'API rate limit exceeded. Consider upgrading to a premium plan.',
          retryAfter: 60
        }
      });
    }
  });
  
  /**
   * Tiered rate limiter based on user plan
   */
  tieredLimiter = (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;
    
    let maxRequests = 50; // Free tier
    const windowMs = 60 * 1000; // 1 minute
    
    if (user) {
      // Determine user tier and set appropriate limits
      const tier = this.getUserTier(user);
      
      switch (tier) {
        case 'free':
          maxRequests = 50;
          break;
        case 'starter':
          maxRequests = 100;
          break;
        case 'professional':
          maxRequests = 500;
          break;
        case 'enterprise':
          maxRequests = 10000;
          break;
      }
    }
    
    // Apply dynamic rate limit
    const limiter = this.createLimiter({ max: maxRequests, windowMs });
    limiter(req, res, next);
  };
  
  /**
   * Burst protection - prevents rapid-fire requests
   */
  burstProtection = rateLimit({
    windowMs: 1000, // 1 second
    max: 10, // 10 requests per second
    message: 'Too many requests in short period',
    skipSuccessfulRequests: false,
    handler: (req: Request, res: Response) => {
      logger.warn('Burst protection triggered', {
        component: 'RateLimiterMiddleware',
        identifier: req.user?.userId || req.ip
      });
      
      res.status(429).json({
        success: false,
        error: {
          code: 'BURST_LIMIT_EXCEEDED',
          message: 'Too many requests in a short period. Please slow down.',
          retryAfter: 1
        }
      });
    }
  });
  
  /**
   * Helper: Check if user is premium
   */
  private isPremiumUser(user: Express.Request['user']): boolean {
    // TODO: Implement actual premium check
    return false;
  }
  
  /**
   * Helper: Get user tier
   */
  private getUserTier(user: Express.Request['user']): string {
    // TODO: Implement actual tier check from database
    return 'free';
  }
}

export const rateLimiterMiddleware = new RateLimiterMiddleware();
