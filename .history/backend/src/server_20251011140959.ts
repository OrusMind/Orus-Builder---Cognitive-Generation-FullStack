/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - EXPRESS SERVER (MINIMAL - SEM REDIS)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { apiRouter } from './routes/api.routes';
import { errorHandlerMiddleware } from './middleware/error-handler.middleware';
import { loggingMiddleware } from './middleware/logging.middleware';
import { rateLimiterMiddleware } from './middleware/rate-limiter.middleware';

class Server {
  private app: Application;
  private httpServer: HTTPServer;
  private io: SocketIOServer;
  private port: number;
  
  constructor() {
    console.log('📦 Creating Express app...');
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer);
    this.port = parseInt(process.env['PORT'] || '5000', 10);
    console.log('✅ Express app created');
  }
  
  async initialize(): Promise<void> {
    console.log('🚀 Initializing ORUS Builder Server...');
    
    this.configureMiddleware();
    this.mountRoutes();
    this.configureWebSocket();
    this.setupErrorHandlers();
    
    console.log('✅ Server initialization complete');
  }
  
  private configureMiddleware(): void {
    console.log('⚙️ Configuring middleware...');
    
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
    
    console.log('✅ Middleware configured');
  }
  
  private mountRoutes(): void {
    console.log('🛣️ Mounting routes...');
    
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        mode: 'minimal-no-redis',
      });
    });
    
    this.app.use('/api', apiRouter);
    this.app.use(errorHandlerMiddleware.notFound);
    
    console.log('✅ Routes mounted');
  }
  
  private configureWebSocket(): void {
    console.log('🔌 Configuring WebSocket...');
    
    this.io.on('connection', (socket) => {
      console.log('WebSocket client connected');
      
      socket.on('disconnect', () => {
        console.log('WebSocket client disconnected');
      });
    });
    
    console.log('✅ WebSocket configured');
  }
  
  private setupErrorHandlers(): void {
    console.log('🛡️ Setting up error handlers...');
    this.app.use(errorHandlerMiddleware.handle);
    console.log('✅ Error handlers configured');
  }
  
  async start(): Promise<void> {
    console.log('⏳ Starting server initialization...');
    await this.initialize();
    
    console.log(`⏳ Starting HTTP server on port ${this.port}...`);
    
    this.httpServer.listen(this.port, () => {
      console.log('═══════════════════════════════════════════════════════');
      console.log('🎉🎊 ORUS BUILDER SERVER STARTED! 🎊🎉');
      console.log('═══════════════════════════════════════════════════════');
      console.log(`🌐 Server: http://localhost:${this.port}`);
      console.log(`📊 API: http://localhost:${this.port}/api`);
      console.log(`🔌 WebSocket: ws://localhost:${this.port}`);
      console.log(`⚙️ Mode: MINIMAL (no redis, no engines)`);
      console.log('═══════════════════════════════════════════════════════');
    });
    
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }
  
  private async shutdown(): Promise<void> {
    console.log('🛑 Shutting down server gracefully...');
    
    this.httpServer.close(() => {
      console.log('✅ Server shutdown complete');
    });
    
    process.exit(0);
  }
}

// Start server
console.log('🎬 Starting ORUS Builder...');
const server = new Server();

server.start().catch((error) => {
  console.error('❌ Failed to start server:', error);
