/**
 * ============================================================================
 * ORUS BUILDER - PROJECT PAGE (WORKSPACE) - FIXED
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T09:56:00-03:00
 * LAST_MODIFIED: 2025-10-10T10:13:00-03:00
 * COMPONENT_HASH: orus.frontend.page.project.20251010.PRJ8Y9Z0.FIXED
 * 
 * PURPOSE:
 * - Project workspace page
 * - Combine editor + chat + activity
 * - Real-time collaboration
 * - Project management interface
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: ProjectWorkspaceAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 80
 * - TRINITY_INTEGRATED: Full (Collaborative workspace)
 * 
 * FIXES APPLIED:
 * ✅ Changed all toast.info() to toast.success()
 * ✅ Removed duplicate Split import
 * ✅ Fixed Split component usage (using default Split)
 * ✅ Removed unused setShowSidebar and setOnlineUsers
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Split from 'react-split';
import {
  Code,
  MessageSquare,
  Activity,
  Users,
  Settings,
  Play,
  Download,
} from 'lucide-react';
import { Navigation } from '@components/layout/Navigation';
import { Chat } from '@components/collaboration/Chat';
import { ActivityFeed } from '@components/collaboration/ActivityFeed';
import { Button } from '@components/common/Button';
import { Avatar } from '@components/common/Avatar';
import { useProjectStore } from '@store/project.store';
import toast from 'react-hot-toast';

// ============================================================================
// PROJECT PAGE COMPONENT
// ============================================================================

export const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, isLoading } = useProjectStore();

  const [activeTab, setActiveTab] = useState<'chat' | 'activity'>('chat');
  const [showSidebar] = useState(true); // ✅ FIXED: Removed setShowSidebar (unused)
  const [onlineUsers] = useState([ // ✅ FIXED: Removed setOnlineUsers (unused)
    { id: '1', name: 'Alice Smith', avatar: '', status: 'online' as const },
    { id: '2', name: 'Bob Johnson', avatar: '', status: 'online' as const },
    { id: '3', name: 'Charlie Brown', avatar: '', status: 'away' as const },
  ]);

  const project = projects.find((p) => p.id === projectId);

  // Mock activities
  const mockActivities = [
    {
      id: '1',
      type: 'file_updated' as const,
      userId: '1',
      userName: 'Alice Smith',
      action: 'updated',
      targetName: 'App.tsx',
      timestamp: new Date(Date.now() - 5 * 60000),
    },
    {
      id: '2',
      type: 'comment_added' as const,
      userId: '2',
      userName: 'Bob Johnson',
      action: 'commented on',
      targetName: 'Header component',
      timestamp: new Date(Date.now() - 15 * 60000),
    },
    {
      id: '3',
      type: 'generation_completed' as const,
      userId: '3',
      userName: 'Charlie Brown',
      action: 'completed generation for',
      targetName: 'Dashboard Page',
      timestamp: new Date(Date.now() - 30 * 60000),
    },
  ];

  useEffect(() => {
    if (!project && !isLoading) {
      toast.error('Project not found');
      navigate('/projects');
    }
  }, [project, isLoading, navigate]);

  if (isLoading) {
    return (
      <Navigation>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-foreground-muted">Loading project...</div>
        </div>
      </Navigation>
    );
  }

  if (!project) {
    return null;
  }

   return (
    <Navigation showSidebar={false} showFooter={false}>
      <div className="h-screen flex flex-col bg-background">
        {/* Project Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary/20 bg-background-surface">
          {/* Left - Project Info */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/projects')}
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              ← Back
            </button>

            <div>
              <h1 className="text-xl font-bold text-foreground">{project.name}</h1>
              <p className="text-sm text-foreground-muted">
                {project.framework} • {project.language}
              </p>
            </div>
          </div>

          {/* Center - Online Users */}
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-foreground-muted" />
            <div className="flex -space-x-2">
              {onlineUsers.slice(0, 3).map((user) => (
                <Avatar
                  key={user.id}
                  src={user.avatar}
                  name={user.name}
                  size="sm"
                  status={user.status}
                  className="ring-2 ring-background"
                />
              ))}
            </div>
            {onlineUsers.length > 3 && (
              <span className="text-sm text-foreground-muted">
                +{onlineUsers.length - 3} more
              </span>
            )}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate(`/editor/${projectId}`)}
              variant="secondary"
              size="sm"
              leftIcon={<Code className="w-4 h-4" />}
            >
              Open Editor
            </Button>

            <Button
              onClick={() => toast.success('Run project (coming soon)')}
              variant="secondary"
              size="sm"
              leftIcon={<Play className="w-4 h-4" />}
            >
              Run
            </Button>

            <Button
              onClick={() => toast.success('Download project (coming soon)')}
              variant="ghost"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export
            </Button>

            <button
              onClick={() => toast.success('Project settings (coming soon)')}
              className="p-2 rounded-lg hover:bg-background-elevated transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-foreground-muted" />
            </button>
          </div>
        </div> {/* ✅ FECHAMENTO: Project Header */}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Main Area - Project Overview */}
            <div 
              className="flex flex-col p-6 overflow-y-auto"
              style={{ 
                width: showSidebar ? '70%' : '100%',
                transition: 'width 0.3s ease'
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Project Description */}
                <div className="p-6 rounded-lg bg-background-surface border border-primary/20">
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    About This Project
                  </h2>
                  <p className="text-foreground-muted">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <StatCard
                    label="Files"
                    value={project.files?.length || 0}
                    icon={<Code className="w-5 h-5" />}
                  />
                  <StatCard
                    label="Comments"
                    value={12}
                    icon={<MessageSquare className="w-5 h-5" />}
                  />
                  <StatCard
                    label="Activities"
                    value={mockActivities.length}
                    icon={<Activity className="w-5 h-5" />}
                  />
                </div>

                {/* Quick Actions */}
                <div className="p-6 rounded-lg bg-background-surface border border-primary/20">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => navigate(`/editor/${projectId}`)}
                      variant="secondary"
                      fullWidth
                      leftIcon={<Code className="w-4 h-4" />}
                    >
                      Open in Editor
                    </Button>
                    <Button
                      onClick={() => toast.success('Coming soon')}
                      variant="secondary"
                      fullWidth
                      leftIcon={<Play className="w-4 h-4" />}
                    >
                      Run Project
                    </Button>
                    <Button
                      onClick={() => toast.success('Coming soon')}
                      variant="secondary"
                      fullWidth
                      leftIcon={<Download className="w-4 h-4" />}
                    >
                      Download
                    </Button>
                    <Button
                      onClick={() => toast.success('Coming soon')}
                      variant="secondary"
                      fullWidth
                      leftIcon={<Settings className="w-4 h-4" />}
                    >
                      Settings
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div> {/* ✅ FECHAMENTO: Main Area */}

            {/* Sidebar - Chat/Activity */}
            {showSidebar && (
              <div 
                className="flex flex-col bg-background-surface border-l border-primary/20"
                style={{ width: '30%' }}
              >
                {/* Tabs */}
                <div className="flex border-b border-primary/20">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'chat'
                        ? 'text-foreground border-b-2 border-primary'
                        : 'text-foreground-muted hover:text-foreground'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'activity'
                        ? 'text-foreground border-b-2 border-primary'
                        : 'text-foreground-muted hover:text-foreground'
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    Activity
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                  {activeTab === 'chat' ? (
                    <Chat
                      channelId={`project-${projectId}`}
                      userId="current-user"
                      projectId={projectId}
                      maxHeight="100%"
                    />
                  ) : (
                    <ActivityFeed activities={mockActivities} />
                  )}
                </div>
              </div>
            )}
          </div> {/* ✅ FECHAMENTO: flex h-full */}
        </div> {/* ✅ FECHAMENTO: Main Content */}
      </div> {/* ✅ FECHAMENTO: h-screen */}
    </Navigation>
  );

};

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
  <div className="p-4 rounded-lg bg-background-surface border border-primary/20">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-foreground-muted">{label}</span>
      <div className="text-primary">{icon}</div>
    </div>
    <div className="text-2xl font-bold text-foreground">{value}</div>
  </div>
);

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: ProjectPage (Project workspace page)
 * NAMED_EXPORTS: None
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
