/**
 * ============================================================================
 * ORUS BUILDER - ACTIVITY FEED COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T09:54:00-03:00
 * LAST_MODIFIED: 2025-10-10T09:54:00-03:00
 * COMPONENT_HASH: orus.frontend.component.activityfeed.20251010.ACT5V6W7
 * 
 * PURPOSE:
 * - Display project activity timeline
 * - Real-time activity updates
 * - Filterable by activity type
 * - User-specific activity tracking
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: ActivityVisualizationAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 68
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  Activity,
  GitCommit,
  FileCode,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Trash2,
  Edit,
  Upload,
  Download,
  Filter,
} from 'lucide-react';
import { Avatar } from '@components/common/Avatar';
import { formatDistanceToNow } from 'date-fns';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ActivityFeedProps {
  /**
   * Activity items
   */
  activities: ActivityItem[];

  /**
   * Show filter
   * @default true
   */
  showFilter?: boolean;

  /**
   * Max items to display
   * @default 50
   */
  maxItems?: number;

  /**
   * Loading state
   */
  isLoading?: boolean;

  /**
   * Activity click handler
   */
  onActivityClick?: (activity: ActivityItem) => void;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  targetName?: string;
  targetType?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export type ActivityType =
  | 'file_created'
  | 'file_updated'
  | 'file_deleted'
  | 'comment_added'
  | 'comment_resolved'
  | 'generation_started'
  | 'generation_completed'
  | 'generation_failed'
  | 'user_joined'
  | 'user_left'
  | 'project_created'
  | 'project_updated'
  | 'upload'
  | 'download';

// ============================================================================
// ACTIVITY ICONS
// ============================================================================

const activityIcons: Record<ActivityType, { icon: React.ElementType; color: string }> = {
  file_created: { icon: FileCode, color: 'text-accent' },
  file_updated: { icon: Edit, color: 'text-primary' },
  file_deleted: { icon: Trash2, color: 'text-error' },
  comment_added: { icon: MessageSquare, color: 'text-secondary' },
  comment_resolved: { icon: CheckCircle, color: 'text-accent' },
  generation_started: { icon: Activity, color: 'text-primary' },
  generation_completed: { icon: CheckCircle, color: 'text-accent' },
  generation_failed: { icon: AlertCircle, color: 'text-error' },
  user_joined: { icon: UserPlus, color: 'text-accent' },
  user_left: { icon: UserPlus, color: 'text-foreground-muted' },
  project_created: { icon: GitCommit, color: 'text-primary' },
  project_updated: { icon: GitCommit, color: 'text-secondary' },
  upload: { icon: Upload, color: 'text-primary' },
  download: { icon: Download, color: 'text-secondary' },
};

// ============================================================================
// ACTIVITY FEED COMPONENT
// ============================================================================

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  showFilter = true,
  maxItems = 50,
  isLoading = false,
  onActivityClick,
}) => {
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>([]);

  // Filter activities
  useEffect(() => {
    let filtered = activities;

    if (filter !== 'all') {
      filtered = activities.filter((a) => a.type === filter);
    }

    filtered = filtered.slice(0, maxItems);
    setFilteredActivities(filtered);
  }, [activities, filter, maxItems]);

  // Get unique activity types for filter
  const activityTypes = Array.from(new Set(activities.map((a) => a.type)));

  return (
    <div className="flex flex-col h-full bg-background-surface rounded-lg border border-primary/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20 bg-background-elevated">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Activity Feed</h3>
          <span className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs font-medium">
            {filteredActivities.length}
          </span>
        </div>

        {showFilter && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ActivityType | 'all')}
            className="px-3 py-1 bg-background border border-primary/20 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
          >
            <option value="all">All Activity</option>
            {activityTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-foreground-muted">
            <Activity className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredActivities.map((activity, index) => (
                <ActivityFeedItem
                  key={activity.id}
                  activity={activity}
                  index={index}
                  onClick={() => onActivityClick?.(activity)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// ACTIVITY FEED ITEM COMPONENT
// ============================================================================

interface ActivityFeedItemProps {
  activity: ActivityItem;
  index: number;
  onClick?: () => void;
}

const ActivityFeedItem: React.FC<ActivityFeedItemProps> = ({ activity, index, onClick }) => {
  const iconConfig = activityIcons[activity.type];
  const Icon = iconConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={clsx(
        'flex gap-3 p-3 rounded-lg transition-colors',
        onClick && 'cursor-pointer hover:bg-background-elevated'
      )}
    >
      {/* Timeline dot */}
      <div className="relative flex flex-col items-center">
        <div
          className={clsx(
            'flex items-center justify-center w-8 h-8 rounded-full',
            'bg-background-elevated border-2',
            iconConfig.color.replace('text-', 'border-')
          )}
        >
          <Icon className={clsx('w-4 h-4', iconConfig.color)} />
        </div>

        {/* Timeline line */}
        {index !== 0 && (
          <div className="absolute top-0 w-0.5 h-full bg-primary/20 -translate-y-full" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <Avatar src={activity.userAvatar} name={activity.userName} size="xs" />

          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground">
              <span className="font-medium">{activity.userName}</span>{' '}
              <span className="text-foreground-muted">{activity.action}</span>
              {activity.targetName && (
                <span className="font-medium text-foreground"> {activity.targetName}</span>
              )}
            </p>

            <p className="text-xs text-foreground-muted mt-1">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </p>

            {/* Metadata */}
            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
              <div className="mt-2 p-2 rounded bg-background border border-primary/10">
                {Object.entries(activity.metadata).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="text-foreground-muted">{key}:</span>{' '}
                    <span className="text-foreground">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: ActivityFeed (Activity feed component)
 * NAMED_EXPORTS: ActivityFeedProps, ActivityItem, ActivityType
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
