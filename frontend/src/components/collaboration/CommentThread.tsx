/**
 * ============================================================================
 * ORUS BUILDER - COMMENT THREAD COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T09:54:00-03:00
 * LAST_MODIFIED: 2025-10-10T09:54:00-03:00
 * COMPONENT_HASH: orus.frontend.component.commentthread.20251010.CMT4U5V6
 * 
 * PURPOSE:
 * - Code comment threads
 * - Inline code discussions
 * - Threaded replies
 * - Resolve/unresolve comments
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: CommentManagementAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 70
 * - TRINITY_INTEGRATED: None (Pure UI)
 * ============================================================================
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  MessageSquare,
  Send,
  MoreVertical,
  Edit,
  Trash2,
  Check,
  X,
  Reply,
} from 'lucide-react';
import { Avatar } from '@components/common/Avatar';
import { Button } from '@components/common/Button';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface CommentThreadProps {
  /**
   * Thread ID
   */
  threadId: string;

  /**
   * Comments in thread
   */
  comments: Comment[];

  /**
   * Current user ID
   */
  currentUserId: string;

  /**
   * Line number (for code comments)
   */
  lineNumber?: number;

  /**
   * File path (for code comments)
   */
  filePath?: string;

  /**
   * Thread resolved status
   */
  isResolved?: boolean;

  /**
   * Add comment callback
   */
  onAddComment?: (content: string, parentId?: string) => void;

  /**
   * Edit comment callback
   */
  onEditComment?: (commentId: string, content: string) => void;

  /**
   * Delete comment callback
   */
  onDeleteComment?: (commentId: string) => void;

  /**
   * Resolve thread callback
   */
  onResolveThread?: () => void;

  /**
   * Show collapsed initially
   * @default false
   */
  initiallyCollapsed?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  editedAt?: Date;
  parentId?: string;
  reactions?: CommentReaction[];
}

export interface CommentReaction {
  emoji: string;
  userIds: string[];
  count: number;
}

// ============================================================================
// COMMENT THREAD COMPONENT
// ============================================================================

