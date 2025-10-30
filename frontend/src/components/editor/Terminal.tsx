/**
 * ============================================================================
 * ORUS BUILDER - TERMINAL COMPONENT (FIXED)
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-10T08:53:00-03:00
 * LAST_MODIFIED: 2025-10-10T11:10:00-03:00
 * COMPONENT_HASH: orus.frontend.component.terminal.20251010.TRM3I4J5.FIXED
 * 
 * PURPOSE:
 * - Integrated terminal emulator
 * - Command execution and output display
 * - Build logs and error messages
 * - Resizable and themeable
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: TerminalEmulatorAgent
 * - COGNITIVE_LEVEL: Intermediate
 * - AUTONOMY_DEGREE: 70
 * - TRINITY_INTEGRATED: None (Pure UI)
 * 
 * FIXES APPLIED:
 * ✅ Removed unused imports (Search, Settings)
 * ✅ Prefixed unused variables with underscore
 * ✅ Added null checks for commandHistory access
 * ✅ Fixed possibly undefined cmd variable
 * ============================================================================
 */

import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { SearchAddon } from 'xterm-addon-search';
import 'xterm/css/xterm.css';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
  X,
  Maximize2,
  Minimize2,
  Copy,
  Trash2,
} from 'lucide-react';
import { Tooltip } from '@components/common/Tooltip';
import toast from 'react-hot-toast';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface TerminalProps {
  /**
   * Terminal ID
   */
  id?: string;

  /**
   * Initial command to run
   */
  initialCommand?: string;

  /**
   * Working directory
   */
  cwd?: string;

  /**
   * Environment variables
   */
  env?: Record<string, string>;

  /**
   * Read-only mode
   * @default false
   */
  readOnly?: boolean;

  /**
   * Height
   * @default '400px'
   */
  height?: string | number;

  /**
   * On command callback
   */
  onCommand?: (command: string) => void;

  /**
   * On close callback
   */
  onClose?: () => void;
}

export interface TerminalCommand {
  command: string;
  timestamp: Date;
  exitCode?: number;
  output?: string;
}

// ============================================================================
// TERMINAL THEME CONFIGURATION
// ============================================================================

const ORUS_TERMINAL_THEME = {
  background: '#0A0E27',
  foreground: '#D4D4D4',
  cursor: '#00D4FF',
  cursorAccent: '#00D4FF',
  selectionBackground: '#264F78',
  black: '#000000',
  red: '#FF6B6B',
  green: '#51CF66',
  yellow: '#FFD93D',
  blue: '#4DABF7',
  magenta: '#CC5DE8',
  cyan: '#22B8CF',
  white: '#FFFFFF',
  brightBlack: '#666666',
  brightRed: '#FF8787',
  brightGreen: '#69DB7C',
  brightYellow: '#FFE066',
  brightBlue: '#74C0FC',
  brightMagenta: '#DA77F2',
  brightCyan: '#3BC9DB',
  brightWhite: '#FFFFFF',
};

// ============================================================================
// TERMINAL COMPONENT
// ============================================================================

