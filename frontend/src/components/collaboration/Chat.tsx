/**
 * ============================================================================
 * ORUS BUILDER - CHAT COMPONENT
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T09:44:00-03:00
 * LAST_MODIFIED: 2025-10-10T09:44:00-03:00
 * COMPONENT_HASH: orus.frontend.component.chat.20251010.CHT1R2S3
 * 
 * PURPOSE:
 * - Team chat with WebSocket real-time messaging
 * - Message threading and reactions
 * - File sharing and code snippets
 * - User presence indicators
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: RealtimeCommunicationAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 72
 * - TRINITY_INTEGRATED: Voz (Communication)
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Reply,
  Heart,
  ThumbsUp,
  Code,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { useWebSocket } from '@/hooks/useWebSocket';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ChatProps {
  /**
   * Channel ID
   */
  channelId: string;

  /**
   * Current user ID
   */
  userId: string;

  /**
   * Project ID (optional)
   */
  projectId?: string;

  /**
   * Max height
   * @default '600px'
   */
  maxHeight?: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'code' | 'file' | 'image';
  reactions?: MessageReaction[];
  threadCount?: number;
  attachments?: MessageAttachment[];
  editedAt?: Date;
}

export interface MessageReaction {
  emoji: string;
  userIds: string[];
  count: number;
}

export interface MessageAttachment {
  id: string;
  type: 'file' | 'image' | 'code';
  name: string;
  url: string;
  size?: number;
  language?: string;
}

// ============================================================================
// CHAT COMPONENT
// ============================================================================

export const Chat: React.FC<ChatProps> = ({
  channelId,
  userId,
  projectId,
  maxHeight = '600px',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // WebSocket connection
  const { sendMessage, subscribe, isConnected } = useWebSocket({
    url: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
    autoConnect: true,
  });

  // Subscribe to chat messages
  useEffect(() => {
    const unsubscribe = subscribe('chat:message', (message: ChatMessage) => {
      if (message.channelId === channelId) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    });

    const unsubscribeTyping = subscribe('chat:typing', (data: { userId: string; userName: string; isTyping: boolean }) => {
      setIsTyping((prev) => {
        if (data.isTyping) {
          return prev.includes(data.userName) ? prev : [...prev, data.userName];
        } else {
          return prev.filter((name) => name !== data.userName);
        }
      });
    });

    return () => {
      unsubscribe();
      unsubscribeTyping();
    };
  }, [channelId, subscribe]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle send message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      channelId,
      userId,
      userName: 'Current User', // TODO: Get from auth
      content: inputValue,
      timestamp: new Date(),
      type: 'text',
    };

    sendMessage('chat:message', newMessage);
    setInputValue('');
    setReplyingTo(null);
    inputRef.current?.focus();
  };

  // Handle typing indicator
  const handleTyping = () => {
    sendMessage('chat:typing', {
      userId,
      userName: 'Current User',
      isTyping: true,
      channelId,
    });

    // Clear typing after 2 seconds
    setTimeout(() => {
      sendMessage('chat:typing', {
        userId,
        userName: 'Current User',
        isTyping: false,
        channelId,
      });
    }, 2000);
  };

  // Handle reaction
  const handleReaction = (messageId: string, emoji: string) => {
    sendMessage('chat:reaction', {
      messageId,
      emoji,
      userId,
      channelId,
    });
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-surface rounded-lg border border-primary/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20 bg-background-elevated">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Team Chat</h3>
          <p className="text-xs text-foreground-muted">
            {isConnected ? (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Connected
              </span>
            ) : (
              'Connecting...'
            )}
          </p>
        </div>

        <button
          className="p-2 rounded-lg hover:bg-background transition-colors"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4 text-foreground-muted" />
        </button>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight }}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.userId === userId}
              onReact={(emoji) => handleReaction(message.id, emoji)}
              onReply={() => setReplyingTo(message)}
            />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2 text-sm text-foreground-muted"
          >
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-foreground-muted animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-foreground-muted animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-foreground-muted animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>{isTyping.join(', ')} {isTyping.length === 1 ? 'is' : 'are'} typing...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="flex items-center justify-between px-4 py-2 bg-background-elevated border-t border-primary/20">
          <div className="flex items-center gap-2 text-sm">
            <Reply className="w-4 h-4 text-foreground-muted" />
            <span className="text-foreground-muted">Replying to</span>
            <span className="font-medium text-foreground">{replyingTo.userName}</span>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-foreground-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-primary/20 bg-background">
        <div className="flex items-end gap-2">
          <button
            className="p-2 rounded-lg hover:bg-background-elevated transition-colors"
            aria-label="Attach file"
          >
            <Paperclip className="w-5 h-5 text-foreground-muted" />
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-background-elevated border border-primary/20 rounded-lg resize-none focus:outline-none focus:border-primary text-foreground placeholder-foreground-muted"
              rows={1}
              style={{ maxHeight: '120px' }}
            />
          </div>

          <button
            className="p-2 rounded-lg hover:bg-background-elevated transition-colors"
            aria-label="Add emoji"
          >
            <Smile className="w-5 h-5 text-foreground-muted" />
          </button>

          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            size="sm"
            leftIcon={<Send className="w-4 h-4" />}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MESSAGE BUBBLE COMPONENT
// ============================================================================

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  onReact: (emoji: string) => void;
  onReply: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  onReact,
  onReply,
}) => {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={clsx('flex gap-3', isOwn && 'flex-row-reverse')}
    >
      {/* Avatar */}
      <Avatar
        src={message.userAvatar}
        name={message.userName}
        size="sm"
      />

      {/* Message content */}
      <div className={clsx('flex flex-col gap-1 max-w-[70%]', isOwn && 'items-end')}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{message.userName}</span>
          <span className="text-xs text-foreground-muted">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
        </div>

        <div
          className={clsx(
            'relative group px-4 py-2 rounded-lg',
            isOwn
              ? 'bg-primary text-background'
              : 'bg-background-elevated text-foreground'
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>

          {/* Action buttons */}
          <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="p-1 rounded bg-background-surface border border-primary/20 hover:bg-background-elevated transition-colors"
              aria-label="React"
            >
              <Smile className="w-3 h-3" />
            </button>
            <button
              onClick={onReply}
              className="p-1 rounded bg-background-surface border border-primary/20 hover:bg-background-elevated transition-colors"
              aria-label="Reply"
            >
              <Reply className="w-3 h-3" />
            </button>
          </div>

          {/* Quick reactions */}
          {showReactions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-full mt-1 right-0 flex gap-1 p-2 bg-background-surface border border-primary/20 rounded-lg shadow-elevated"
            >
              {['👍', '❤️', '😂', '🎉', '🚀'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact(emoji);
                    setShowReactions(false);
                  }}
                  className="text-xl hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1">
            {message.reactions.map((reaction, i) => (
              <button
                key={i}
                onClick={() => onReact(reaction.emoji)}
                className="px-2 py-1 rounded-full bg-background-elevated border border-primary/20 text-xs hover:bg-background transition-colors"
              >
                {reaction.emoji} {reaction.count}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: Chat (Team chat component)
 * NAMED_EXPORTS: ChatProps, ChatMessage
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
