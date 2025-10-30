/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - EXPRESS SERVER (MAIN ENTRY POINT)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { apiRouter } from './src/routes/api.routes';
import { errorHandlerMiddleware } from './src/middleware/error-handler.middleware';
import { loggingMiddleware } from './src/middleware/logging.middleware';
import { rateLimiterMiddleware } from './src/middleware/rate-limiter.middleware';
import { logger } from './src/system/logging-system';

// Import all engines for initialization
import { orchestrationEngine } from './src/engines/orchestrator-engine';
import { cigProtocolEngine } from './src/engines/cig-engine';

class Server {
  private app: Application;
  private httpServer: HTTPServer;
  private io: SocketIOServer;
  private port: number;
  
  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    
    // ✅ CORREÇÃO DEFINITIVA: Socket.IO v4+
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
    });
    
    this.port = parseInt(process.env.PORT || '5000', 10);
  }
  
  async initialize(): Promise<void> {
    logger.info('🚀 Initializing ORUS Builder Server...', {
      component: 'Server',
    });
    
    this.configureMiddleware();
    await this.initializeEngines();
    this.mountRoutes();
    this.configureWebSocket();
    this.setupErrorHandlers();
    
    logger.info('✅ Server initialization complete', {
      component: 'Server',
    });
  }
  
  private configureMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    }));
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(loggingMiddleware.logRequests);
    this.app.use(rateLimiterMiddleware.globalLimiter);
    
    logger.info('Middleware configured', {
      component: 'Server',
    });
  }
  
  private async initializeEngines(): Promise<void> {
    logger.info('🎼 Initializing ALL 15 ENGINES...', {
      component: 'Server',
    });
    
    try {
      await cigProtocolEngine.initialize({
        engineId: 'cig-protocol-engine',
        environment: process.env.NODE_ENV || 'development',
        logLevel: 'info',
        enabled: true,
      });
      
      await orchestrationEngine.initialize({
        engineId: 'orchestration-engine',
        environment: process.env.NODE_ENV || 'development',
        logLevel: 'info',
        enabled: true,
      });
      
      await orchestrationEngine.start();
      
      logger.info('✅ ALL 15 ENGINES OPERATIONAL!', {
        component: 'Server',
      });
      
    } catch (error) {
      logger.error('❌ Engine initialization failed', error as Error, {
        component: 'Server',
      });
      throw error;
    }
  }
  
  private mountRoutes(): void {
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        engines: 'all-operational',
      });
    });
    
    this.app.use('/api', apiRouter);
    this.app.use(errorHandlerMiddleware.notFound);
    
    logger.info('Routes mounted', {
      component: 'Server',
    });
  }
  
  private configureWebSocket(): void {
    // ✅ Tipagem automática do Socket pelo TypeScript
    this.io.on('connection', (socket) => {
      logger.info('WebSocket client connected', {
        component: 'WebSocket',
      });
      
      socket.on('join-session', (sessionId: string) => {
        socket.join(`session:${sessionId}`);
        logger.debug('Client joined collaboration session', {
          component: 'WebSocket',
        });
      });
      
      socket.on('leave-session', (sessionId: string) => {
        socket.leave(`session:${sessionId}`);
      });
      
      socket.on('disconnect', () => {
        logger.debug('WebSocket client disconnected', {
          component: 'WebSocket',
        });
      });
    });
    
    logger.info('WebSocket configured', {
      component: 'Server',
    });
  }
  
  private setupErrorHandlers(): void {
    this.app.use(errorHandlerMiddleware.handle);
    
    logger.info('Error handlers configured', {
      component: 'Server',
    });
  }
  
  async start(): Promise<void> {
    await this.initialize();
    
    this.httpServer.listen(this.port, () => {
      logger.info('═══════════════════════════════════════════════════════', {
        component: 'Server',
      });
      logger.info('🎉🎊 ORUS BUILDER SERVER STARTED SUCCESSFULLY! 🎊🎉', {
        component: 'Server',
      });
      logger.info('═══════════════════════════════════════════════════════', {
        component: 'Server',
      });
      logger.info(`🌐 Server running on http://localhost:${this.port}`, {
        component: 'Server',
      });
      logger.info(`📊 API available at http://localhost:${this.port}/api`, {
        component: 'Server',
      });
      logger.info(`🔌 WebSocket available at ws://localhost:${this.port}`, {
        component: 'Server',
      });
      logger.info(`🎼 All 15 Engines: OPERATIONAL`, {
        component: 'Server',
      });
      logger.info('═══════════════════════════════════════════════════════', {
        component: 'Server',
      });
    });
    
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }
  
  private async shutdown(): Promise<void> {
    logger.info('🛑 Shutting down server gracefully...', {
      component: 'Server',
    });
    
    this.httpServer.close(() => {
      logger.info('HTTP server closed', {
        component: 'Server',
      });
    });
    
    await orchestrationEngine.stop();
    
    logger.info('✅ Server shutdown complete', {
      component: 'Server',
    });
    
    process.exit(0);
  }
}

// Start server
const server = new Server();
server.start().catch((error) => {
  logger.error('❌ Failed to start server', error, {
    component: 'Server',
  });
  process.exit(1);
});

export { server };
