/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOGGER UTILITY - Wrapper para logging system
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { logger as loggingSystem } from '../system/logging-system';

export const logger = {
  debug: (message: string, metadata?: any) => {
    loggingSystem.debug(message, { component: 'System', ...metadata });
  },
  
  info: (message: string, metadata?: any) => {
    loggingSystem.info(message, { component: 'System', ...metadata });
  },
  
  warn: (message: string, metadata?: any) => {
    loggingSystem.warn(message, { component: 'System', ...metadata });
  },
  
  error: (message: string, metadata?: any) => {
    loggingSystem.error(message, { component: 'System', ...metadata });
  }
};
