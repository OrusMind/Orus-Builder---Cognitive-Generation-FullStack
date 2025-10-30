 
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - LOGGER UTILITY
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @module utils/logger
 * @description Centralized logging utility (references system logger)
 * @version 1.0.0
 * @created 2025-10-09
 * 
 * Simple re-export of the main logging system for convenience.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { logger as loggingSystem } from '../system/logging-system';

/**
 * Re-export commonly used logging functions
 */
export const logger = {
  debug: (message: string, metadata?: any) => loggingSystem.debug(message, { ...metadata }),
  info: (message: string, metadata?: any) => loggingSystem.info(message, { ...metadata }),
  warn: (message: string, metadata?: any) => loggingSystem.warn(message, { ...metadata }),
  error: (message: string, error?: Error, metadata?: any) => loggingSystem.error(message, { ...metadata })
};
