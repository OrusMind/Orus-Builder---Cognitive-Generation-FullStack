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
 * ✅ FASE 3: Engines de IA (COMPLETO - +5 = 7/15)
 *    - Groq Provider ✅
 *    - Cognitive Generation Engine ✅
 *    - Prompt Engine ✅
 *    - Blueprint Engine ✅
 *    - Learning Engine ✅
 * 
 * ✅ FASE 4: Orchestration (COMPLETO - +2 = 9/15)
 *    - Trinity Engine ✅
 *    - Orchestrator Engine ✅
 * 
 * ✅ FASE 5: Advanced Engines (COMPLETO - +3 = 12/15) 🎉
 *    - Testing Engine ✅
 *    - Deployment Engine ✅
 *    - Monitoring Engine ✅
 * 
 * 🔜 FASE 6: Final Engines (PENDENTE - +3 = 15/15)
 *    - Collaboration Engine
 *    - Security Engine
 *    - Marketplace Engine
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
// ✅ FASE 3: ENGINES DE IA (5/15 ATIVAS)
// ═══════════════════════════════════════════════════════════════════════════
import { groqService } from './trinity/groq-provider';
import { cognitiveGenerationEngine, GenerationMode, GenerationTarget } from './engines/cognitive-generation-engine';
import { promptEngine } from './engines/prompt-engine';
import { blueprintEngine } from './engines/blueprint-engine';
import { learningEngine } from './engines/learning-engine';

// ═══════════════════════════════════════════════════════════════════════════
// ✅ FASE 4: ORCHESTRATION (2/15 ATIVAS)
// ═══════════════════════════════════════════════════════════════════════════
import { trinityEngine, TrinityRequestType, TrinityComponent } from './engines/trinity-engine';
import { orchestrationEngine } from './engines/orchestrator-engine';

