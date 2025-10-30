/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - EXPRESS SERVER (FIXED - NO DOTENV)
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
import { logger } from './system/logging-system';

// ✅ REMOVIDO: import dotenv
// ✅ REMOVIDO: dotenv.config()

class Server {
  private app: Application;
  private httpServer: HTTPServer;
  private io: SocketIOServer;
  private port: number;
  
  constructor() {
    console.log('📦 Creating Express app...');
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: 'http://localhost:3000',
        credentials: true
      }
    });
    this.port = 5000;
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
      origin: 'http://localhost:3000',
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
    // Test MongoDB connection endpoint
this.app.get('/test/mongodb', async (req, res) => {
  try {
    console.log('🔌 Testing MongoDB connection...');
    
    const mongoose = require('mongoose');
    
    const uri = 'mongodb+srv://kaycnascimento8:L4mamLTvSY5TIfjj@cluster0.ovu5.mongodb.net/orus-builder?retryWrites=true&w=majority';
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // 5 segundos timeout
    });
    
    console.log('✅ MongoDB connected!');
    
    // Test ping
    await mongoose.connection.db.admin().ping();
    
    res.json({
      success: true,
      message: 'MongoDB connection successful',
      database: mongoose.connection.name,
      status: mongoose.connection.readyState
    });
    
  } catch (error: any) {
    console.error('❌ MongoDB error:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'pending', // Will add later
        mode: 'development'
      });
    });
    
    this.app.use('/api', apiRouter);
    this.app.use(errorHandlerMiddleware.notFound);
    
    console.log('✅ Routes mounted');
  }
  
  private configureWebSocket(): void {
    console.log('🔌 Configuring WebSocket...');
    
    this.io.on('connection', (socket) => {
      console.log('WebSocket client connected:', socket.id);
      
      socket.on('disconnect', () => {
        console.log('WebSocket client disconnected:', socket.id);
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
      console.log(`💾 Database: Will connect manually`);
      console.log(`⚙️ Environment: development`);
      console.log('═══════════════════════════════════════════════════════');
    });
    
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }
  
  private async shutdown(): Promise<void> {
    console.log('🛑 Shutting down server gracefully...');
    
    this.httpServer.close(() => {
      console.log('✅ HTTP server closed');
    });
    
    console.log('✅ Server shutdown complete');
    process.exit(0);
  }
}

// Start server
console.log('🎬 Starting ORUS Builder...');
const server = new Server();

server.start().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

export { server };