export const CommentThread: React.FC<CommentThreadProps> = ({
  threadId,
  comments,
  currentUserId,
  lineNumber,
  filePath,
  isResolved = false,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onResolveThread,
  initiallyCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [editContent, setEditContent] = useState('');

  // Get root comments (no parent)
  const rootComments = comments.filter((c) => !c.parentId);

  // Get replies for a comment
  const getReplies = (commentId: string) => {
    return comments.filter((c) => c.parentId === commentId);
  };

  // Handle add comment
  const handleAddComment = (parentId?: string) => {
    if (!newCommentContent.trim()) return;

    if (onAddComment) {
      onAddComment(newCommentContent, parentId);
    }

    setNewCommentContent('');
    setReplyingTo(null);
    toast.success('Comment added');
  };

  // Handle edit comment
  const handleEditComment = (commentId: string) => {
    if (!editContent.trim()) return;

    if (onEditComment) {
      onEditComment(commentId, editContent);
    }

    setEditingComment(null);
    setEditContent('');
    toast.success('Comment updated');
  };

  // Handle delete comment
  const handleDeleteComment = (commentId: string) => {
    if (onDeleteComment) {
      onDeleteComment(commentId);
    }
    toast.success('Comment deleted');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'rounded-lg border overflow-hidden',
        isResolved
          ? 'bg-accent/5 border-accent/30'
          : 'bg-background-surface border-primary/20'
      )}
    >
      {/* Thread Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-background-elevated border-b border-primary/20 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <MessageSquare className={clsx('w-5 h-5', isResolved ? 'text-accent' : 'text-primary')} />
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
              </span>
              
              {isResolved && (
                <span className="px-2 py-0.5 bg-accent/20 text-accent rounded-full text-xs font-medium">
                  Resolved
                </span>
              )}
            </div>

            {(lineNumber || filePath) && (
              <p className="text-xs text-foreground-muted">
                {filePath && <span>{filePath}</span>}
                {lineNumber && <span> : Line {lineNumber}</span>}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isResolved && onResolveThread && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResolveThread();
                toast.success('Thread resolved');
              }}
              className="px-3 py-1 rounded-lg bg-accent/20 text-accent text-sm font-medium hover:bg-accent/30 transition-colors"
            >
              <Check className="w-4 h-4 inline mr-1" />
              Resolve
            </button>
          )}

          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className="w-5 h-5 text-foreground-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Thread Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Root Comments */}
              {rootComments.map((comment) => (
                <div key={comment.id}>
                  <CommentItem
                    comment={comment}
                    currentUserId={currentUserId}
                    isEditing={editingComment === comment.id}
                    editContent={editContent}
                    onEdit={() => {
                      setEditingComment(comment.id);
                      setEditContent(comment.content);
                    }}
                    onSaveEdit={() => handleEditComment(comment.id)}
                    onCancelEdit={() => {
                      setEditingComment(null);
                      setEditContent('');
                    }}
                    onDelete={() => handleDeleteComment(comment.id)}
                    onReply={() => setReplyingTo(comment.id)}
                    onEditContentChange={setEditContent}
                  />

                  {/* Replies */}
                  {getReplies(comment.id).length > 0 && (
                    <div className="ml-12 mt-3 space-y-3 border-l-2 border-primary/20 pl-4">
                      {getReplies(comment.id).map((reply) => (
                        <CommentItem
                          key={reply.id}
                          comment={reply}
                          currentUserId={currentUserId}
                          isEditing={editingComment === reply.id}
                          editContent={editContent}
                          onEdit={() => {
                            setEditingComment(reply.id);
                            setEditContent(reply.content);
                          }}
                          onSaveEdit={() => handleEditComment(reply.id)}
                          onCancelEdit={() => {
                            setEditingComment(null);
                            setEditContent('');
                          }}
                          onDelete={() => handleDeleteComment(reply.id)}
                          onEditContentChange={setEditContent}
                        />
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="ml-12 mt-3">
                      <CommentInput
                        value={newCommentContent}
                        onChange={setNewCommentContent}
                        onSubmit={() => handleAddComment(comment.id)}
                        onCancel={() => {
                          setReplyingTo(null);
                          setNewCommentContent('');
                        }}
                        placeholder="Write a reply..."
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* New Comment Input */}
              {!replyingTo && (
                <CommentInput
                  value={newCommentContent}
                  onChange={setNewCommentContent}
                  onSubmit={() => handleAddComment()}
                  placeholder="Add a comment..."
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// COMMENT ITEM COMPONENT
// ============================================================================

interface CommentItemProps {
  comment: Comment;
  currentUserId: string;
  isEditing: boolean;
  editContent: string;
  onEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onReply?: () => void;
  onEditContentChange: (content: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  isEditing,
  editContent,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onReply,
  onEditContentChange,
}) => {
  const [showActions, setShowActions] = useState(false);
  const isOwn = comment.userId === currentUserId;

  return (
    <div
      className="flex gap-3 group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar
        src={comment.userAvatar}
        name={comment.userName}
        size="sm"
      />

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-foreground">{comment.userName}</span>
          <span className="text-xs text-foreground-muted">
            {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
          </span>
          {comment.editedAt && (
            <span className="text-xs text-foreground-muted">(edited)</span>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => onEditContentChange(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-primary/20 rounded-lg resize-none focus:outline-none focus:border-primary text-foreground text-sm"
              rows={3}
            />
            <div className="flex gap-2">
              <Button onClick={onSaveEdit} size="sm">
                Save
              </Button>
              <Button onClick={onCancelEdit} variant="ghost" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className={clsx('flex items-center gap-2 mt-2', !showActions && 'opacity-0')}>
            {onReply && (
              <button
                onClick={onReply}
                className="text-xs text-foreground-muted hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Reply className="w-3 h-3" />
                Reply
              </button>
            )}

            {isOwn && (
              <>
                <button
                  onClick={onEdit}
                  className="text-xs text-foreground-muted hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  className="text-xs text-error hover:text-error/80 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// COMMENT INPUT COMPONENT
// ============================================================================

interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  placeholder?: string;
}

const CommentInput: React.FC<CommentInputProps> = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder = 'Add a comment...',
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-background border border-primary/20 rounded-lg resize-none focus:outline-none focus:border-primary text-foreground placeholder-foreground-muted text-sm"
        rows={3}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-foreground-muted">
          Cmd+Enter to submit
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <Button onClick={onCancel} variant="ghost" size="sm">
              Cancel
            </Button>
          )}
          <Button
            onClick={onSubmit}
            disabled={!value.trim()}
            size="sm"
            leftIcon={<Send className="w-4 h-4" />}
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: CommentThread (Comment thread component)
 * NAMED_EXPORTS: CommentThreadProps, Comment
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
