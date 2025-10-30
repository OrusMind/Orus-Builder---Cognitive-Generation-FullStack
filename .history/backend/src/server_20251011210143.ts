/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - EXPRESS SERVER
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ESTRUTURA DE TESTES POR FASES:
 * 
 * ✅ FASE 1: Database + Infrastructure (COMPLETO)
 *    - Mock Database
 *    - Middleware (Auth, Logs, Rate Limit)
 *    - WebSocket
 * 
 * ✅ FASE 2: Engines Básicas (COMPLETO - 2/15)
 *    - CIG Protocol Engine
 *    - Template Engine
 * 
 * 🔜 FASE 3: Engines de IA (PRÓXIMA - +2)
 *    - Groq Provider
 *    - Generation Engine
 *    - Blueprint Recognition Engine
 * 
 * 🔜 FASE 4: Orchestration (PENDENTE - +2)
 *    - Orchestrator Engine
 *    - Trinity Engine
 * 
 * 🔜 FASE 5: Advanced Engines (PENDENTE - +9)
 *    - Collaboration, Deployment, Testing, etc.
 * 
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

// ═══════════════════════════════════════════════════════════════════════════
// ✅ FASE 2: ENGINES BÁSICAS (2/15 ATIVAS)
// ═══════════════════════════════════════════════════════════════════════════
import { cigProtocolEngine } from './engines/cig-engine';
import { templateEngine, TemplateType } from './engines/template-engine';

// ═══════════════════════════════════════════════════════════════════════════
// 🔜 FASE 3: ADICIONAR AQUI (Descomente quando Groq estiver configurado)
// ═══════════════════════════════════════════════════════════════════════════
// import { groqProvider } from './providers/groq-provider';
// import { cognitiveGenerationEngine } from './engines/cognitive-generation-engine';
// import { blueprintEngine } from './engines/blueprint-engine';

