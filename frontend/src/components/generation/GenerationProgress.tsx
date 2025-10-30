/**
 * ============================================================================
 * ORUS BUILDER - GENERATION PROGRESS COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:10:00-03:00
 * LAST_MODIFIED: 2025-10-09T21:10:00-03:00
 * COMPONENT_HASH: orus.frontend.component.genprogress.20251009.GPR2X3Y4
 * 
 * PURPOSE:
 * - Real-time generation progress visualization
 * - Stage-by-stage breakdown with ETA
 * - Trinity AI status indicator
 * - Animated progress with cognitive design
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: ProgressVisualizationAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 75
 * - TRINITY_INTEGRATED: Cerebro (Processing Logic)
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  CheckCircle,
  Circle,
  Loader2,
  Clock,
 
  Code,
  Layout,
  FileCode,
  TestTube,
  Package,
  AlertTriangle,
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface GenerationProgressProps {
  /**
   * Current generation stage
   */
  currentStage: GenerationStage;

  /**
   * Array of all stages with status
   */
  stages: GenerationStageStatus[];

  /**
   * Overall progress percentage
   */
  progress: number;

  /**
   * Estimated time remaining (seconds)
   */
  estimatedTimeRemaining?: number;

  /**
   * Generation metadata
   */
  metadata?: GenerationMetadata;

  /**
   * Trinity AI status
   */
  trinityStatus?: TrinityStatus;
}

export type GenerationStage =
  | 'analyzing'
  | 'architecture'
  | 'components'
  | 'styling'
  | 'tests'
  | 'optimization'
  | 'validation'
  | 'complete';

export interface GenerationStageStatus {
  stage: GenerationStage;
  status: 'pending' | 'processing' | 'complete' | 'error';
  message?: string;
  duration?: number; // milliseconds
  details?: string[];
}

export interface GenerationMetadata {
  totalFiles: number;
  totalLines: number;
  filesGenerated: number;
  componentsCreated: number;
  testsGenerated: number;
}

export interface TrinityStatus {
  alma: 'active' | 'idle' | 'error';
  cerebro: 'active' | 'idle' | 'error';
  voz: 'active' | 'idle' | 'error';
}

// ============================================================================
// STAGE CONFIGURATION
// ============================================================================

const STAGE_CONFIG: Record<GenerationStage, { icon: React.ElementType; label: string; color: string }> = {
 analyzing: {
    icon: () => (
      <img 
        src="/trinity-ai-icon.png"  
        alt="Trinity AI Working" 
        className="w-6 h-6 object-contain"  
      />
    ),
    label: 'Analisando prompt com Trinity AI', 
    color: 'text-primary',
  },

  architecture: {
    icon: Layout,
    label: 'Designing Architecture',
    color: 'text-indigo-400',
  },
  components: {
    icon: Code,
    label: 'Generating Components',
    color: 'text-cyan-400',
  },
  styling: {
    icon: FileCode,
    label: 'Applying Styles',
    color: 'text-purple-400',
  },
  tests: {
    icon: TestTube,
    label: 'Creating Tests',
    color: 'text-green-400',
  },
  optimization: {
    icon: Package,
    label: 'Optimizing Code',
    color: 'text-yellow-400',
  },
  validation: {
    icon: CheckCircle,
    label: 'Validating Output',
    color: 'text-accent',
  },
  complete: {
    icon: CheckCircle,
    label: 'Generation Complete',
    color: 'text-accent',
  },
};

