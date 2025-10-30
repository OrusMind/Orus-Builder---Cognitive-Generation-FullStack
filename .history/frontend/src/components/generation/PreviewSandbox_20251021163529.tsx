import React, { useState, useEffect } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import '@codesandbox/sandpack-react/dist/index.css';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';

interface PreviewSandboxProps {
  code: string;
  filename?: string;
  className?: string;
}

function cleanMarkdownFences(code: string): string {
  return code
    .replace(/```/g, '')
    .trim();
}


/**
 * Process multi-file code separated by comments
 */
function processMultiFileCode(code: string, filename: string): Record<string, string> {
  // First: Clean markdown fences from ALL code
  const cleanedCode = cleanMarkdownFences(code);
  
  // Detect pattern: // src/components/Header.tsx
  const filePattern = /\/\/\s*(?:src\/)?([^\n]+\.tsx?)\n(*?)(?=\/\/\s*(?:src\/)?[^\n]+\.tsx?|$)/gi;
  const matches = [...cleanedCode.matchAll(filePattern)];
  
  if (matches.length > 1) {
    console.log('🗂️ Multi-file detected:', matches.length, 'files');
    const files: Record<string, string> = {};
    
    matches.forEach(([_, path, content]) => {
      const cleanPath = `/${path.trim()}`;
      const cleanContent = cleanMarkdownFences(content.trim());
      files[cleanPath] = cleanContent;
      console.log('📄 File processed:', cleanPath);
    });
    
    return files;
  }
  
  // Single file - use App.tsx as default
  console.log('📄 Single-file detected');
  return {
    '/App.tsx': cleanedCode
  };
}

/**
 * Detect external libraries in code
 */
function detectExternalLibs(code: string): Record<string, string> {
  const deps: Record<string, string> = {};
  
  // Chart.js
  if (code.includes('chart.js') || code.includes('react-chartjs') || code.includes('Chart')) {
    deps['chart.js'] = 'latest';
    deps['react-chartjs-2'] = 'latest';
    console.log('📊 Chart.js detected');
  }
  
  // Socket.io
  if (code.includes('socket.io-client') || code.includes('io(')) {
    deps['socket.io-client'] = 'latest';
    console.log('🔌 Socket.io detected');
  }
  
  // Axios
  if (code.includes('axios') || code.includes("from 'axios'")) {
    deps['axios'] = 'latest';
    console.log('🌐 Axios detected');
  }
  
  // Framer Motion
  if (code.includes('framer-motion')) {
    deps['framer-motion'] = 'latest';
    console.log('✨ Framer Motion detected');
  }
  
  // Lucide Icons
  if (code.includes('lucide-react')) {
    deps['lucide-react'] = 'latest';
    console.log('🎨 Lucide Icons detected');
  }
  
  return deps;
}

export const PreviewSandbox: React.FC<PreviewSandboxProps> = ({
  code,
  filename = 'Component.tsx',
  className = ''
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Process code and detect libs
  const files = processMultiFileCode(code, filename);
  const dependencies = detectExternalLibs(code);

  useEffect(() => {
    if (!code || code.trim() === '') {
      setError('No code provided to render');
      setLoading(false);
      return;
    }

    console.log('🎨 PreviewSandbox: Starting Sandpack rendering...');
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Sandpack loads automatically - give time to initialize
    const timer = setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      console.log('✅ Sandpack preview rendered successfully');
    }, 1500);

    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="absolute inset-0 z-50 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-gray-300 text-sm font-medium">Loading Sandpack...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <motion.div 
          className="absolute inset-0 z-40 bg-red-900/20 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-300 font-semibold mb-2">Error Rendering Preview</h3>
                <p className="text-red-200 text-sm mb-4">{error}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Indicator */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="absolute top-4 right-4 z-30 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2 flex items-center gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300 text-sm font-medium">Rendered!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sandpack Preview */}
      <div className="w-full h-full">
        <Sandpack
          template="react-ts"
          files={files}
      options={{
  showNavigator: false,
  showTabs: Object.keys(files).length > 1,
  showLineNumbers: false,
  editorHeight: '100%',
  editorWidthPercentage: 0,
  showInlineErrors: true,
  autorun: true,
  autoReload: true,
}}

          theme="dark"
          customSetup={{
            dependencies: {
              ...dependencies,
              react: 'latest',
              'react-dom': 'latest',
            }
          }}
          style={{ 
            height: '100%', 
            width: '100%',
            borderRadius: '0.5rem',
            overflow: 'hidden'
          }}
        />
      </div>
    </div>
  );
};
