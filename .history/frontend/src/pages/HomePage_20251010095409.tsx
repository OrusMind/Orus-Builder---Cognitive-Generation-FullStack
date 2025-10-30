/**
 * ============================================================================
 * ORUS BUILDER - HOME PAGE (LANDING)
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T09:56:00-03:00
 * LAST_MODIFIED: 2025-10-10T09:56:00-03:00
 * COMPONENT_HASH: orus.frontend.page.home.20251010.HOM7X8Y9
 * 
 * PURPOSE:
 * - Landing page with hero section
 * - Feature showcase
 * - CTA to start building
 * - Trinity AI presentation
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: LandingPageAgent
 * - COGNITIVE_LEVEL: Basic
 * - AUTONOMY_DEGREE: 60
 * - TRINITY_INTEGRATED: None (Marketing)
 * ============================================================================
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Code,
  Layers,
  Users,
  Shield,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@components/common/Button';

// ============================================================================
// HOME PAGE COMPONENT
// ============================================================================

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-cognitive" />
              <span className="text-xl font-bold text-foreground">ORUS Builder</span>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button onClick={() => navigate('/generate')}>
                Start Building
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Powered by Trinity AI
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
              Build{' '}
              <span className="bg-gradient-cognitive bg-clip-text text-transparent">
                Production-Ready
              </span>{' '}
              Apps with AI
            </h1>

            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              Transform your ideas into fully functional applications using natural language.
              Trinity AI generates clean, maintainable code with built-in best practices.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => navigate('/generate')}
                leftIcon={<Zap className="w-5 h-5" />}
              >
                Start Building Free
              </Button>

              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/dashboard')}
              >
                View Examples
              </Button>
            </div>

            <p className="text-sm text-foreground-muted">
              No credit card required • Full TypeScript support • CIG-2.0 certified
            </p>
          </motion.div>

          {/* Hero Image/Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-primary/20 shadow-elevated">
              <div className="aspect-video bg-gradient-cognitive opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-foreground-muted">Demo Preview Coming Soon</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-background-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose ORUS Builder?
            </h2>
            <p className="text-xl text-foreground-muted">
              The most advanced AI-powered development platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Trinity AI Engine"
              description="Three specialized AI agents (Alma, Cerebro, Voz) work together to understand, generate, and communicate perfectly."
            />

            <FeatureCard
              icon={<Code className="w-6 h-6" />}
              title="Production-Ready Code"
              description="Generate clean, type-safe TypeScript code with complete documentation and tests included."
            />

            <FeatureCard
              icon={<Layers className="w-6 h-6" />}
              title="Blueprint Recognition"
              description="Upload your design documents and ORUS automatically generates the entire project structure."
            />

            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Lightning Fast"
              description="Generate complete applications in minutes, not weeks. Real-time progress tracking included."
            />

            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Real-time Collaboration"
              description="Work together with live cursors, chat, and code comments. Perfect for distributed teams."
            />

            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="CIG-2.0 Certified"
              description="Compiler-Integrity Generation ensures zero compilation errors and production-ready output."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-2xl bg-gradient-cognitive"
          >
            <h2 className="text-4xl font-bold text-background mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-background/80 mb-8">
              Join thousands of developers building with Trinity AI
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/generate')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Start Your Free Project
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-primary/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-cognitive" />
              <span className="font-semibold text-foreground">ORUS Builder</span>
            </div>

            <p className="text-sm text-foreground-muted">
              © 2025 ORUS Builder. Powered by Trinity AI. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-sm text-foreground-muted">
              <a href="#" className="hover:text-foreground transition-colors">
                Docs
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
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
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="p-6 rounded-lg bg-background border border-primary/20 hover:border-primary/40 transition-colors"
  >
    <div className="w-12 h-12 rounded-lg bg-gradient-cognitive flex items-center justify-center text-background mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-foreground-muted">{description}</p>
  </motion.div>
);

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: HomePage (Landing page)
 * NAMED_EXPORTS: None
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
