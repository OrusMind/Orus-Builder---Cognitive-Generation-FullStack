/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - EXPRESS SERVER (FULL VERSION WITH DATABASE)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api.routes';
import { errorHandlerMiddleware } from './middleware/error-handler.middleware';
import { loggingMiddleware } from './middleware/logging.middleware';
import { rateLimiterMiddleware } from './middleware/rate-limiter.middleware';
import { database } from './system/database-connection';
import { logger } from './system/logging-system';

// Load environment variables
dotenv.config();

class Server {
  private app: Application;
  private httpServer: HTTPServer;
  private io: SocketIOServer;
  private port: number;
  
  constructor() {
    logger.info('📦 Creating Express app...');
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
        credentials: true
      }
    });
    this.port = parseInt(process.env['PORT'] || '5000', 10);
    logger.info('✅ Express app created');
  }
  
  async initialize(): Promise<void> {
    logger.info('🚀 Initializing ORUS Builder Server...');
    
    await this.connectDatabase();
    this.configureMiddleware();
    this.mountRoutes();
    this.configureWebSocket();
    this.setupErrorHandlers();
    
    logger.info('✅ Server initialization complete');
  }
  
  private async connectDatabase(): Promise<void> {
    logger.info('🔌 Connecting to database...');
    
    try {
      await database.connect();
      
      // Test health check
      const health = await database.healthCheck();
      if (health.isHealthy) {
        logger.info('✅ Database health check passed', {
          component: 'Server',
          metadata: { responseTime: health.responseTime }
        });
      }
      
    } catch (error) {
      logger.error('❌ Database connection failed', error as Error);
      logger.warn('⚠️ Server will run without database (limited functionality)');
    }
  }
  
  private configureMiddleware(): void {
    logger.info('⚙️ Configuring middleware...');
    
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
      credentials: true,
    }));
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(loggingMiddleware.logRequests);
    this.app.use(rateLimiterMiddleware.globalLimiter);
    
    logger.info('✅ Middleware configured');
  }
  
private mountRoutes(): void {
  logger.info('🛣️ Mounting routes...');
  
  // Health check with database status
  this.app.get('/health', async (req, res) => {
    const dbConnected = database.isConnected();
    let dbHealth;
    
    if (dbConnected) {
      try {
        dbHealth = await database.healthCheck();
      } catch (error) {
        dbHealth = { isHealthy: false, error: 'Health check failed' };
      }
    }
    
    res.json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: dbConnected,
        status: database.getStatus(),
        healthy: dbHealth?.isHealthy || false,
        responseTime: dbHealth?.responseTime
      },
      environment: process.env['NODE_ENV'] || 'development'
    });
  });
  
  // ✅ FIX: Adicionar void explícito e garantir todos os caminhos retornam
  this.app.get('/health/database', async (req, res): Promise<void> => {
    if (!database.isConnected()) {
      res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
      return; // ✅ Adicionar return aqui
    }
    
    try {
      const health = await database.healthCheck();
      const stats = database.getStatistics();
      
      res.json({
        success: true,
        data: {
          health,
          statistics: stats
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Database health check failed'
      });
    }
  });
  
  this.app.use('/api', apiRouter);
  this.app.use(errorHandlerMiddleware.notFound);
  
  logger.info('✅ Routes mounted');
}
  private configureWebSocket(): void {
    logger.info('🔌 Configuring WebSocket...');
    
    this.io.on('connection', (socket) => {
      logger.info('WebSocket client connected', {
        component: 'WebSocket',
        metadata: { socketId: socket.id }
      });
      
      socket.on('disconnect', () => {
        logger.info('WebSocket client disconnected', {
          component: 'WebSocket',
          metadata: { socketId: socket.id }
        });
      });
    });
    
    logger.info('✅ WebSocket configured');
  }
  
  private setupErrorHandlers(): void {
    logger.info('🛡️ Setting up error handlers...');
    this.app.use(errorHandlerMiddleware.handle);
    logger.info('✅ Error handlers configured');
  }
  
  async start(): Promise<void> {
    logger.info('⏳ Starting server initialization...');
    await this.initialize();
    
    logger.info(`⏳ Starting HTTP server on port ${this.port}...`);
    
    this.httpServer.listen(this.port, () => {
      const dbStatus = database.isConnected() ? '✅ Connected' : '❌ Disconnected';
      
      logger.info('═══════════════════════════════════════════════════════');
      logger.info('🎉🎊 ORUS BUILDER SERVER STARTED! 🎊🎉');
      logger.info('═══════════════════════════════════════════════════════');
      logger.info(`🌐 Server: http://localhost:${this.port}`);
      logger.info(`📊 API: http://localhost:${this.port}/api`);
      logger.info(`🔌 WebSocket: ws://localhost:${this.port}`);
      logger.info(`💾 Database: ${dbStatus}`);
      logger.info(`⚙️ Environment: ${process.env['NODE_ENV'] || 'development'}`);
      logger.info('═══════════════════════════════════════════════════════');
    });
    
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }
  
  private async shutdown(): Promise<void> {
    logger.info('🛑 Shutting down server gracefully...');
    
    this.httpServer.close(() => {
      logger.info('✅ HTTP server closed');
    });
    
    try {
      if (database.isConnected()) {
        await database.disconnect();
        logger.info('✅ Database disconnected');
      }
    } catch (error) {
      logger.error('Error disconnecting database', error as Error);
    }
    
    logger.info('✅ Server shutdown complete');
    process.exit(0);
  }
}

// Start server
logger.info('🎬 Starting ORUS Builder...');
const server = new Server();

server.start().catch((error) => {
  logger.error('❌ Failed to start server', error);
  process.exit(1);
});

export { server };