export const Terminal: React.FC<TerminalProps> = ({
  id: _id = 'terminal', // ✅ FIXED: Prefixed with underscore (not used)
  initialCommand,
  cwd = '/',
  env: _env = {}, // ✅ FIXED: Prefixed with underscore (not used)
  readOnly = false,
  height = '400px',
  onCommand,
  onClose,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [commandHistory, setCommandHistory] = useState<TerminalCommand[]>([]);
  const [, setCurrentCommand] = useState(''); // ✅ FIXED: Prefixed with underscore
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize terminal
  useEffect(() => {
    if (!terminalRef.current) return;

    // Create terminal instance
    const term = new XTerm({
      theme: ORUS_TERMINAL_THEME,
      fontFamily: '"Fira Code", "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
      tabStopWidth: 4,
      allowTransparency: true,
      convertEol: true,
      disableStdin: readOnly,
    });

    xtermRef.current = term;

    // Add fit addon
    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;
    term.loadAddon(fitAddon);

    // Add web links addon
    term.loadAddon(new WebLinksAddon());

    // Add search addon
    term.loadAddon(new SearchAddon());

    // Open terminal in container
    term.open(terminalRef.current);
    fitAddon.fit();

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener('resize', handleResize);

    // Welcome message
    term.writeln('\x1b[1;32m╔══════════════════════════════════════════════════════╗\x1b[0m');
    term.writeln('\x1b[1;32m║          ORUS Builder Terminal v1.0.0                 ║\x1b[0m');
    term.writeln('\x1b[1;32m║          Trinity AI Integrated                        ║\x1b[0m');
    term.writeln('\x1b[1;32m╚══════════════════════════════════════════════════════╝\x1b[0m');
    term.writeln('');

    // Display working directory
    term.writeln(`\x1b[1;36mWorking Directory:\x1b[0m ${cwd}`);
    term.writeln('');

    // Initial prompt
    writePrompt(term);

    // Handle user input
    if (!readOnly) {
      let inputBuffer = '';

      term.onKey(({ key, domEvent }) => {
        const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

        if (domEvent.keyCode === 13) {
          // Enter key
          term.writeln('');
          
          if (inputBuffer.trim()) {
            executeCommand(term, inputBuffer.trim());
            
            // Add to history
            const cmd: TerminalCommand = {
              command: inputBuffer.trim(),
              timestamp: new Date(),
            };
            setCommandHistory((prev) => [...prev, cmd]);
            setCurrentCommand('');
            setHistoryIndex(-1);

            // Callback
            if (onCommand) {
              onCommand(inputBuffer.trim());
            }
          } else {
            writePrompt(term);
          }

          inputBuffer = '';
        } else if (domEvent.keyCode === 8) {
          // Backspace
          if (inputBuffer.length > 0) {
            inputBuffer = inputBuffer.slice(0, -1);
            term.write('\b \b');
          }
        } else if (domEvent.keyCode === 38) {
          // Up arrow - history
          if (commandHistory.length > 0) {
            const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
            if (newIndex >= 0) {
              setHistoryIndex(newIndex);
              const cmd = commandHistory[commandHistory.length - 1 - newIndex];
              
              // ✅ FIXED: Added null check
              if (cmd) {
                // Clear current line
                term.write('\r\x1b[K');
                writePrompt(term);
                term.write(cmd.command);
                
                inputBuffer = cmd.command;
              }
            }
          }
        } else if (domEvent.keyCode === 40) {
          // Down arrow - history
          const newIndex = Math.max(historyIndex - 1, -1);
          setHistoryIndex(newIndex);
          
          // Clear current line
          term.write('\r\x1b[K');
          writePrompt(term);
          
          if (newIndex >= 0) {
            const cmd = commandHistory[commandHistory.length - 1 - newIndex];
            // ✅ FIXED: Added null check
            if (cmd) {
              term.write(cmd.command);
              inputBuffer = cmd.command;
            }
          } else {
            inputBuffer = '';
          }
        } else if (printable) {
          inputBuffer += key;
          term.write(key);
        }

        setCurrentCommand(inputBuffer);
      });
    }

    // Execute initial command
    if (initialCommand) {
      setTimeout(() => {
        executeCommand(term, initialCommand);
      }, 500);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [initialCommand, cwd, readOnly, onCommand, commandHistory, historyIndex]);

  // Write prompt
  const writePrompt = (term: XTerm) => {
    term.write('\x1b[1;32m$\x1b[0m ');
  };

  // Execute command
  const executeCommand = async (term: XTerm, command: string) => {
    const parts = command.trim().split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    // Built-in commands
    switch (cmd) {
      case 'clear':
        term.clear();
        break;

      case 'help':
        term.writeln('\x1b[1;33mAvailable Commands:\x1b[0m');
        term.writeln('  clear    - Clear terminal screen');
        term.writeln('  help     - Show this help message');
        term.writeln('  pwd      - Print working directory');
        term.writeln('  echo     - Echo arguments');
        term.writeln('  build    - Build project');
        term.writeln('  test     - Run tests');
        term.writeln('  dev      - Start development server');
        term.writeln('');
        break;

      case 'pwd':
        term.writeln(cwd);
        break;

      case 'echo':
        term.writeln(args.join(' '));
        break;

      case 'build':
        term.writeln('\x1b[1;36m[BUILD]\x1b[0m Starting build process...');
        // Simulate build process
        setTimeout(() => {
          term.writeln('\x1b[1;32m[BUILD]\x1b[0m Build completed successfully!');
          writePrompt(term);
        }, 1000);
        return;

      case 'test':
        term.writeln('\x1b[1;36m[TEST]\x1b[0m Running tests...');
        // Simulate tests
        setTimeout(() => {
          term.writeln('\x1b[1;32m[TEST]\x1b[0m All tests passed!');
          writePrompt(term);
        }, 1500);
        return;

      case 'dev':
        term.writeln('\x1b[1;36m[DEV]\x1b[0m Starting development server...');
        term.writeln('\x1b[1;32m[DEV]\x1b[0m Server running on http://localhost:3000');
        break;

      default:
        term.writeln(`\x1b[1;31mCommand not found:\x1b[0m ${cmd}`);
        term.writeln('Type "help" for available commands');
        break;
    }

    writePrompt(term);
  };

  // Copy terminal content
  const handleCopy = () => {
    if (xtermRef.current) {
      const selection = xtermRef.current.getSelection();
      if (selection) {
        navigator.clipboard.writeText(selection);
        toast.success('Copied to clipboard');
      }
    }
  };

  // Clear terminal
  const handleClear = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
      toast.success('Terminal cleared');
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        'flex flex-col bg-background-surface rounded-lg border border-primary/20 overflow-hidden',
        isFullscreen && 'fixed inset-4 z-50'
      )}
      style={{ height: isFullscreen ? 'auto' : height }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-background-elevated border-b border-primary/20">
        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-error" />
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="w-3 h-3 rounded-full bg-accent" />
          </div>
          <span className="text-sm font-medium text-foreground ml-2">Terminal</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Tooltip content="Copy selection">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-background transition-colors"
              aria-label="Copy"
            >
              <Copy className="w-4 h-4 text-foreground-muted" />
            </button>
          </Tooltip>

          <Tooltip content="Clear terminal">
            <button
              onClick={handleClear}
              className="p-2 rounded-lg hover:bg-background transition-colors"
              aria-label="Clear"
            >
              <Trash2 className="w-4 h-4 text-foreground-muted" />
            </button>
          </Tooltip>

          <Tooltip content={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-background transition-colors"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-foreground-muted" />
              ) : (
                <Maximize2 className="w-4 h-4 text-foreground-muted" />
              )}
            </button>
          </Tooltip>

          {onClose && (
            <Tooltip content="Close terminal">
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-error/20 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-foreground-muted" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Terminal Container */}
      <div 
        ref={terminalRef} 
        className="flex-1 p-2 overflow-hidden"
        style={{ minHeight: '200px' }}
      />
    </motion.div>
  );
};

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: Terminal (Integrated terminal emulator)
 * NAMED_EXPORTS: TerminalProps, TerminalCommand
 * DEFAULT_AVAILABLE: false
 * COMPATIBILITY: internal
 * ============================================================================
 */