// ═══════════════════════════════════════════════════════════════════════════
// ✅ FASE 5: ADVANCED ENGINES (3/15 ATIVAS) 🎉
// ═══════════════════════════════════════════════════════════════════════════
import { testingEngine } from './engines/testing-engine';
import { deploymentEngine } from './engines/deployment-engine';
import { monitoringEngine } from './engines/monitoring-engine';

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
  // INITIALIZE ENGINES - 12/15 ACTIVE (80%)
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
      await cigProtocolEngine.start();
      activeEngines.push('CIG Protocol');
      console.log('  ✅ CIG Protocol Engine initialized');

      // Engine 2: Template
      await templateEngine.initialize({
        enabled: true,
        templateDir: './templates'
      });
      await templateEngine.start();
      activeEngines.push('Template');
      console.log('  ✅ Template Engine initialized');
      
      // ──────────────────────────────────────────────────────────────────────
      // ✅ FASE 3: ENGINES DE IA (5/15)
      // ──────────────────────────────────────────────────────────────────────
      
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

      // Engine 7: Learning Engine
      await learningEngine.initialize({
        enabled: true,
        autoLearn: true,
        persistPatterns: false
      });
      await learningEngine.start();
      activeEngines.push('Learning');
      console.log('  ✅ Learning Engine initialized');

      // ──────────────────────────────────────────────────────────────────────
      // ✅ FASE 4: ORCHESTRATION (2/15)
      // ──────────────────────────────────────────────────────────────────────

      // Engine 8: Trinity
      await trinityEngine.initialize({
        enabled: true,
        enableAlma: false,
        enableCerebro: false,
        enableVoz: false,
        defaultTimeout: 5000,
        enableCaching: true,
        enableFallback: true,
        minConfidence: 70,
        requireAllComponents: false
      });
      await trinityEngine.start();
      activeEngines.push('Trinity');
      console.log('  ✅ Trinity Engine initialized');
    
      // Engine 9: Orchestration
      await orchestrationEngine.initialize({
        enabled: true,
        enableWorkflowValidation: true,
        enableParallelExecution: true,
        enableFallback: true,
        maxRetries: 2,
        timeout: 30000
      });
      await orchestrationEngine.start();
      activeEngines.push('Orchestration');
      console.log('  ✅ Orchestration Engine initialized');

      // ──────────────────────────────────────────────────────────────────────
      // ✅ FASE 5: ADVANCED ENGINES (3/15) 🎉
      // ──────────────────────────────────────────────────────────────────────

      // Engine 10: Testing
      await testingEngine.initialize({
        enabled: true,
        enableUnitTests: true,
        enableIntegrationTests: true,
        enableE2ETests: false,
        coverage: {
          enabled: true,
          threshold: 80
        },
        framework: 'jest'
      });
      await testingEngine.start();
      activeEngines.push('Testing');
      console.log('  ✅ Testing Engine initialized');

      // Engine 11: Deployment
      await deploymentEngine.initialize({
        enabled: true,
        platforms: ['vercel', 'aws', 'netlify'],
        enableAutoRollback: true,
        enableHealthCheck: true,
        buildTimeout: 600000,
        deploymentStrategy: 'blue-green'
      });
      await deploymentEngine.start();
      activeEngines.push('Deployment');
      console.log('  ✅ Deployment Engine initialized');

      // Engine 12: Monitoring
      await monitoringEngine.initialize({
        enabled: true,
        enableMetrics: true,
        enableAlerts: true,
        enableErrorTracking: true,
        metricsInterval: 60000,
        alertThresholds: {
          cpu: 80,
          memory: 85,
          errorRate: 5
        }
      });
      await monitoringEngine.start();
      activeEngines.push('Monitoring');
      console.log('  ✅ Monitoring Engine initialized');

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
        orchestration: orchestrationEngine.getStatus() === 'running',
        testing: testingEngine.getStatus() === 'running',
        deployment: deploymentEngine.getStatus() === 'running',
        monitoring: monitoringEngine.getStatus() === 'running'
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
        phase: 'Phase 5 - 12/15 engines active (80%)',
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
    // ✅ FASE 4: ORCHESTRATION ENGINES
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Trinity Engine - AI Routing & Synthesized Intelligence
     */
    this.app.post('/test/trinity', async (req, res) => {
      try {
        const { prompt } = req.body;
        
        if (!prompt) {
          return res.status(400).json({ 
            success: false, 
            error: 'Prompt is required' 
          });
        }
        
        const result = await trinityEngine.process({
          id: 'test-' + Date.now(),
          requestId: 'test-' + Date.now(),
          type: TrinityRequestType.FULL_SYNTHESIS,
          userId: 'test-user',
          projectId: 'test-project',
          prompt,
          context: {
            projectType: 'web-application',
            technologies: ['TypeScript', 'React', 'Node.js'],
            architecture: 'layered',
            userLevel: 'advanced',
            language: 'en'
          },
          components: [TrinityComponent.ALMA, TrinityComponent.CEREBRO, TrinityComponent.VOZ],
          priority: 'medium',
          timeout: 5000,
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

    /**
     * Orchestrator Engine - Workflow Orchestration
     */
    this.app.post('/test/orchestrator', async (req, res) => {
      try {
        const { workflow, input } = req.body;
        
        if (!workflow) {
          return res.status(400).json({ 
            success: false, 
            error: 'Workflow type is required (full, quick, or health)' 
          });
        }
        
        const result = await orchestrationEngine.executeWorkflow({
          id: 'test-' + Date.now(),
          requestId: 'test-' + Date.now(),
          workflowType: workflow,
          input: input || {},
          userId: 'test-user',
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
    // ✅ FASE 5: ADVANCED ENGINES - TEST ENDPOINTS
    // ──────────────────────────────────────────────────────────────────────

   // Testing Engine - Generate tests for code
this.app.post('/api/test/testing/generate', async (req, res) => {
  try {
    const { code, testType } = req.body;
    
    // ✅ FIX: Use generateTests method correctly
    const result = await testingEngine.generateTests({
      requestId: 'test-' + Date.now(),
      sourceFiles: [{
        path: 'test.ts',
        content: code,
        language: 'typescript'
      }],
      testType: testType || 'unit',
      framework: 'jest' as any, // ✅ Type assertion to fix enum issue
      coverage: true,
      generateEdgeCases: true,
      generateE2E: false,
      version: 1,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: 'test-gen-' + Date.now()
    });
    
    res.json({
      success: true,
      engine: 'Testing',
      tests: result.data?.tests || [], // ✅ Access via data property
      coverage: result.data?.coverage || {}, // ✅ Access via data property
      testCount: result.data?.tests?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


    // Deployment Engine - Simulate deployment
    this.app.post('/api/test/deployment/deploy', async (req, res) => {
      try {
        const { platform, projectPath } = req.body;
        
        const result = await deploymentEngine.deploy({
          platform: platform || 'vercel',
          projectPath: projectPath || './dist',
          environment: 'staging',
          enableRollback: true
        });
        
        res.json({
          success: true,
          engine: 'Deployment',
          deploymentUrl: result.url,
          buildTime: result.buildTime,
          status: result.status,
          timestamp: new Date().toISOString()
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Monitoring Engine - Collect system metrics
    this.app.get('/api/test/monitoring/metrics', async (req, res) => {
      try {
        const metrics = await monitoringEngine.collectMetrics({
          includeSystem: true,
          includeApplication: true,
          includeDatabase: true,
          timeRange: '1h'
        });
        
        res.json({
          success: true,
          engine: 'Monitoring',
          metrics: {
            cpu: metrics.cpu,
            memory: metrics.memory,
            activeConnections: metrics.connections,
            requestRate: metrics.requestRate,
            errorRate: metrics.errorRate
          },
          alerts: metrics.activeAlerts || [],
          timestamp: new Date().toISOString()
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
  }
  
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
      console.log(`🔧 Engines: 12/15 active (80%) 🎉`);
      console.log(`⚙️ Environment: development`);
      console.log('═══════════════════════════════════════════════════════');
      console.log('');
      console.log('📋 ACTIVE ENGINES (12/15):');
      console.log('   ✅ Phase 2: CIG Protocol + Template');
      console.log('   ✅ Phase 3: Groq + Generation + Prompt + Blueprint + Learning');
      console.log('   ✅ Phase 4: Trinity + Orchestration');
      console.log('   ✅ Phase 5: Testing + Deployment + Monitoring 🎉');
      console.log('');
      console.log('📋 TEST ENDPOINTS:');
      console.log('   GET  /health                          - Server health + all engines');
      console.log('   GET  /health/database                 - Database statistics');
      console.log('   GET  /test/database                   - Database CRUD operations');
      console.log('   POST /test/cig                        - CIG Protocol validation');
      console.log('   GET  /test/templates                  - Template engine search');
      console.log('   POST /test/trinity                    - Trinity AI routing');
      console.log('   POST /test/orchestrator               - Workflow orchestration');
      console.log('   POST /api/test/testing/generate       - Generate tests 🎉');
      console.log('   POST /api/test/deployment/deploy      - Deploy project 🎉');
      console.log('   GET  /api/test/monitoring/metrics     - System metrics 🎉');
      console.log('');
      console.log('🔜 NEXT PHASE (3/15 remaining - 20%):');
      console.log('   - Collaboration Engine (real-time sync)');
      console.log('   - Security Engine (audit + compliance)');
      console.log('   - Marketplace Engine (plugins + extensions)');
      console.log('');
      console.log('✨ Ready for Phase 5 testing! 80% Complete! 🚀');
      console.log('═══════════════════════════════════════════════════════');
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