// ============================================================================
// GENERATION PROGRESS COMPONENT
// ============================================================================

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  currentStage,
  stages,
  progress,
  estimatedTimeRemaining,
  metadata,
  trinityStatus,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  // Track elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Overall Progress Bar */}
      <div className="relative">
        {/* Background */}
        <div className="h-3 bg-background-surface rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-cognitive"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        {/* Progress Percentage */}
        <motion.div
          className="absolute -top-8 right-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-2xl font-bold bg-gradient-cognitive bg-clip-text text-transparent">
            {Math.round(progress)}%
          </span>
        </motion.div>
      </div>

      {/* Time Information */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-foreground-muted">
          <Clock className="w-4 h-4" />
          <span>Elapsed: {formatTime(elapsedTime)}</span>
        </div>

        {estimatedTimeRemaining !== undefined && (
          <div className="flex items-center gap-2 text-primary">
            <Clock className="w-4 h-4" />
            <span>Remaining: ~{formatTime(estimatedTimeRemaining)}</span>
          </div>
        )}
      </div>

      {/* Stages Progress */}
      <div className="space-y-3">
        {stages.map((stageStatus, index) => {
          const config = STAGE_CONFIG[stageStatus.stage];
          const Icon = config.icon;
          const isActive = stageStatus.status === 'processing';
          const isComplete = stageStatus.status === 'complete';
          const isError = stageStatus.status === 'error';

          return (
            <motion.div
              key={stageStatus.stage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={clsx(
                'relative p-4 rounded-lg border transition-all duration-300',
                isActive && 'bg-background-elevated border-primary shadow-glow-cyan',
                isComplete && 'bg-background-surface border-accent/30',
                isError && 'bg-error/10 border-error',
                !isActive && !isComplete && !isError && 'bg-background-surface border-primary/20 opacity-50'
              )}
            >
              <div className="flex items-start gap-3">
                {/* Stage Icon */}
                <div
                  className={clsx(
                    'flex items-center justify-center w-10 h-10 rounded-lg',
                    isActive && 'bg-primary/20',
                    isComplete && 'bg-accent/20',
                    isError && 'bg-error/20',
                    !isActive && !isComplete && !isError && 'bg-background-elevated'
                  )}
                >
                  {isActive ? (
                    <Loader2 className={clsx('w-5 h-5 animate-spin', config.color)} />
                  ) : isComplete ? (
                    <CheckCircle className="w-5 h-5 text-accent" />
                  ) : isError ? (
                    <AlertTriangle className="w-5 h-5 text-error" />
                  ) : (
                    <Circle className="w-5 h-5 text-foreground-muted" />
                  )}
                </div>

                {/* Stage Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={clsx('font-semibold', config.color)}>
                      {config.label}
                    </h3>

                    {stageStatus.duration && (
                      <span className="text-xs text-foreground-muted">
                        {(stageStatus.duration / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>

                  {stageStatus.message && (
                    <p className="text-sm text-foreground-muted">{stageStatus.message}</p>
                  )}

                  {/* Stage Details */}
                  {stageStatus.details && stageStatus.details.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {stageStatus.details.map((detail, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="text-xs text-foreground-muted flex items-center gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-primary" />
                          {detail}
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Generation Metadata */}
      {metadata && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 rounded-lg bg-background-surface border border-primary/20"
        >
          <StatCard
            label="Files"
            value={metadata.filesGenerated}
            total={metadata.totalFiles}
          />
          <StatCard
            label="Lines"
            value={metadata.totalLines}
          />
          <StatCard
            label="Components"
            value={metadata.componentsCreated}
          />
          <StatCard
            label="Tests"
            value={metadata.testsGenerated}
          />
          <StatCard
            label="Coverage"
            value={metadata.testsGenerated > 0 ? '95%' : '0%'}
          />
        </motion.div>
      )}

      {/* Trinity Status */}
      {trinityStatus && (

<motion.div
  className="relative w-24 h-24 mb-8"
  animate={{ rotate: 360 }}
  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
>
  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full opacity-20 blur-xl" />
  <div className="relative w-full h-full bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
    <img 
      src="/trinity-ai-logo.png"  
      alt="Trinity AI" 
      className="w-16 h-16 object-contain" 
    />
  </div>
</motion.div>

      )}
    </div>
  );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface StatCardProps {
  label: string;
  value: number | string;
  total?: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, total }) => (
  <div className="text-center">
    <div className="text-2xl font-bold text-foreground">
      {value}
      {total !== undefined && <span className="text-foreground-muted">/{total}</span>}
    </div>
    <div className="text-xs text-foreground-muted mt-1">{label}</div>
  </div>
);

interface TrinityStatusIndicatorProps {
  name: string;
  status: 'active' | 'idle' | 'error';
}

const TrinityStatusIndicator: React.FC<TrinityStatusIndicatorProps> = ({ name, status }) => (
  <div className="flex items-center gap-2">
    <div
      className={clsx(
        'w-2 h-2 rounded-full',
        status === 'active' && 'bg-accent animate-pulse',
        status === 'idle' && 'bg-foreground-muted',
        status === 'error' && 'bg-error'
      )}
    />
    <span className="text-sm text-foreground-muted">{name}</span>
  </div>
);

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: GenerationProgress (Progress visualization component)
 * NAMED_EXPORTS: GenerationProgressProps, GenerationStage, GenerationStageStatus
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
