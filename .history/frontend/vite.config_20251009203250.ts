 
/**
 * ============================================================================
 * ORUS BUILDER - VITE CONFIGURATION
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T20:36:00-03:00
 * LAST_MODIFIED: 2025-10-09T20:36:00-03:00
 * COMPONENT_HASH: orus.frontend.vite.config.20251009.VIT3E4F5
 * 
 * PURPOSE:
 * - Vite build configuration for ORUS Builder frontend
 * - React + SWC optimization for maximum performance
 * - Path aliases matching tsconfig.json
 * - Development server with HMR
 * 
 * COGNITIVE AGENT DNA:
 * - AGENT_TYPE: BuildConfigurationAgent
 * - COGNITIVE_LEVEL: Advanced
 * - AUTONOMY_DEGREE: 95
 * - TRINITY_INTEGRATED: Cerebro (Build Logic)
 * ============================================================================
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // SWC optimization
      jsxImportSource: '@emotion/react',
      plugins: [],
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },

  server: {
    port: 3000,
    host: true,
    strictPort: true,
    open: false,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'ws://localhost:5000',
        ws: true,
        changeOrigin: true,
      },
    },
  },

  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-state': ['zustand', '@tanstack/react-query'],
          'vendor-ui': ['framer-motion', 'lucide-react'],
          'vendor-editor': ['@monaco-editor/react', 'monaco-editor'],
          'vendor-socket': ['socket.io-client', 'axios'],
        },
      },
    },
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      '@tanstack/react-query',
      'axios',
      'socket.io-client',
    ],
  },

  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});

/**
 * EXPORT MANIFEST
 * ============================================================================
 * PRIMARY_EXPORT: Vite configuration object
 * NAMED_EXPORTS: None
 * DEFAULT_AVAILABLE: true
 * COMPATIBILITY: internal
 * ============================================================================
 */
