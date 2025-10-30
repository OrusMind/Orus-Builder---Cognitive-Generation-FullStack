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
 * ✅ FASE 3: Engines de IA (ATIVO - +4 = 6/15)
 *    - Groq Provider ✅
 *    - Cognitive Generation Engine ✅
 *    - Prompt Engine ✅
 *    - Blueprint Engine ✅
 * 
 * 🔜 FASE 4: Orchestration (PRÓXIMO - +2)
 *    - Trinity Engine
 *    - Orchestrator Engine
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
// ✅ FASE 3: ENGINES DE IA (4/15 ATIVAS)
// ═══════════════════════════════════════════════════════════════════════════
import { groqService } from './trinity/groq-provider';
import { cognitiveGenerationEngine, GenerationMode, GenerationTarget } from './engines/cognitive-generation-engine';
import { promptEngine } from './engines/prompt-engine';
import { blueprintEngine } from './engines/blueprint-engine';
import { learningEngine } from './engines/learning-engine'; // ✅ ADICIONAR
// ═══════════════════════════════════════════════════════════════════════════
// 🔜 FASE 4: ORCHESTRATION (Descomente quando ready)
// ═══════════════════════════════════════════════════════════════════════════
 import { trinityEngine } from './engines/trinity-engine';
// import { orchestrationEngine } from './engines/orchestrator-engine';

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
  // INITIALIZE ENGINES
  // ═══════════════════════════════════════════════════════════════════════════
  private async initializeEngines(): Promise<void> {
    const totalEngines = 15;
const activeEngines: string[] = [];

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
await cigProtocolEngine.start(); // ✅ ADICIONAR ESTA LINHA
activeEngines.push('CIG Protocol');
console.log('  ✅ CIG Protocol Engine initialized');

     await templateEngine.initialize({
  enabled: true,
  templateDir: './templates'
});
await templateEngine.start(); // ✅ ADICIONAR ESTA LINHA
activeEngines.push('Template');
console.log('  ✅ Template Engine initialized');
      
      // ──────────────────────────────────────────────────────────────────────
      // ✅ FASE 3: ENGINES DE IA (4/15)
      // ──────────────────────────────────────────────────────────────────────
      
      // Engine 3: Groq Provider
// Engine 3: Groq Provider (já inicializado no import)
activeEngines.push('Groq Provider');
console.log('  ✅ Groq Provider initialized');

      // Engine 4: Cognitive Generation
      await cognitiveGenerationEngine.initialize({
        enabled: true,
        enableTrinity: false,
        enableCIG: true,
        enableLearning: false,
        aiProvider: 'claude',
        aiModel: process.env['GROQ_MODEL'] || 'llama-3.3-70b-versatile',
        temperature: 0.3,
        maxTokens: 4096,
        minConfidence: 70,
        requireValidation: false,
        enableCaching: false,
        parallelGeneration: false,
        maxRetries: 2
      });
      await cognitiveGenerationEngine.start();
      activeEngines.push('Cognitive Generation');
      console.log('  ✅ Cognitive Generation Engine initialized');
      
      // Engine 5: Prompt Engine
      await promptEngine.initialize({
        enabled: true,
        aiProvider: 'groq',
        enableNLP: true,
        enableIntentDetection: true
      });
      await promptEngine.start();
      activeEngines.push('Prompt');
      console.log('  ✅ Prompt Engine initialized');
      
      // Engine 6: Blueprint Engine
await blueprintEngine.initialize({
  enabled: true,
  enableAutoValidation: true,
  supportedFormats: ['markdown', 'docx', 'json']
});
await blueprintEngine.start();
activeEngines.push('Blueprint');
console.log('  ✅ Blueprint Engine initialized');

// Engine 7: Learning Engine ✅ ADICIONAR
await learningEngine.initialize({
  enabled: true,
  autoLearn: true,
  persistPatterns: false
});
await learningEngine.start();
activeEngines.push('Learning');
console.log('  ✅ Learning Engine initialized');

await trinityEngine.initialize({
  enabled: true,
  enableAlma: false, // ← Desativado por enquanto (stub)
  enableCerebro: false, // ← Desativado por enquanto (stub)
  enableVoz: false, // ← Desativado por enquanto (stub)
  defaultTimeout: 5000,
  enableCaching: true,
  enableFallback: true,
  minConfidence: 70,
  requireAllComponents: false
});
await trinityEngine.start();
activeEngines.push('Trinity');
console.log('  ✅ Trinity Engine initialized');
      
      console.log(`\n✅ ${activeEngines.length}/${totalEngines} Engines active: ${activeEngines.join(', ')}`);
      
    } catch (error) {
      console.error('⚠️ Engine initialization error:', error);
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
  // MOUNT ROUTES
  // ═══════════════════════════════════════════════════════════════════════════
  private mountRoutes(): void {
    console.log('🛣️ Mounting routes...');
    
    // ──────────────────────────────────────────────────────────────────────
    // ✅ SYSTEM HEALTH
    // ──────────────────────────────────────────────────────────────────────
    this.app.get('/health', async (req, res) => {
      const dbHealth = await database.healthCheck();
      
const enginesStatus = {
  cig: cigProtocolEngine.getStatus() === 'running',
  template: templateEngine.getStatus() === 'running',
  groq: true,
  generation: cognitiveGenerationEngine.getStatus() === 'running',
  prompt: promptEngine.getStatus() === 'running',
  blueprint: blueprintEngine.getStatus() === 'running',
  learning: learningEngine.getStatus() === 'running',  
    trinity: trinityEngine.getStatus() === 'running',
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
        phase: 'Phase 3 - 6/15 engines active',
        mode: 'development'
      });
    });
    
    // ──────────────────────────────────────────────────────────────────────
    // ✅ DATABASE ROUTES
    // ──────────────────────────────────────────────────────────────────────
    this.app.get('/health/database', async (req, res) => {
      if (!database.isConnected()) {
        return res.status(503).json({ success: false, error: 'Database not connected' });
      }
      
      const health = await database.healthCheck();
      const stats = database.getStatistics();
      
      return res.json({ success: true, data: { health, statistics: stats } });
    });
    
    this.app.get('/test/database', async (req, res) => {
      try {
        const user = await database.insert('users', {
          name: 'Test User',
          email: 'test@orus.com',
          role: 'developer'
        });

        const found = await database.findById('users', user.id);
        const updated = await database.update('users', user.id, { name: 'Updated User' });
        const count = await database.count('users');
        const stats = database.getStatistics();

        return res.json({
          success: true,
          operations: { insert: user, find: found, update: updated, count, statistics: stats }
        });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
      }
    });
    
    // ──────────────────────────────────────────────────────────────────────
    // ✅ FASE 2: BASIC ENGINES
    // ──────────────────────────────────────────────────────────────────────
    this.app.post('/test/cig', async (req, res) => {
      try {
        const { code } = req.body;
        
        if (!code) {
          return res.status(400).json({ success: false, error: 'Code is required' });
        }
        
        const result = await cigProtocolEngine.validate({
          requestId: `test-${Date.now()}`,
          files: [{
            path: 'test.ts',
            content: code,
            dependencies: []
          }],
          options: {
            enableDGI: true,
            enablePTI: true,
            enableCET: true,
            enableSPI: true,
            enableCCV: true,
            enableTCM: true,
            enablePCA: true,
            enableCLL: true,
            strictValidation: false,
            failOnWarnings: false
          },
          language: 'en' as any,
          id: `validation-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          isDeleted: false,
          projectContext: {
            rootDir: process.cwd(),
            sourceDir: './src',
            tsConfigPath: './tsconfig.json',
            strictMode: false,
            existingFiles: []
          }
        });
        
        return res.json({ success: true, data: result });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
      }
    });
    
    this.app.get('/test/templates', async (req, res) => {
      try {
        const templates = await templateEngine.searchTemplates({
          type: TemplateType.COMPONENT,
          language: 'typescript'
        });
        
        return res.json({
          success: true,
          data: { total: templates.length, templates: templates.slice(0, 5) }
        });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
      }
    });
    
  // ──────────────────────────────────────────────────────────────────────
// ✅ FASE 3: AI ENGINES (4/15)
// ──────────────────────────────────────────────────────────────────────

/**
 * Generation Engine - AI Code Generation (Groq Llama 3.3 70B)
 * POST /test/generate
 * Body: { prompt, language?, framework? }
 */
this.app.post('/test/generate', async (req, res) => {
  try {
    const { prompt, language, framework } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }
    
    const result = await cognitiveGenerationEngine.generate({
      id: 'test-' + Date.now(),
      requestId: 'test-' + Date.now(),
      userId: 'test-user',
      mode: GenerationMode.FROM_SPECIFICATION,
      target: GenerationTarget.COMPONENT,
      prompt,
      language: language || 'typescript',
      framework: framework || 'none',
      specification: {
        architecture: {
          style: 'layered',
          layers: ['presentation', 'business', 'data'],
          patterns: ['repository', 'service'],
          justification: 'Test architecture'
        },
        components: [{
          name: 'TestComponent',
          type: 'component',
          purpose: prompt,
          responsibilities: ['Handle business logic'],
          dependencies: [],
          priority: 1
        }],
        technologies: {
          backend: [{
            name: 'TypeScript',
            version: 'latest',
            purpose: 'Type-safe development'
          }],
          frontend: [],
          database: [],
          infrastructure: [],
          tools: []
        }
      },
      version: 1,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Prompt Engine - NLP Analysis & Intent Detection
 * POST /test/prompt
 * Body: { prompt }
 */
this.app.post('/test/prompt', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }
    
    const result = await promptEngine.analyze({
      id: 'test-' + Date.now(),
      requestId: 'test-' + Date.now(),
      userId: 'test-user',
      prompt,
      language: 'en' as 'en',
      version: 1,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Blueprint Engine - Blueprint Recognition & Tree Generation
 * POST /test/blueprint
 * Body: { content, format? }
 */
this.app.post('/test/blueprint', async (req, res) => {
  try {
    const { content, format } = req.body;
    
    if (!content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Blueprint content is required' 
      });
    }
    
    const result = await blueprintEngine.processBlueprint({
      id: 'test-' + Date.now(),
      requestId: 'test-' + Date.now(),
      userId: 'test-user',
      fileName: 'test-blueprint.md',
      fileType: format || 'markdown',
      fileBuffer: Buffer.from(content),
      publishToMarketplace: false,
      version: 1,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ──────────────────────────────────────────────────────────────────────
// ✅ FASE 4: ORCHESTRATION ENGINES (1/15)
// ──────────────────────────────────────────────────────────────────────

/**
 * Trinity Engine - AI Routing & Synthesized Intelligence
 * POST /test/trinity
 * Body: { prompt, type?, mode? }
 * 
 * Types: general, architecture, code, review, optimization
 * Modes: fast, balanced, deep
 */
this.app.post('/test/trinity', async (req, res) => {
  try {
    const { prompt, type, mode } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        error: 'Prompt is required' 
      });
    }
    
    const result = await trinityEngine.route({
      id: 'test-' + Date.now(),
      requestId: 'test-' + Date.now(),
      type: type || 'general',
      mode: mode || 'balanced',
      prompt,
      context: {
        projectId: 'test-project',
        currentPhase: 'development'
      },
      userId: 'test-user',
      version: 1,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('═══════════════════════════════════════════════════════');
    console.error('❌ TRINITY ENGINE ERROR:');
    console.error('═══════════════════════════════════════════════════════');
    console.error('Prompt:', req.body.prompt);
    console.error('Type:', req.body.type || 'general');
    console.error('Mode:', req.body.mode || 'balanced');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    console.error('═══════════════════════════════════════════════════════');
    
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      details: {
        message: error.message,
        stack: error.stack
      }
    });
  }
});



  
  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ WEBSOCKET
  // ═══════════════════════════════════════════════════════════════════════════
  private configureWebSocket(): void {
    console.log('🔌 Configuring WebSocket...');
    
    this.io.on('connection', (socket) => {
      console.log('WebSocket client connected:', socket.id);
      socket.on('disconnect', () => console.log('WebSocket client disconnected:', socket.id));
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
      console.log(`🔧 Engines: 6/15 active (CIG + Template + Groq + Generation + Prompt + Blueprint)`);
      console.log(`⚙️ Environment: development`);
      console.log('═══════════════════════════════════════════════════════');
      console.log('');
      console.log('📋 FASE 3 - Test Endpoints Available:');
      console.log('   GET  /health             - Server health + engines status');
      console.log('   GET  /health/database    - Database statistics');
      console.log('   GET  /test/database      - Database CRUD operations');
      console.log('   POST /test/cig           - CIG engine validation');
      console.log('   GET  /test/templates     - Template engine search');
      console.log('   POST /test/generate      - Code generation (Groq)');
      console.log('   POST /test/prompt        - Prompt analysis (NLP)');
      console.log('   POST /test/blueprint     - Blueprint parsing');
      console.log('');
      console.log('🔜 FASE 4 - Next:');
      console.log('   - Trinity Engine (AI routing)');
      console.log('   - Orchestrator Engine (workflows)');
      console.log('');
      console.log('✨ Ready for Phase 3 testing!');
      console.log('═══════════════════════════════════════════════════════');
   console.log(`🔧 Engines: 7/15 active (CIG + Template + Groq + Generation + Prompt + Blueprint + Learning)`);
console.log('═══════════════════════════════════════════════════════');
console.log('');
console.log('📋 FASE 3 - Test Endpoints Available:');

    });
    
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }
  
  private async shutdown(): Promise<void> {
    console.log('🛑 Shutting down server gracefully...');
    
    this.httpServer.close(() => console.log('✅ HTTP server closed'));
    
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
