/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - AUTHORIZATION MIDDLEWARE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module middleware/authorization.middleware
 * @description Role-based access control and permission checking
 * @version 1.0.0
 * @created 2025-10-09
 * 
 * Validates user permissions and resource access rights. Integrates with
 * Enterprise Engine for organization-level RBAC.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../system/logging-system';

enum Permission {
  PROJECT_CREATE = 'project:create',
  PROJECT_READ = 'project:read',
  PROJECT_UPDATE = 'project:update',
  PROJECT_DELETE = 'project:delete',
  PROJECT_DEPLOY = 'project:deploy',
  TEMPLATE_CREATE = 'template:create',
  MARKETPLACE_PUBLISH = 'marketplace:publish',
  ORG_MANAGE = 'org:manage'
}

enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  VIEWER = 'viewer'
}

class AuthorizationMiddleware {
  
  /**
   * Check if user has required permission
   */
  requirePermission = (permission: Permission | string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const user = req.user;
        
        if (!user) {
          res.status(401).json({
            success: false,
            error: {
              code: 'AUTH_REQUIRED',
              message: 'Authentication required'
            }
          });
          return;
        }
        
        // Check if user has permission
        const hasPermission = this.checkPermission(user, permission);
        
        if (!hasPermission) {
          logger.warn('Permission denied', {
            component: 'AuthorizationMiddleware',
            action: 'requirePermission',
            metadata: {
              userId: user.userId,
              permission,
              endpoint: req.path
            }
          });
          
          res.status(403).json({
            success: false,
            error: {
              code: 'PERMISSION_DENIED',
              message: 'Insufficient permissions',
              details: `Required permission: ${permission}`
            }
          });
          return;
        }
        
        next();
        
      } catch (error) {
        logger.error('Authorization error', error as Error, {
          component: 'AuthorizationMiddleware'
        });
        
        res.status(500).json({
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: 'Authorization failed'
          }
        });
      }
    };
  };
  
  /**
   * Check if user has required role
   */
  requireRole = (roles: UserRole | UserRole[]) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const user = req.user;
        
        if (!user) {
          res.status(401).json({
            success: false,
            error: {
              code: 'AUTH_REQUIRED',
              message: 'Authentication required'
            }
          });
          return;
        }
        
        if (!allowedRoles.includes(user.role as UserRole)) {
          res.status(403).json({
            success: false,
            error: {
              code: 'ROLE_DENIED',
              message: 'Insufficient role',
              details: `Required roles: ${allowedRoles.join(', ')}`
            }
          });
          return;
        }
        
        next();
        
      } catch (error) {
        logger.error('Role check error', error as Error, {
          component: 'AuthorizationMiddleware'
        });
        
        res.status(500).json({
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: 'Role validation failed'
          }
        });
      }
    };
  };
  
  /**
   * Check if user has access to specific project
   */
  checkProjectAccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      const projectId = req.params['projectId'] || req.body['projectId'];
      
      if (!user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_REQUIRED',
            message: 'Authentication required'
          }
        });
        return;
      }
      
      if (!projectId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'PROJECT_ID_REQUIRED',
            message: 'Project ID is required'
          }
        });
        return;
      }
      
      // TODO: Check actual project access from database
      // For now, simplified check
      const hasAccess = await this.verifyProjectAccess(user.userId, projectId);
      
      if (!hasAccess) {
        res.status(403).json({
          success: false,
          error: {
            code: 'PROJECT_ACCESS_DENIED',
            message: 'Access denied to this project'
          }
        });
        return;
      }
      
      next();
      
    } catch (error) {
      logger.error('Project access check error', error as Error, {
        component: 'AuthorizationMiddleware'
      });
      
      res.status(500).json({
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: 'Access validation failed'
        }
      });
    }
  };
  
  /**
   * Check if user is project owner
   */
  checkProjectOwnership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      const projectId = req.params['projectId'] || req.body['projectId'];
      
      if (!user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_REQUIRED',
            message: 'Authentication required'
          }
        });
        return;
      }
      
      if (!projectId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'PROJECT_ID_REQUIRED',
            message: 'Project ID is required'
          }
        });
        return;
      }
      
      // TODO: Check actual project ownership from database
      const isOwner = await this.verifyProjectOwnership(user.userId, projectId);
      
      if (!isOwner) {
        res.status(403).json({
          success: false,
          error: {
            code: 'OWNER_REQUIRED',
            message: 'Only project owner can perform this action'
          }
        });
        return;
      }
      
      next();
      
    } catch (error) {
      logger.error('Ownership check error', error as Error, {
        component: 'AuthorizationMiddleware'
      });
      
      res.status(500).json({
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: 'Ownership validation failed'
        }
      });
    }
  };
  
  /**
   * Helper: Check if user has specific permission
   */
  private checkPermission(user: Express.Request['user'], permission: string): boolean {
    if (!user) return false;
    
    // Owner and Admin have all permissions
    if (user.role === UserRole.OWNER || user.role === UserRole.ADMIN) {
      return true;
    }
    
    // Check explicit permissions
    if (user.permissions?.includes(permission)) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Helper: Verify project access (to be implemented with actual DB)
   */
  private async verifyProjectAccess(_userId: string, _projectId: string): Promise<boolean> {
    // TODO: Implement actual database check
    // For now, allow access (will be implemented with Project service)
    return true;
  }
  
  /**
   * Helper: Verify project ownership (to be implemented with actual DB)
   */
  private async verifyProjectOwnership(_userId: string, _projectId: string): Promise<boolean> {
    // TODO: Implement actual database check
    return true;
  }
}

export const authorizationMiddleware = new AuthorizationMiddleware();
