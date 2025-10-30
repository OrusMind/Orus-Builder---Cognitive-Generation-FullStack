/**
 * ============================================================================
 * ORUS BUILDER - TAILWIND CSS CONFIGURATION (FIXED)
 * ============================================================================
 */

import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ✅ USAR CSS VARIABLES (compatível com globals.css)
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: 'var(--secondary-hover)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
        },
        background: {
          DEFAULT: 'var(--background)',
          surface: 'var(--background-surface)',
          elevated: 'var(--background-elevated)',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          muted: 'var(--foreground-muted)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        info: 'var(--info)',
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      
      animation: {
        'pulse-cognitive': 'pulse-cognitive 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-in',
      },
      
      keyframes: {
        'pulse-cognitive': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        'glow': {
          'from': { boxShadow: '0 0 10px #00D9FF, 0 0 20px #00D9FF' },
          'to': { boxShadow: '0 0 20px #00D9FF, 0 0 40px #00D9FF, 0 0 60px #00D9FF' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-in': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      
      boxShadow: {
        'glow-cyan': 'var(--shadow-glow-cyan)',
        'glow-green': 'var(--shadow-glow-green)',
        'glow-purple': 'var(--shadow-glow-purple)',
        'elevated': 'var(--shadow-elevated)',
      },
      
      backgroundImage: {
        'gradient-cognitive': 'var(--gradient-cognitive)',
        'gradient-ai': 'var(--gradient-ai)',
        'gradient-success': 'var(--gradient-success)',
      },
    },
  },
  plugins: [],
};

export default config;
