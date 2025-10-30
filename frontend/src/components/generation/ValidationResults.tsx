/**
 * ============================================================================
 * ORUS BUILDER - VALIDATION RESULTS COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T21:13:00-03:00
 * LAST_MODIFIED: 2025-10-10T08:23:00-03:00
 * COMPONENT_HASH: orus.frontend.component.validation.20251009.VAL4Z5A6
 * 
 * PURPOSE:
 * - Display CIG-2.0 validation results
 * - Show errors, warnings, and suggestions
 * - Interactive issue navigation
 * - Quality score visualization
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: QualityVisualizationAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 82
 * - TRINITY_INTEGRATED: Cerebro (Quality Logic)
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  Code,
  FileCode,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react';
import { 
  CIGValidationResult, 
  ValidationIssue,
} from '../../types/api.types';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ValidationResultsProps {
  /**
   * CIG-2.0 validation result
   */
  result: CIGValidationResult;

  /**
   * Callback when an issue is clicked
   */
  onIssueClick?: (issue: ValidationIssue) => void;

  /**
   * Show detailed metrics
   * @default true
   */
  showMetrics?: boolean;

  /**
   * Collapsible sections
   * @default false
   */
  collapsible?: boolean;
}

type IssueGrouping = 'severity' | 'file' | 'rule';

// ============================================================================
// VALIDATION RESULTS COMPONENT
// ============================================================================

