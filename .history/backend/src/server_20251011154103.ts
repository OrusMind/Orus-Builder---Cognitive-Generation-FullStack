/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - EXPRESS SERVER (WITH ENGINES) - NOMES CORRETOS
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
import { mockDatabase as database } from './system/mock-database';

// ✅ IMPORTS CORRETOS BASEADOS NO CARTOGRAPHER
import { cognitiveGenerationEngine } from './engines/cognitive-generation-engine';
import { cigProtocolEngine } from './engines/cig-engine';
import { blueprintEngine } from './engines/blueprint-engine';
import { orchestrationEngine } from './engines/orchestrator-engine';

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
    
    await this.connectDatabase();
    await this.initializeEngines();
    this.configureMiddleware();
    this.mountRoutes();
    this.configureWebSocket();
    this.setupErrorHandlers();
    
    console.log('✅ Server initialization complete');
  }
  
  private async connectDatabase(): Promise<void> {
    try {
      await database.connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
    }
  }
  
  private async initializeEngines(): Promise<void> {
    console.log('🔧 Initializing Engines...');
    
    try {
      // ✅ Cognitive Generation Engine (precisa config)
      await cognitiveGenerationEngine.initialize({
        aiProvider: 'claude',
        model: 'claude-3-opus-20240229',
        enableTrinity: false,
        enableLearning: true
      });
      console.log('✅ Cognitive Generation Engine initialized');
      
      // ✅ CIG Protocol Engine
      await cigProtocolEngine.initialize();
      console.log('✅ CIG Protocol Engine initialized');
      
      // ✅ Blueprint Engine (precisa config)
      await blueprintEngine.initialize({
        enableAutoValidation: true,
        enableAutoGeneration: true
      });
      console.log('✅ Blueprint Engine initialized');
      
      // ✅ Orchestration Engine
      await orchestrationEngine.initialize();
      console.log('✅ Orchestration Engine initialized');
      
    } catch (error) {
      console.error('⚠️ Engine initialization failed:', error);
      console.log('⚠️ Server will run without engines (limited functionality)');
    }
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
    
    // Health check with engines status
    this.app.get('/health', async (req, res) => {
      const dbHealth = await database.healthCheck();
      
      const enginesStatus = {
        generation: cognitiveGenerationEngine.getStatus() === 'running',
        cig: cigProtocolEngine.getStatus() === 'running',
        blueprint: blueprintEngine.getStatus() === 'running',
        orchestrator: orchestrationEngine.getStatus() === 'running'
      };
      
      return res.json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          connected: database.isConnected(),
          healthy: dbHealth.isHealthy,
          responseTime: dbHealth.responseTime,
          type: 'mock'
        },
        engines: enginesStatus,
        mode: 'development'
      });
    });
    
    // Database statistics
    this.app.get('/health/database', async (req, res) => {
      if (!database.isConnected()) {
        return res.status(503).json({
          success: false,
          error: 'Database not connected'
        });
      }
      
      const health = await database.healthCheck();
      const stats = database.getStatistics();
      
      return res.json({
        success: true,
        data: {
          health,
          statistics: stats
        }
      });
    });
    
    // Test database operations
    this.app.get('/test/database', async (req, res) => {
      try {
        const user = await database.insert('users', {
          name: 'Test User',
          email: 'test@orus.com',
          role: 'developer'
        });

        const found = await database.findById('users', user.id);
        const updated = await database.update('users', user.id, {
          name: 'Updated User'
        });
        const count = await database.count('users');
        const stats = database.getStatistics();

        return res.json({
          success: true,
          operations: {
            insert: user,
            find: found,
            update: updated,
            count,
            statistics: stats
          }
        });

      } catch (error: any) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
    
    // ✅ TEST GENERATION ENGINE
    this.app.post('/test/generate', async (req, res) => {
      try {
        const { prompt } = req.body;
        
        if (!prompt) {
          return res.status(400).json({
            success: false,
            error: 'Prompt is required'
          });
        }
        
        const result = await cognitiveGenerationEngine.generate({
          prompt,
          language: 'typescript',
          framework: 'react'
        });
        
        return res.json({
          success: true,
          data: result
        });
        
      } catch (error: any) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
    
    // ✅ TEST CIG ENGINE
    this.app.post('/test/validate', async (req, res) => {
      try {
        const { code, filePath } = req.body;
        
        if (!code) {
          return res.status(400).json({
            success: false,
            error: 'Code is required'
          });
        }
        
        const result = await cigProtocolEngine.validate({
          code,
          filePath: filePath || 'test.ts',
          enableAutoFix: true
        });
        
        return res.json({
          success: true,
          data: result
        });
        
      } catch (error: any) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
    
    // ✅ TEST BLUEPRINT ENGINE  
    this.app.post('/test/blueprint', async (req, res) => {
      try {
        const { content, format } = req.body;
        
        if (!content) {
          return res.status(400).json({
            success: false,
            error: 'Blueprint content is required'
          });
        }
        
        const result = await blueprintEngine.parse({
          content,
          format: format || 'markdown'
        });
        
        return res.json({
          success: true,
          data: result
        });
        
      } catch (error: any) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
    
    // ✅ TEST ORCHESTRATOR (FULL FLOW)
    this.app.post('/test/orchestrate', async (req, res) => {
      try {
        const { workflowType, request } = req.body;
        
        if (!workflowType) {
          return res.status(400).json({
            success: false,
            error: 'Workflow type is required'
          });
        }
        
        const result = await orchestrationEngine.executeWorkflow({
          workflowType,
          request
        });
        
        return res.json({
          success: true,
          data: result
        });
        
      } catch (error: any) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
    
    this.app.use('/api', apiRouter);
    this.app.use(errorHandlerMiddleware.notFound);
    
    console.log('✅ Routes mounted');
  }

  private configureWebSocket(): void {
    console.log('🔌 Configuring WebSocket...');
    
    this.io.on('connection', (socket) => {
      console.log('WebSocket client connected:', socket.id);
      
      socket.on('generate', async (data) => {
        try {
          const result = await cognitiveGenerationEngine.generate(data);
          socket.emit('generation:complete', result);
        } catch (error: any) {
          socket.emit('generation:error', { error: error.message });
        }
      });
      
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
      console.log(`💾 Database: Mock (in-memory)`);
      console.log(`🔧 Engines: Generation, CIG, Blueprint, Orchestrator`);
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
    
    try {
      await database.disconnect();
    } catch (error) {
      console.error('Error disconnecting database:', error);
    }
    
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
