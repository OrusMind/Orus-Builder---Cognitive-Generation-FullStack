/**
 * ============================================================================
 * ORUS BUILDER - DASHBOARD PAGE
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:19:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:19:00-03:00
 * COMPONENT_HASH: orus.frontend.page.dashboard.20251009.DSH7C8D9
 * 
 * PURPOSE:
 * - Main dashboard page with project overview
 * - Quick actions and statistics
 * - Recent activity and generation history
 * - Trinity AI status display
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: DashboardOrchestratorAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 75
 * - TRINITY_INTEGRATED: Full (Status Display)
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Sparkles,
  TrendingUp,
  Activity,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Navigation } from '@components/layout/Navigation';
import { Button } from '@components/common/Button';
import { Loading } from '@components/common/Loading';
import { ProjectCard } from '@components/project/ProjectCard'; 
import { useProjectStore } from '@store/project.store';
import { useAuthStore } from '@store/auth.store';
import generationService from '@services/generation.service';
import toast from 'react-hot-toast';
import { Framework, ProgrammingLanguage, ProjectStatus } from '@/types/api.types';
import type { Project } from '@/types/api.types';
// ============================================================================
// TYPES
// ============================================================================
interface BackendProject {
  id: string;
  name: string;
  description: string;
  framework: string;
  files: any[];
  createdAt: string;
  updatedAt: string;
}
interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalGenerations: number;
  successRate: number;
}

interface TrinityHealth {
  alma: { status: 'online' | 'offline'; latency: number };
  cerebro: { status: 'online' | 'offline'; latency: number };
  voz: { status: 'online' | 'offline'; latency: number };
}

// ============================================================================
// DASHBOARD PAGE COMPONENT
// ============================================================================

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { projects, setProjects, setLoading, isLoading } = useProjectStore();

  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalGenerations: 0,
    successRate: 0,
  });

  const [trinityHealth, setTrinityHealth] = useState<TrinityHealth | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

const loadDashboardData = async () => {
  setLoading(true);

  try {
  // ✅ BUSCAR PROJETOS REAIS DO BACKEND
  const response = await fetch('http://localhost:5000/api/dashboard/projects');
  const projectsData = await response.json();
  
  const realProjects = (projectsData.data || []).map((p: BackendProject) => ({  // ✅ TIPO CORRETO
    id: p.id,
    name: p.name,
    description: p.description,
    framework: p.framework || Framework.REACT,
    language: ProgrammingLanguage.TYPESCRIPT,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    status: ProjectStatus.ACTIVE,
    owner: user?.id || 'current-user-id',
    files: p.files || [],
  }));

  setProjects(realProjects);

  // Stats
  const statsResponse = await fetch('http://localhost:5000/api/dashboard/stats');
  const statsData = await statsResponse.json();

  setStats({
    totalProjects: statsData.data?.totalProjects || realProjects.length,
activeProjects: realProjects.filter((p: Project) => p.status === 'active').length,    totalGenerations: statsData.data?.totalFiles || 0,
    successRate: 95,
  });

  // Trinity health
  const health = await generationService.checkTrinityHealth();
  setTrinityHealth(health);

  // ✅ Activity com tipo correto
  setRecentActivity(
    realProjects.slice(0, 3).map((p: Project) => ({  // ✅ TIPO Project
      id: p.id,
      type: 'generation',
      message: `Generated ${p.name}`,
      timestamp: new Date(p.createdAt),
    }))
  );

  } catch (error) {
    console.error('Failed to load dashboard:', error);
    toast.error('Failed to load dashboard data');
    
    // ✅ FALLBACK para mock se backend falhar
    const mockProjects = [
      {
        id: '1',
        name: 'E-commerce Dashboard',
        description: 'Modern e-commerce admin panel',
        framework: Framework.REACT,
        language: ProgrammingLanguage.TYPESCRIPT,
        createdAt: new Date('2025-10-08').toISOString(),
        updatedAt: new Date('2025-10-09').toISOString(),
        status: ProjectStatus.ACTIVE,
        owner: 'current-user-id',
        files: [],
      },
    ];
    setProjects(mockProjects);
    
    setStats({
      totalProjects: 1,
      activeProjects: 1,
      totalGenerations: 0,
      successRate: 0,
    });
  } finally {
    setLoading(false);
  }
};

  const handleNewProject = () => {
    navigate('/generate');
  };

  if (isLoading) {
    return (
      <Navigation>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loading variant="neural" size="lg" message="Loading dashboard..." />
        </div>
      </Navigation>
    );
  }

  return (
    <Navigation>
      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold text-foreground">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-lg text-foreground-muted">
            Let's build something amazing with Trinity AI
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4"
        >
          <Button
            onClick={handleNewProject}
            size="lg"
            leftIcon={<Plus className="w-5 h-5" />}
          >
            New Project
          </Button>

          <Button
            onClick={() => navigate('/templates')}
            variant="secondary"
            size="lg"
          >
            Browse Templates
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <StatCard
            icon={<Sparkles className="w-6 h-6" />}
            label="Total Projects"
            value={stats.totalProjects}
            color="text-primary"
          />

          <StatCard
            icon={<Activity className="w-6 h-6" />}
            label="Active Projects"
            value={stats.activeProjects}
            color="text-accent"
          />

          <StatCard
            icon={<Zap className="w-6 h-6" />}
            label="Generations"
            value={stats.totalGenerations}
            color="text-secondary"
          />

          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Success Rate"
            value={`${stats.successRate}%`}
            color="text-accent"
          />
        </motion.div>

        {/* Trinity Health Status */}
        {trinityHealth && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-lg bg-background-surface border border-primary/20"
          >
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Trinity AI Status
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TrinityStatusCard
                name="Alma"
                status={trinityHealth.alma.status}
                latency={trinityHealth.alma.latency}
              />
              <TrinityStatusCard
                name="Cerebro"
                status={trinityHealth.cerebro.status}
                latency={trinityHealth.cerebro.latency}
              />
              <TrinityStatusCard
                name="Voz"
                status={trinityHealth.voz.status}
                latency={trinityHealth.voz.latency}
              />
            </div>
          </motion.div>
        )}

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Recent Projects</h2>
            <Button
              variant="ghost"
              onClick={() => navigate('/projects')}
            >
              View All
            </Button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 bg-background-surface rounded-lg border border-primary/20">
              <Sparkles className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No projects yet
              </h3>
              <p className="text-foreground-muted mb-6">
                Start building your first project with Trinity AI
              </p>
              <Button onClick={handleNewProject} leftIcon={<Plus className="w-5 h-5" />}>
                Create Your First Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 6).map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => navigate(`/projects/${project.id}`)}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-lg bg-background-surface border border-primary/20"
        >
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Activity
          </h2>

          {recentActivity.length === 0 ? (
            <p className="text-foreground-muted">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-background-elevated transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
                    {activity.type === 'generation' ? (
                      <Sparkles className="w-5 h-5 text-primary" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-accent" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {activity.message}
                    </p>
                    <p className="text-xs text-foreground-muted mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Navigation>
  );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="p-6 rounded-lg bg-background-surface border border-primary/20">
    <div className={`mb-3 ${color}`}>{icon}</div>
    <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
    <div className="text-sm text-foreground-muted">{label}</div>
  </div>
);

interface TrinityStatusCardProps {
  name: string;
  status: 'online' | 'offline';
  latency: number;
}

const TrinityStatusCard: React.FC<TrinityStatusCardProps> = ({ name, status, latency }) => (
  <div className="p-4 rounded-lg bg-background border border-primary/20">
    <div className="flex items-center justify-between mb-2">
      <span className="font-semibold text-foreground">{name}</span>
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            status === 'online' ? 'bg-accent animate-pulse' : 'bg-error'
          }`}
        />
        <span className="text-sm text-foreground-muted capitalize">{status}</span>
      </div>
    </div>
    <div className="text-xs text-foreground-muted">
      Latency: <span className="text-foreground font-medium">{latency}ms</span>
    </div>
  </div>
);

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: DashboardPage (Main dashboard page)
 * NAMED_EXPORTS: None
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
