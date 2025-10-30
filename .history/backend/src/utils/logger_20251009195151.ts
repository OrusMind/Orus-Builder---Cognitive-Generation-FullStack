 
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

export { logger } from '../system/logging-system';

/**
 * Re-export commonly used logging functions
 */
export const log = {
  debug: (message: string, metadata?: any) => logger.debug(message, { ...metadata }),
  info: (message: string, metadata?: any) => logger.info(message, { ...metadata }),
  warn: (message: string, metadata?: any) => logger.warn(message, { ...metadata }),
  error: (message: string, error?: Error, metadata?: any) => logger.error(message, error!, { ...metadata })
};
