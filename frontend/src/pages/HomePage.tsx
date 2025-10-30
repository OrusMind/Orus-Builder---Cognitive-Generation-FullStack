/**
 * ============================================================================
 * ORUS BUILDER - HOME PAGE (EPIC LANDING)
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-12T11:10:00-03:00
 * LAST_MODIFIED: 2025-10-12T11:10:00-03:00
 * COMPONENT_HASH: orus.frontend.page.home.epic.20251012.HOM9X1Y3
 * 
 * PURPOSE:
 * - Epic landing page com hero section + quick generation
 * - Feature showcase com Trinity AI presentation
 * - Inline prompt input para geração rápida (estilo Lovable)
 * - Multi-language support (pt-BR, en-US, es-ES)
 * - CTA sections e social proof
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: LandingMarketingAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 75
 * - TRINITY_INTEGRATED: Voz (Marketing Communication)
 * ============================================================================
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Code,
  Layers,
  Users,
  Shield,
  ArrowRight,
  CheckCircle,
  Globe,
  Send,
  Loader2,
  Github,
  Twitter,
  Linkedin,
  MessageCircle,
} from 'lucide-react';

// ============================================================================
// I18N - MULTILINGUAL SUPPORT
// ============================================================================

type Language = 'pt-BR' | 'en-US' | 'es-ES';

interface Translations {
  hero: {
    badge: string;
    title: {
      before: string;
      highlight: string;
      after: string;
    };
    subtitle: string;
    cta: {
      primary: string;
      secondary: string;
    };
    prompt: {
      placeholder: string;
      button: string;
      examples: string[];
    };
    stats: {
      projects: string;
      users: string;
      satisfaction: string;
    };
  };
  features: {
    title: string;
    subtitle: string;
    list: Array<{
      title: string;
      description: string;
    }>;
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    copyright: string;
    links: {
      docs: string;
      github: string;
      support: string;
    };
  };
}

const translations: Record<Language, Translations> = {
  'pt-BR': {
    hero: {
      badge: 'Powered by Trinity AI',
      title: {
        before: 'Construa Apps',
        highlight: 'Prontos para Produção',
        after: 'com IA',
      },
      subtitle: 'Transforme suas ideias em aplicações funcionais usando linguagem natural. Trinity AI gera código limpo e mantível com melhores práticas integradas.',
      cta: {
        primary: 'Começar Gratuitamente',
        secondary: 'Ver Exemplos',
      },
      prompt: {
        placeholder: 'Descreva o app que você quer criar... Ex: "Crie um dashboard de vendas com gráficos e tabelas"',
        button: 'Gerar Agora',
        examples: [
          'Criar um blog com comentários',
          'Dashboard de analytics em tempo real',
          'E-commerce com carrinho de compras',
        ],
      },
      stats: {
        projects: 'Projetos Gerados',
        users: 'Desenvolvedores Ativos',
        satisfaction: 'Satisfação',
      },
    },
    features: {
      title: 'Por que escolher o ORUS Builder?',
      subtitle: 'A plataforma de desenvolvimento mais avançada com IA',
      list: [
        {
          title: 'Trinity AI Engine',
          description: 'Três agentes IA especializados (Alma, Cérebro, Voz) trabalham juntos para entender, gerar e comunicar perfeitamente.',
        },
        {
          title: 'Código Pronto para Produção',
          description: 'Gere código TypeScript limpo e type-safe com documentação e testes completos incluídos.',
        },
        {
          title: 'Reconhecimento de Blueprint',
          description: 'Faça upload de seus documentos de design e ORUS gera automaticamente toda a estrutura do projeto.',
        },
        {
          title: 'Geração Instantânea',
          description: 'Gere aplicações completas em minutos, não semanas. Rastreamento de progresso em tempo real incluído.',
        },
        {
          title: 'Colaboração em Tempo Real',
          description: 'Trabalhe em equipe com cursores ao vivo, chat e comentários de código. Perfeito para times distribuídos.',
        },
        {
          title: 'Certificado CIG-2.0',
          description: 'Compiler-Integrity Generation garante zero erros de compilação e saída pronta para produção.',
        },
      ],
    },
    cta: {
      title: 'Pronto para Construir Algo Incrível?',
      subtitle: 'Junte-se a milhares de desenvolvedores construindo com Trinity AI',
      button: 'Iniciar Seu Projeto Gratuito',
    },
    footer: {
      copyright: '© 2025 ORUS Builder. Powered by Trinity AI. Todos os direitos reservados.',
      links: {
        docs: 'Documentação',
        github: 'GitHub',
        support: 'Suporte',
      },
    },
  },
  'en-US': {
    hero: {
      badge: 'Powered by Trinity AI',
      title: {
        before: 'Build',
        highlight: 'Production-Ready',
        after: 'Apps with AI',
      },
      subtitle: 'Transform your ideas into fully functional applications using natural language. Trinity AI generates clean, maintainable code with built-in best practices.',
      cta: {
        primary: 'Start Building Free',
        secondary: 'View Examples',
      },
      prompt: {
        placeholder: 'Describe the app you want to create... Ex: "Create a sales dashboard with charts and tables"',
        button: 'Generate Now',
        examples: [
          'Create a blog with comments',
          'Real-time analytics dashboard',
          'E-commerce with shopping cart',
        ],
      },
      stats: {
        projects: 'Projects Generated',
        users: 'Active Developers',
        satisfaction: 'Satisfaction',
      },
    },
    features: {
      title: 'Why Choose ORUS Builder?',
      subtitle: 'The most advanced AI-powered development platform',
      list: [
        {
          title: 'Trinity AI Engine',
          description: 'Three specialized AI agents (Alma, Cerebro, Voz) work together to understand, generate, and communicate perfectly.',
        },
        {
          title: 'Production-Ready Code',
          description: 'Generate clean, type-safe TypeScript code with complete documentation and tests included.',
        },
        {
          title: 'Blueprint Recognition',
          description: 'Upload your design documents and ORUS automatically generates the entire project structure.',
        },
        {
          title: 'Lightning Fast',
          description: 'Generate complete applications in minutes, not weeks. Real-time progress tracking included.',
        },
        {
          title: 'Real-time Collaboration',
          description: 'Work together with live cursors, chat, and code comments. Perfect for distributed teams.',
        },
        {
          title: 'CIG-2.0 Certified',
          description: 'Compiler-Integrity Generation ensures zero compilation errors and production-ready output.',
        },
      ],
    },
    cta: {
      title: 'Ready to Build Something Amazing?',
      subtitle: 'Join thousands of developers building with Trinity AI',
      button: 'Start Your Free Project',
    },
    footer: {
      copyright: '© 2025 ORUS Builder. Powered by Trinity AI. All rights reserved.',
      links: {
        docs: 'Docs',
        github: 'GitHub',
        support: 'Support',
      },
    },
  },
  'es-ES': {
    hero: {
      badge: 'Powered by Trinity AI',
      title: {
        before: 'Construye Apps',
        highlight: 'Listas para Producción',
        after: 'con IA',
      },
      subtitle: 'Transforma tus ideas en aplicaciones funcionales usando lenguaje natural. Trinity AI genera código limpio y mantenible con mejores prácticas integradas.',
      cta: {
        primary: 'Empezar Gratis',
        secondary: 'Ver Ejemplos',
      },
      prompt: {
        placeholder: 'Describe la app que quieres crear... Ej: "Crear un dashboard de ventas con gráficos y tablas"',
        button: 'Generar Ahora',
        examples: [
          'Crear un blog con comentarios',
          'Dashboard de analytics en tiempo real',
          'E-commerce con carrito de compras',
        ],
      },
      stats: {
        projects: 'Proyectos Generados',
        users: 'Desarrolladores Activos',
        satisfaction: 'Satisfacción',
      },
    },
    features: {
      title: '¿Por qué elegir ORUS Builder?',
      subtitle: 'La plataforma de desarrollo más avanzada con IA',
      list: [
        {
          title: 'Trinity AI Engine',
          description: 'Tres agentes IA especializados (Alma, Cerebro, Voz) trabajan juntos para entender, generar y comunicar perfectamente.',
        },
        {
          title: 'Código Listo para Producción',
          description: 'Genera código TypeScript limpio y type-safe con documentación y tests completos incluidos.',
        },
        {
          title: 'Reconocimiento de Blueprint',
          description: 'Sube tus documentos de diseño y ORUS genera automáticamente toda la estructura del proyecto.',
        },
        {
          title: 'Generación Instantánea',
          description: 'Genera aplicaciones completas en minutos, no semanas. Seguimiento de progreso en tiempo real incluido.',
        },
        {
          title: 'Colaboración en Tiempo Real',
          description: 'Trabaja en equipo con cursores en vivo, chat y comentarios de código. Perfecto para equipos distribuidos.',
        },
        {
          title: 'Certificado CIG-2.0',
          description: 'Compiler-Integrity Generation garantiza cero errores de compilación y salida lista para producción.',
        },
      ],
    },
    cta: {
      title: '¿Listo para Construir Algo Increíble?',
      subtitle: 'Únete a miles de desarrolladores construyendo con Trinity AI',
      button: 'Iniciar Tu Proyecto Gratis',
    },
    footer: {
      copyright: '© 2025 ORUS Builder. Powered by Trinity AI. Todos los derechos reservados.',
      links: {
        docs: 'Docs',
        github: 'GitHub',
        support: 'Soporte',
      },
    },
  },
};

// ============================================================================
// HOME PAGE COMPONENT
// ============================================================================

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Language state - Auto-detect from browser or manual selection
  const [language, setLanguage] = useState<Language>(() => {
    const browserLang = navigator.language;
    if (browserLang.startsWith('pt')) return 'pt-BR';
    if (browserLang.startsWith('es')) return 'es-ES';
    return 'en-US';
  });
  
  const t = translations[language];
  
  // Quick generation state
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleQuickGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate generation (replace with real API call)
    setTimeout(() => {
      navigate('/generate', { state: { prompt } });
    }, 1000);
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ===================================================================
          NAVIGATION
          =================================================================== */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 shadow-glow" />
              <div>
                <span className="text-xl font-heading font-bold gradient-text">
                  ORUS Builder
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Powered by Trinity AI
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="btn-ghost text-sm flex items-center gap-2"
              >
                <option value="pt-BR">🇧🇷 Português</option>
                <option value="en-US">🇺🇸 English</option>
                <option value="es-ES">🇪🇸 Español</option>
              </select>

              <button
                onClick={() => navigate('/dashboard')}
                className="btn-ghost"
              >
                Dashboard
              </button>
              
              <button
                onClick={() => navigate('/generate')}
                className="btn-primary"
              >
                <Zap className="w-4 h-4" />
                {t.hero.cta.primary}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===================================================================
          HERO SECTION
          =================================================================== */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              {t.hero.badge}
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold max-w-5xl mx-auto leading-tight">
              {t.hero.title.before}{' '}
              <span className="gradient-text">
                {t.hero.title.highlight}
              </span>{' '}
              {t.hero.title.after}
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              {t.hero.subtitle}
            </p>

            {/* Quick Generation Input (Lovable-style) */}
            <div className="max-w-4xl mx-auto mt-8">
              <div className="glass-card p-6 space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleQuickGenerate()}
                    placeholder={t.hero.prompt.placeholder}
                    className="input flex-1"
                    disabled={isGenerating}
                  />
                  <button
                    onClick={handleQuickGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="btn-primary px-8"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t.hero.prompt.button}
                      </>
                    )}
                  </button>
                </div>

                {/* Example prompts */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t.hero.prompt.examples[0].split(' ')[0]}:
                  </span>
                  {t.hero.prompt.examples.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => handleExampleClick(example)}
                      className="badge-primary text-xs hover:scale-105 transition-transform cursor-pointer"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('/generate')}
                className="btn-primary btn px-8 py-4 text-lg"
              >
                <Zap className="w-5 h-5" />
                {t.hero.cta.primary}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-secondary btn px-8 py-4 text-lg"
              >
                {t.hero.cta.secondary}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12">
              <div>
                <div className="text-4xl font-bold gradient-text">12.5K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t.hero.stats.projects}
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text">2.8K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t.hero.stats.users}
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t.hero.stats.satisfaction}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-primary-200 dark:border-primary-800 shadow-elevated">
              <div className="aspect-video bg-gradient-mesh opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Sparkles className="w-20 h-20 text-primary-600 mx-auto animate-float" />
                  <p className="text-gray-700 dark:text-gray-300 text-lg">
                    Demo Preview Coming Soon
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          FEATURES SECTION
          =================================================================== */}
      <section className="py-20 px-6 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.list.map((feature, i) => (
              <FeatureCard
                key={i}
                icon={[Sparkles, Code, Layers, Zap, Users, Shield][i]}
                title={feature.title}
                description={feature.description}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================
          CTA SECTION
          =================================================================== */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-2xl bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 shadow-glow-lg"
          >
            <h2 className="text-4xl font-heading font-bold text-white mb-4">
              {t.cta.title}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {t.cta.subtitle}
            </p>
            <button
              onClick={() => navigate('/generate')}
              className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg shadow-lg"
            >
              {t.cta.button}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          FOOTER
          =================================================================== */}
      <footer className="py-12 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600" />
              <span className="font-heading font-bold gradient-text">
                ORUS Builder
              </span>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {t.footer.copyright}
            </p>

            {/* Links */}
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
              >
                {t.footer.links.docs}
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
              >
                {t.footer.links.support}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ============================================================================
// FEATURE CARD COMPONENT
// ============================================================================

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="card-hover p-6"
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 flex items-center justify-center text-white mb-4 shadow-glow">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-heading font-bold mb-2">{title}</h3>
    <p className="text-gray-700 dark:text-gray-300">{description}</p>
  </motion.div>
);

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: HomePage (Epic landing page with multilingual support)
 * NAMED_EXPORTS: None
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