export const ValidationResults: React.FC<ValidationResultsProps> = ({
  result,
  onIssueClick,
  showMetrics = true,
  collapsible = false,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['errors', 'warnings', 'info', 'metrics'])
  );

  const toggleSection = (section: string) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(section)) {
      newSet.delete(section);
    } else {
      newSet.add(section);
    }
    setExpandedSections(newSet);
  };

  const isSectionExpanded = (section: string) => expandedSections.has(section);

  // Convert errors/warnings to ValidationIssue format
  const errorIssues = useMemo(() => 
    (result.errors || []).map((err, idx): ValidationIssue => ({
      id: err.id || `error-${idx}`,
      type: err.rule || 'error',
      description: err.message,
      severity: 'error',
      file: err.file,
      line: err.line,
      column: err.column,
      message: err.message,
      rule: err.rule,
      fixable: err.fixable || false,
      suggestedFix: err.suggestedFix,
    }))
  , [result.errors]);

  const warningIssues = useMemo(() => 
    (result.warnings || []).map((warn, idx): ValidationIssue => ({
      id: warn.id || `warning-${idx}`,
      type: warn.rule || 'warning',
      description: warn.message,
      severity: 'warning',
      file: warn.file,
      line: warn.line,
      column: warn.column,
      message: warn.message,
      rule: warn.rule,
      fixable: warn.fixable || false,
      suggestedFix: warn.suggestedFix,
    }))
  , [result.warnings]);

  const suggestionIssues = useMemo(() => 
    (result.suggestions || []).map((sug, idx): ValidationIssue => ({
      id: `suggestion-${idx}`,
      type: 'suggestion',
      description: sug,
      severity: 'info',
      message: sug,
      fixable: false,
    }))
  , [result.suggestions]);

  const errorCount = errorIssues.length;
  const warningCount = warningIssues.length;
  const infoCount = suggestionIssues.length;
  const totalIssues = errorCount + warningCount + infoCount;

  const qualityScore = result.quality || result.score || 0;
  const isValid = result.isValid !== undefined ? result.isValid : result.valid;

  return (
    <div className="w-full space-y-4">
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={clsx(
          'p-6 rounded-lg border-2',
          isValid
            ? 'bg-accent/10 border-accent'
            : 'bg-error/10 border-error'
        )}
      >
        <div className="flex items-start justify-between">
          {/* Status */}
          <div className="flex items-center gap-3">
            {isValid ? (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20">
                <CheckCircle className="w-7 h-7 text-accent" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error/20">
                <AlertCircle className="w-7 h-7 text-error" />
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {isValid ? 'Validation Passed' : 'Validation Failed'}
              </h2>
              <p className="text-sm text-foreground-muted mt-1">
                {totalIssues === 0
                  ? 'No issues found'
                  : `${totalIssues} issue${totalIssues !== 1 ? 's' : ''} detected`}
              </p>
            </div>
          </div>

          {/* Quality Score */}
          <div className="text-right">
            <div className="text-4xl font-bold bg-gradient-cognitive bg-clip-text text-transparent">
              {qualityScore}%
            </div>
            <div className="text-sm text-foreground-muted">Quality Score</div>
          </div>
        </div>

        {/* Issue Summary */}
        {totalIssues > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-3 rounded-lg bg-error/10">
              <div className="flex items-center gap-2 text-error mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Errors</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{errorCount}</div>
            </div>

            <div className="p-3 rounded-lg bg-primary/10">
              <div className="flex items-center gap-2 text-primary mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Warnings</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{warningCount}</div>
            </div>

            <div className="p-3 rounded-lg bg-accent/10">
              <div className="flex items-center gap-2 text-accent mb-1">
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">Suggestions</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{infoCount}</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Metrics Panel */}
      {showMetrics && result.metrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CollapsibleSection
            title="Quality Metrics"
            icon={<TrendingUp className="w-5 h-5" />}
            isExpanded={isSectionExpanded('metrics')}
            onToggle={() => toggleSection('metrics')}
            collapsible={collapsible}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label="Lines of Code"
                value={result.metrics.lines}
                icon={<Code className="w-5 h-5" />}
              />
              <MetricCard
                label="Complexity"
                value={result.metrics.complexity}
                icon={<Zap className="w-5 h-5" />}
              />
              <MetricCard
                label="Maintainability"
                value={`${result.metrics.maintainability}%`}
                icon={<Shield className="w-5 h-5" />}
                color={
                  result.metrics.maintainability >= 80
                    ? 'text-accent'
                    : result.metrics.maintainability >= 60
                    ? 'text-primary'
                    : 'text-error'
                }
              />
              <MetricCard
                label="Type Coverage"
                value={`${result.metrics.coverage || 0}%`}
                icon={<FileCode className="w-5 h-5" />}
                color={
                  (result.metrics.coverage || 0) >= 90
                    ? 'text-accent'
                    : (result.metrics.coverage || 0) >= 70
                    ? 'text-primary'
                    : 'text-error'
                }
              />
            </div>
          </CollapsibleSection>
        </motion.div>
      )}

      {/* Errors Section */}
      {errorCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CollapsibleSection
            title={`Errors (${errorCount})`}
            icon={<AlertCircle className="w-5 h-5 text-error" />}
            isExpanded={isSectionExpanded('errors')}
            onToggle={() => toggleSection('errors')}
            collapsible={collapsible}
          >
            <div className="space-y-2">
              {errorIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onClick={() => onIssueClick?.(issue)}
                />
              ))}
            </div>
          </CollapsibleSection>
        </motion.div>
      )}

      {/* Warnings Section */}
      {warningCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CollapsibleSection
            title={`Warnings (${warningCount})`}
            icon={<AlertTriangle className="w-5 h-5 text-primary" />}
            isExpanded={isSectionExpanded('warnings')}
            onToggle={() => toggleSection('warnings')}
            collapsible={collapsible}
          >
            <div className="space-y-2">
              {warningIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onClick={() => onIssueClick?.(issue)}
                />
              ))}
            </div>
          </CollapsibleSection>
        </motion.div>
      )}

      {/* Suggestions Section */}
      {infoCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CollapsibleSection
            title={`Suggestions (${infoCount})`}
            icon={<Info className="w-5 h-5 text-accent" />}
            isExpanded={isSectionExpanded('info')}
            onToggle={() => toggleSection('info')}
            collapsible={collapsible}
          >
            <div className="space-y-2">
              {suggestionIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onClick={() => onIssueClick?.(issue)}
                />
              ))}
            </div>
          </CollapsibleSection>
        </motion.div>
      )}
    </div>
  );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  collapsible: boolean;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  isExpanded,
  onToggle,
  collapsible,
  children,
}) => (
  <div className="bg-background-surface rounded-lg border border-primary/20 overflow-hidden">
    <button
      onClick={collapsible ? onToggle : undefined}
      className={clsx(
        'w-full flex items-center justify-between px-6 py-4',
        collapsible && 'hover:bg-background-elevated transition-colors cursor-pointer'
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>

      {collapsible && (
        <motion.div
          animate={{ rotate: isExpanded ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-foreground-muted" />
        </motion.div>
      )}
    </button>

    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

interface IssueCardProps {
  issue: ValidationIssue;
  onClick?: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  // Map all possible severity types to display config
  const getSeverityConfig = (severity: ValidationIssue['severity']) => {
    const normalizedSeverity = severity === 'low' || severity === 'medium' || severity === 'high' 
      ? 'info' 
      : severity;

    const configs = {
      error: {
        icon: AlertCircle,
        color: 'text-error',
        bg: 'bg-error/10',
        border: 'border-error/30',
      },
      warning: {
        icon: AlertTriangle,
        color: 'text-primary',
        bg: 'bg-primary/10',
        border: 'border-primary/30',
      },
      info: {
        icon: Info,
        color: 'text-accent',
        bg: 'bg-accent/10',
        border: 'border-accent/30',
      },
    };

    return configs[normalizedSeverity as keyof typeof configs] || configs.info;
  };

  const config = getSeverityConfig(issue.severity);
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left p-4 rounded-lg border transition-all',
        config.bg,
        config.border,
        onClick && 'hover:bg-background-elevated cursor-pointer'
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={clsx('w-5 h-5 mt-0.5', config.color)} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {issue.file && (
              <span className="text-sm font-medium text-foreground-muted">
                {issue.file}
              </span>
            )}
            {issue.line && (
              <span className="text-xs text-foreground-muted">
                Ln {issue.line}{issue.column ? `, Col ${issue.column}` : ''}
              </span>
            )}
            {issue.fixable && (
              <span className="px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent rounded">
                Auto-fixable
              </span>
            )}
          </div>

          <p className="text-sm text-foreground mb-2">
            {issue.message || issue.description}
          </p>

          {issue.rule && (
            <span className="text-xs text-foreground-muted font-mono">
              {issue.rule}
            </span>
          )}

          {issue.suggestedFix && (
            <div className="mt-2 p-2 rounded bg-background">
              <p className="text-xs text-accent mb-1">Suggested fix:</p>
              <code className="text-xs text-foreground-muted">{issue.suggestedFix}</code>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  color = 'text-primary',
}) => (
  <div className="p-4 rounded-lg bg-background border border-primary/20">
    <div className={clsx('mb-2', color)}>{icon}</div>
    <div className="text-2xl font-bold text-foreground">{value}</div>
    <div className="text-xs text-foreground-muted mt-1">{label}</div>
  </div>
);

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: ValidationResults (CIG-2.0 results display)
 * NAMED_EXPORTS: ValidationResultsProps
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
