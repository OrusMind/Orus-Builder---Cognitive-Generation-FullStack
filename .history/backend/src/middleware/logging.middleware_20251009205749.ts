/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - LOGGING MIDDLEWARE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module middleware/logging.middleware
 * @description HTTP request/response logging with performance tracking
 * @version 1.0.0
 * @created 2025-10-09
 * 
 * Logs all HTTP requests and responses with timing, status codes, and
 * performance metrics. Integrates with monitoring system.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../system/logging-system';
import { monitoringEngine } from '../engines/monitoring-engine';

interface RequestLog {
  requestId: string;
  method: string;
  path: string;
  query: any;
  ip: string;
  userAgent: string;
  userId?: string;
  timestamp: Date;
  duration?: number;
  statusCode?: number;
  responseSize?: number;
}

class LoggingMiddleware {
  
  /**
   * Request/Response logger
   */
  logRequests = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    const requestId = this.generateRequestId();
    
    // Attach request ID to request object
    (req as any).requestId = requestId;
    
    // Build request log
    const requestLog: RequestLog = {
      requestId,
      method: req.method,
      path: req.path,
      query: req.query,
      ip: req.ip || req.socket.remoteAddress || 'unknown',
      userAgent: req.get('user-agent') || 'unknown',
      userId: req.user?.userId,
      timestamp: new Date()
    };
    
    // Log incoming request (debug level)
    logger.debug('Incoming request', {
      component: 'LoggingMiddleware',
      action: 'logRequests',
      metadata: requestLog as unknown as Record<string, unknown>
    });
    
    // Capture response
    const originalSend = res.send;
    
    res.send = function(data: any): Response {
      return originalSend.call(this, data);
    };
    
    // Log response when finished
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      
      // Update request log with response data
      requestLog.duration = duration;
      requestLog.statusCode = statusCode;
      requestLog.responseSize = res.get('content-length') 
        ? parseInt(res.get('content-length')!) 
        : undefined;
      
      // Determine log level based on status code
      const logLevel = this.getLogLevel(statusCode);
      
    const logContext = {
  component: 'LoggingMiddleware',
  action: 'logRequests',
  metadata: requestLog as unknown as Record<string, unknown>
};

// Log response with appropriate level
if (logLevel === 'error') {
  logger.error('Request completed', new Error('Request error'), logContext);
} else if (logLevel === 'warn') {
  logger.warn('Request completed', logContext);
} else if (logLevel === 'info') {
  logger.info('Request completed', logContext);
} else {
  logger.debug('Request completed', logContext);
}
      // Record metrics in monitoring system
      this.recordMetrics(requestLog);
      
      // Log slow requests
      if (duration > 1000) {
        logger.warn('Slow request detected', {
          component: 'LoggingMiddleware',
          action: 'logRequests',
          metadata: requestLog as unknown as Record<string, unknown>
        });
      }
    });
    
    next();
  };
  
  /**
   * API endpoint specific logger
   */
  logEndpoint = (endpointName: string) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
      logger.info(`API endpoint accessed: ${endpointName}`, {
        component: 'LoggingMiddleware',
        action: 'logEndpoint',
        metadata: {
          endpoint: endpointName,
          userId: req.user?.userId,
          requestId: (req as any).requestId
        }
      });
      
      next();
    };
  };
  
  /**
   * Security event logger
   */
  logSecurityEvent = (eventType: string, details: any) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
      logger.warn(`Security event: ${eventType}`, {
        component: 'SecurityLogger',
        action: 'logSecurityEvent',
        metadata: {
          eventType,
          userId: req.user?.userId,
          ip: req.ip,
          path: req.path,
          ...details
        }
      });
      
      next();
    };
  };
  
  /**
   * Performance logger - tracks specific operations
   */
  logPerformance = (operationName: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const startTime = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        
        logger.info(`Performance: ${operationName}`, {
          component: 'PerformanceLogger',
          action: 'logPerformance',
          metadata: {
            operation: operationName,
            duration,
            statusCode: res.statusCode,
            userId: req.user?.userId
          }
        });
        
        // Record in monitoring if slow
        if (duration > 500) {
          monitoringEngine.recordMetric({
            metricId: `perf-${operationName}`,
            name: `slow_operation_${operationName}`,
            type: 'histogram' as any,
            category: 'performance' as any,
            value: duration,
            unit: 'ms',
            labels: { operation: operationName },
            timestamp: new Date(),
            aggregatable: true
          });
        }
      });
      
      next();
    };
  };
  
  /**
   * Record metrics in monitoring system
   */
  private recordMetrics(requestLog: RequestLog): void {
    const now = new Date();
    
    // Record response time
    if (requestLog.duration) {
      monitoringEngine.recordMetric({
        metricId: 'http-response-time',
        name: 'response_time',
        type: 'histogram' as any,
        category: 'performance' as any,
        value: requestLog.duration,
        unit: 'ms',
        labels: {
          method: requestLog.method,
          path: requestLog.path,
          status: String(requestLog.statusCode)
        },
        timestamp: now,
        aggregatable: true
      });
    }
    
    // Record request count
    monitoringEngine.recordMetric({
      metricId: 'http-requests',
      name: 'requests',
      type: 'counter' as any,
      category: 'usage' as any,
      value: 1,
      labels: {
        method: requestLog.method,
        path: requestLog.path,
        status: String(requestLog.statusCode)
      },
      timestamp: now,
      aggregatable: true
    });
    
    // Record errors
    if (requestLog.statusCode && requestLog.statusCode >= 400) {
      monitoringEngine.recordMetric({
        metricId: 'http-errors',
        name: 'errors',
        type: 'counter' as any,
        category: 'errors' as any,
        value: 1,
        labels: {
          method: requestLog.method,
          path: requestLog.path,
          status: String(requestLog.statusCode)
        },
        timestamp: now,
        aggregatable: true
      });
    }
  }
  
  /**
   * Determine log level based on status code
   */
  private getLogLevel(statusCode: number): 'debug' | 'info' | 'warn' | 'error' {
    if (statusCode >= 500) return 'error';
    if (statusCode >= 400) return 'warn';
    if (statusCode >= 300) return 'info';
    return 'debug';
  }
  
  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const loggingMiddleware = new LoggingMiddleware();

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * END OF ALL MIDDLEWARE - PROTECTION LAYER COMPLETE! 🎉
 * ═══════════════════════════════════════════════════════════════════════════
 */