// ═══════════════════════════════════════════════════════════════════════════
// 🔜 FASE 4: ADICIONAR AQUI (Após Fase 3 completa)
// ═══════════════════════════════════════════════════════════════════════════
// import { orchestrationEngine } from './engines/orchestrator-engine';
// import { trinityEngine } from './engines/trinity-engine';

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
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ FASE 1: DATABASE CONNECTION
  // ═══════════════════════════════════════════════════════════════════════════
  private async connectDatabase(): Promise<void> {
    try {
      await database.connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZE ENGINES (Adicione novas engines aqui)
  // ═══════════════════════════════════════════════════════════════════════════
  private async initializeEngines(): Promise<void> {
    const activeEngines = [];
    const totalEngines = 15;
    
    console.log('🔧 Initializing Engines...');
    
    try {
      // ──────────────────────────────────────────────────────────────────────
      // ✅ FASE 2: ENGINES BÁSICAS (2/15)
      // ──────────────────────────────────────────────────────────────────────
      
      // Engine 1: CIG Protocol
      await cigProtocolEngine.initialize({
        enabled: true,
        enableAutoFix: true,
        strictMode: false
      });
      activeEngines.push('CIG Protocol');
      console.log('  ✅ CIG Protocol Engine initialized');
      
      // Engine 2: Template
      await templateEngine.initialize({
        enabled: true,
        templateDir: './templates'
      });
      activeEngines.push('Template');
      console.log('  ✅ Template Engine initialized');
      
      // ──────────────────────────────────────────────────────────────────────
      // 🔜 FASE 3: ENGINES DE IA (Descomente após configurar Groq)
      // ──────────────────────────────────────────────────────────────────────
      /*
      // Engine 3: Groq Provider
      await groqProvider.initialize({
        apiKey: process.env.GROQ_API_KEY!,
        model: 'llama-3.1-70b-versatile',
        maxTokens: 8000,
        temperature: 0.7
      });
      activeEngines.push('Groq Provider');
      console.log('  ✅ Groq Provider initialized');
      
      // Engine 4: Generation
      await cognitiveGenerationEngine.initialize({
        enabled: true,
        aiProvider: groqProvider,
        enableLearning: true
      });
      activeEngines.push('Generation');
      console.log('  ✅ Generation Engine initialized');
      
      // Engine 5: Blueprint Recognition
      await blueprintEngine.initialize({
        enabled: true,
        aiProvider: groqProvider,
        enableAutoValidation: true
      });
      activeEngines.push('Blueprint');
      console.log('  ✅ Blueprint Engine initialized');
      */
      
      // ──────────────────────────────────────────────────────────────────────
      // 🔜 FASE 4: ORCHESTRATION (Após Fase 3)
      // ──────────────────────────────────────────────────────────────────────
      /*
      // Engine 6: Orchestrator
      await orchestrationEngine.initialize({
        enabled: true
      });
      activeEngines.push('Orchestrator');
      console.log('  ✅ Orchestrator Engine initialized');
      
      // Engine 7: Trinity
      await trinityEngine.initialize({
        enabled: true,
        providers: ['groq', 'claude', 'openai']
      });
      activeEngines.push('Trinity');
      console.log('  ✅ Trinity Engine initialized');
      */
      
      console.log(`\n✅ ${activeEngines.length}/${totalEngines} Engines active: ${activeEngines.join(', ')}`);
      
    } catch (error) {
      console.error('⚠️ Engine initialization failed:', error);
      console.log('⚠️ Server will run with limited functionality');
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ FASE 1: MIDDLEWARE CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════
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
  
  // ═══════════════════════════════════════════════════════════════════════════
  // MOUNT ROUTES (Adicione novos endpoints aqui)
  // ═══════════════════════════════════════════════════════════════════════════
  private mountRoutes(): void {
    console.log('🛣️ Mounting routes...');
    
    // ──────────────────────────────────────────────────────────────────────
    // ✅ FASE 1: SYSTEM HEALTH & DATABASE
    // ──────────────────────────────────────────────────────────────────────
    
    // Health check
    this.app.get('/health', async (req, res) => {
      const dbHealth = await database.healthCheck();
      
      const enginesStatus = {
        cig: cigProtocolEngine.getStatus() === 'running',
        template: templateEngine.getStatus() === 'running',
        // 🔜 Descomente quando adicionar Fase 3:
        // generation: cognitiveGenerationEngine.getStatus() === 'running',
        // blueprint: blueprintEngine.getStatus() === 'running',
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
        phase: 'Phase 2 - 2/15 engines active',
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
        data: { health, statistics: stats }
      });
    });
    
    // Database CRUD test
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
          operations: { insert: user, find: found, update: updated, count, statistics: stats }
        });

      } catch (error: any) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
    
    // ──────────────────────────────────────────────────────────────────────
    // ✅ FASE 2: BASIC ENGINES (CIG + Template)
    // ──────────────────────────────────────────────────────────────────────
    
    // ✅ TEST CIG ENGINE - APENAS CAMPOS VÁLIDOS
this.app.post('/test/cig', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      });
    }
    
    // ✅ Somente campos que existem na interface
    const result = await cigProtocolEngine.validate({
      requestId: `test-${Date.now()}`,
      files: [{
        path: 'test.ts',
        content: code,
        dependencies: []
      }],
      language: 'en',
      id: 'test-validation',
      projectId: 'test-project',
      timestamp: new Date()
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

    
    // Template Engine test
    this.app.get('/test/templates', async (req, res) => {
      try {
        const templates = await templateEngine.searchTemplates({
          type: TemplateType.COMPONENT,
          language: 'typescript'
        });
        
        return res.json({
          success: true,
          data: {
            total: templates.length,
            templates: templates.slice(0, 5)
          }
        });
        
      } catch (error: any) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
    
    // ──────────────────────────────────────────────────────────────────────
    // 🔜 FASE 3: AI ENGINES (Descomente após configurar Groq)
    // ──────────────────────────────────────────────────────────────────────
    /*
    // Generation Engine test
    this.app.post('/test/generate', async (req, res) => {
      try {
        const { prompt, type } = req.body;
        
        if (!prompt) {
          return res.status(400).json({
            success: false,
            error: 'Prompt is required'
          });
        }
        
        const result = await cognitiveGenerationEngine.generate({
          prompt,
          type: type || 'component',
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
    
    // Blueprint Recognition test
    this.app.post('/test/blueprint', async (req, res) => {
      try {
        const { content, format } = req.body;
        
        if (!content) {
          return res.status(400).json({
            success: false,
            error: 'Blueprint content is required'
          });
        }
        
        const result = await blueprintEngine.recognize({
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
    */
    
    // ──────────────────────────────────────────────────────────────────────
    // 🔜 FASE 4: ORCHESTRATION (Após Fase 3)
    // ──────────────────────────────────────────────────────────────────────
    /*
    // Orchestrator test (full workflow)
    this.app.post('/test/orchestrate', async (req, res) => {
      try {
        const { workflowType, request } = req.body;
        
        const result = await orchestrationEngine.execute({
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
    */
    
    this.app.use('/api', apiRouter);
    this.app.use(errorHandlerMiddleware.notFound);
    
    console.log('✅ Routes mounted');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ FASE 1: WEBSOCKET CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════
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
      console.log(`💾 Database: Mock (in-memory)`);
      console.log(`🔧 Engines: 2/15 active (CIG + Template)`);
      console.log(`⚙️ Environment: development`);
      console.log('═══════════════════════════════════════════════════════');
      console.log('');
      console.log('📋 FASE 2 - Test Endpoints Available:');
      console.log('   GET  /health           - Server health + engines status');
      console.log('   GET  /health/database  - Database statistics');
      console.log('   GET  /test/database    - Database CRUD operations');
      console.log('   POST /test/cig         - CIG engine validation');
      console.log('   GET  /test/templates   - Template engine search');
      console.log('');
      console.log('🔜 FASE 3 - Next (After Groq config):');
      console.log('   POST /test/generate    - Generation engine');
      console.log('   POST /test/blueprint   - Blueprint recognition');
      console.log('');
      console.log('✨ Ready for Phase 2 testing!');
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
