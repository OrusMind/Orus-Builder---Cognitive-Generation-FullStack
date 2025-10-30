 
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - VALIDATION MIDDLEWARE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module middleware/validation.middleware
 * @description Request payload validation using schemas
 * @version 1.0.0
 * @created 2025-10-09
 * 
 * Validates incoming request data against defined schemas to ensure
 * data integrity and prevent malformed requests.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '../system/logging-system';

class ValidationMiddleware {
  
  /**
   * Generic validation wrapper
   */
  private validate = (schema: Joi.Schema) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { error, value } = schema.validate(req.body, {
          abortEarly: false,
          stripUnknown: true
        });
        
        if (error) {
          const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }));
          
          res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid request data',
              details: errors
            }
          });
          return;
        }
        
        // Replace body with validated and sanitized data
        req.body = value;
        next();
        
      } catch (error) {
        logger.error('Validation error', error as Error, {
          component: 'ValidationMiddleware'
        });
        
        res.status(500).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed'
          }
        });
      }
    };
  };
  
  // ═══════════════════════════════════════════════════════════════════════
  // AUTH VALIDATIONS
  // ═══════════════════════════════════════════════════════════════════════
  
  validateRegistration = this.validate(
    Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      name: Joi.string().min(2).max(100).required(),
      organizationName: Joi.string().min(2).max(100).optional()
    })
  );
  
  validateLogin = this.validate(
    Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  );
  
  validateRefreshToken = this.validate(
    Joi.object({
      refreshToken: Joi.string().required()
    })
  );
  
  validateEmail = this.validate(
    Joi.object({
      email: Joi.string().email().required()
    })
  );
  
  validatePasswordReset = this.validate(
    Joi.object({
      token: Joi.string().required(),
      newPassword: Joi.string().min(8).required()
    })
  );
  
  validatePasswordChange = this.validate(
    Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().min(8).required()
    })
  );
  
  validateProfileUpdate = this.validate(
    Joi.object({
      name: Joi.string().min(2).max(100).optional(),
      avatar: Joi.string().uri().optional(),
      preferences: Joi.object().optional()
    })
  );
  
  validate2FAToken = this.validate(
    Joi.object({
      token: Joi.string().length(6).required()
    })
  );
  
  // ═══════════════════════════════════════════════════════════════════════
  // PROJECT VALIDATIONS
  // ═══════════════════════════════════════════════════════════════════════
  
  validateProjectCreation = this.validate(
    Joi.object({
      name: Joi.string().min(2).max(100).required(),
      description: Joi.string().max(500).optional(),
      type: Joi.string().valid('web', 'mobile', 'api', 'fullstack').required(),
      template: Joi.string().optional(),
      settings: Joi.object().optional()
    })
  );
  
  validateProjectUpdate = this.validate(
    Joi.object({
      name: Joi.string().min(2).max(100).optional(),
      description: Joi.string().max(500).optional(),
      status: Joi.string().valid('active', 'archived').optional()
    })
  );
  
  validateFileUpdate = this.validate(
    Joi.object({
      content: Joi.string().required()
    })
  );
  
  validateProjectShare = this.validate(
    Joi.object({
      email: Joi.string().email().required(),
      role: Joi.string().valid('viewer', 'editor', 'admin').required()
    })
  );
  
  validateSettingsUpdate = this.validate(
    Joi.object().pattern(Joi.string(), Joi.any())
  );
  
  // ═══════════════════════════════════════════════════════════════════════
  // GENERATION VALIDATIONS
  // ═══════════════════════════════════════════════════════════════════════
  
  validateGenerationPrompt = this.validate(
    Joi.object({
      projectId: Joi.string().required(),
      prompt: Joi.string().min(10).max(5000).required(),
      language: Joi.string().valid('typescript', 'javascript', 'python').required(),
      framework: Joi.string().optional(),
      includeTests: Joi.boolean().optional(),
      style: Joi.string().valid('functional', 'oop').optional()
    })
  );
  
  validateTemplateGeneration = this.validate(
    Joi.object({
      projectId: Joi.string().required(),
      templateId: Joi.string().required(),
      variables: Joi.object().required(),
      customization: Joi.object().optional()
    })
  );
  
  validateBlueprintGeneration = this.validate(
    Joi.object({
      projectId: Joi.string().required(),
      blueprintId: Joi.string().required(),
      customization: Joi.object().optional()
    })
  );
  
  validateEnhancement = this.validate(
    Joi.object({
      enhancements: Joi.array().items(Joi.string()).required(),
      additionalPrompt: Joi.string().max(1000).optional()
    })
  );
  
  validateRegeneration = this.validate(
    Joi.object({
      modifiedPrompt: Joi.string().max(5000).optional(),
      keepFiles: Joi.array().items(Joi.string()).optional(),
      changes: Joi.object().optional()
    })
  );
  
  // ═══════════════════════════════════════════════════════════════════════
  // COLLABORATION VALIDATIONS
  // ═══════════════════════════════════════════════════════════════════════
  
  validateSessionCreation = this.validate(
    Joi.object({
      projectId: Joi.string().required(),
      maxParticipants: Joi.number().min(2).max(50).optional(),
      allowChat: Joi.boolean().optional()
    })
  );
  
  validateChatMessage = this.validate(
    Joi.object({
      message: Joi.string().min(1).max(2000).required(),
      useTrinity: Joi.boolean().optional()
    })
  );
  
  // ═══════════════════════════════════════════════════════════════════════
  // DEPLOYMENT VALIDATIONS
  // ═══════════════════════════════════════════════════════════════════════
  
  validateDeployment = this.validate(
    Joi.object({
      projectId: Joi.string().required(),
      platform: Joi.string().valid('vercel', 'netlify', 'aws', 'gcp', 'azure', 'docker').required(),
      environment: Joi.string().valid('development', 'staging', 'production').required(),
      strategy: Joi.string().valid('standard', 'blue-green', 'canary', 'rolling').optional(),
      envVars: Joi.object().pattern(Joi.string(), Joi.string()).optional()
    })
  );
  
  // ═══════════════════════════════════════════════════════════════════════
  // MARKETPLACE VALIDATIONS
  // ═══════════════════════════════════════════════════════════════════════
  
  validateListingCreation = this.validate(
    Joi.object({
      title: Joi.string().min(5).max(100).required(),
      description: Joi.string().min(20).max(500).required(),
      longDescription: Joi.string().max(5000).optional(),
      type: Joi.string().valid('template', 'component', 'blueprint').required(),
      price: Joi.number().min(0).required(),
      currency: Joi.string().length(3).default('USD'),
      category: Joi.string().required(),
      tags: Joi.array().items(Joi.string()).min(1).max(10).required(),
      license: Joi.string().required()
    })
  );
  
  validatePurchase = this.validate(
    Joi.object({
      paymentMethod: Joi.string().required()
    })
  );
  
  // ═══════════════════════════════════════════════════════════════════════
  // BLUEPRINT VALIDATIONS
  // ═══════════════════════════════════════════════════════════════════════
  
  validateBlueprintUpload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: {
            code: 'FILE_REQUIRED',
            message: 'Blueprint file is required'
          }
        });
        return;
      }
      
      const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_FILE_TYPE',
            message: 'Only image files (PNG, JPEG, WebP) are allowed'
          }
        });
        return;
      }
      
      next();
    } catch (error) {
      logger.error('Blueprint upload validation error', error as Error);
      res.status(500).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'File validation failed'
        }
      });
    }
  };
}

export const validationMiddleware = new ValidationMiddleware();

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * END OF VALIDATION MIDDLEWARE
 * ═══════════════════════════════════════════════════════════════════════════
 */
