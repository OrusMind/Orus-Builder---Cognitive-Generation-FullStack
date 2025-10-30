/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - EXPRESS SERVER (FULL VERSION)
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
import { databaseManager } from './system/database-manager';
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
      await databaseManager.connect();
      logger.info('✅ Database connected successfully');
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
    
    this.app.get('/health', (req, res) => {
      const dbStatus = databaseManager.isConnected() ? 'connected' : 'disconnected';
      
      res.json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: dbStatus,
        mode: process.env['NODE_ENV'] || 'development'
      });
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
      logger.info('═══════════════════════════════════════════════════════');
      logger.info('🎉🎊 ORUS BUILDER SERVER STARTED! 🎊🎉');
      logger.info('═══════════════════════════════════════════════════════');
      logger.info(`🌐 Server: http://localhost:${this.port}`);
      logger.info(`📊 API: http://localhost:${this.port}/api`);
      logger.info(`🔌 WebSocket: ws://localhost:${this.port}`);
      logger.info(`💾 Database: ${databaseManager.isConnected() ? 'Connected' : 'Disconnected'}`);
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
      await databaseManager.disconnect();
      logger.info('✅ Database disconnected');
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
