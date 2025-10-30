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
import { Server as SocketIOServer } from 'socket.io'; // ✅ Remover Socket daqui
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
  private httpServer: HTTPServer; // ✅ Tipo correto
  private io: SocketIOServer;
  private port: number;
  
  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    
    // ✅ CORREÇÃO 1: Usar objeto de opções separado
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST'],
      },
    });
    
    this.port = parseInt(process.env.PORT || '5000', 10);
  }
  
  /**
   * Initialize server
   */
  async initialize(): Promise<void> {
    logger.info('🚀 Initializing ORUS Builder Server...', {
      component: 'Server',
    });
    
    // 1. Configure middleware
    this.configureMiddleware();
    
    // 2. Initialize all engines
    await this.initializeEngines();
    
    // 3. Mount routes
    this.mountRoutes();
    
    // 4. Configure WebSocket
    this.configureWebSocket();
    
    // 5. Setup error handlers (MUST BE LAST)
    this.setupErrorHandlers();
    
    logger.info('✅ Server initialization complete', {
      component: 'Server',
    });
  }
  
  /**
   * Configure Express middleware
   */
  private configureMiddleware(): void {
    // Security
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    }));
    
    // Compression
    this.app.use(compression());
    
    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Request logging
    this.app.use(loggingMiddleware.logRequests);
    
    // Global rate limiting
    this.app.use(rateLimiterMiddleware.globalLimiter);
    
    logger.info('Middleware configured', {
      component: 'Server',
    });
  }
  
  /**
   * Initialize all engines (THE ORCHESTRA AWAKENS!)
   */
  private async initializeEngines(): Promise<void> {
    logger.info('🎼 Initializing ALL 15 ENGINES...', {
      component: 'Server',
    });
    
    try {
      // Initialize CIG Protocol first (foundation)
      await cigProtocolEngine.initialize({
        engineId: 'cig-protocol-engine',
        environment: process.env.NODE_ENV || 'development',
        logLevel: 'info',
        enabled: true,
      });
      
      // Initialize Orchestration Engine (starts all others)
      await orchestrationEngine.initialize({
        engineId: 'orchestration-engine',
        environment: process.env.NODE_ENV || 'development',
        logLevel: 'info',
        enabled: true,
      });
      
      // Start all engines
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
  
  /**
   * Mount API routes
   */
  private mountRoutes(): void {
    // Health check (no auth required)
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        engines: 'all-operational',
      });
    });
    
    // Mount API routes
    this.app.use('/api', apiRouter);
    
    // 404 handler
    this.app.use(errorHandlerMiddleware.notFound);
    
    logger.info('Routes mounted', {
      component: 'Server',
    });
  }
  
  /**
   * Configure WebSocket for real-time features
   */
  private configureWebSocket(): void {
    // ✅ CORREÇÃO 2: Tipagem implícita do socket
    this.io.on('connection', (socket) => {
      logger.info('WebSocket client connected', {
        component: 'WebSocket',
      });
      
      // Handle collaboration events
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
  
  /**
   * Setup error handlers (MUST BE LAST!)
   */
  private setupErrorHandlers(): void {
    // Global error handler
    this.app.use(errorHandlerMiddleware.handle);
    
    logger.info('Error handlers configured', {
      component: 'Server',
    });
  }
  
  /**
   * Start server
   */
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
    
    // Graceful shutdown
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }
  
  /**
   * Graceful shutdown
   */
  private async shutdown(): Promise<void> {
    logger.info('🛑 Shutting down server gracefully...', {
      component: 'Server',
    });
    
    // Stop accepting new connections
    this.httpServer.close(() => {
      logger.info('HTTP server closed', {
        component: 'Server',
      });
    });
    
    // Stop all engines
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
