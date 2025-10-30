/**
 * ============================================================================
 * ORUS BUILDER - TAILWIND CSS CONFIGURATION
 * ============================================================================
 * 
 * DEVELOPER: Tulio (ORUS Creator)
 * CREATED: 2025-10-09T20:36:00-03:00
 * LAST_MODIFIED: 2025-10-09T20:36:00-03:00
 * COMPONENT_HASH: orus.frontend.tailwind.config.20251009.TWD4F5G6
 * 
 * PURPOSE:
 * - Tailwind CSS configuration with ORUS dark cognitive theme
 * - Custom color palette (Dark Cognitive + Light Minimal)
 * - Animations and transitions for premium UX
 * - Typography scale optimized for readability
 * 
 * COGNITIVE DESIGN SYSTEM:
 * - Primary: Cyan vibrante (#00D9FF) - Energia tech
 * - Secondary: Índigo (#6366F1) - Inteligência
 * - Accent: Verde neon (#00FFA3) - Sucesso/Geração
 * - Background: Azul escuro (#0A0E27) - Profundidade cognitiva
 * ============================================================================
 */

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark Cognitive Theme (Default)
        background: {
          DEFAULT: '#0A0E27', // Deep blue-black
          surface: '#131B3A',  // Navy surface
          elevated: '#1A2342', // Elevated surface
        },
        foreground: {
          DEFAULT: '#F0F4FF', // Soft blue-white
          muted: '#8B9BC6',   // Blue-grey
          subtle: '#5A6B94',  // Subtle blue-grey
        },
        primary: {
          DEFAULT: '#00D9FF', // Vibrant cyan
          hover: '#00B8DC',   // Hover state
          active: '#0097BA',  // Active state
          glow: '#00F0FF',    // Glow effect
        },
        secondary: {
          DEFAULT: '#6366F1', // Indigo
          hover: '#5558E3',   // Hover state
          active: '#4A4DD5',  // Active state
        },
        accent: {
          DEFAULT: '#00FFA3', // Neon green
          hover: '#00E591',   // Hover state
          success: '#10B981', // Success green
        },
        // Semantic Colors
        success: '#00FFA3',
        warning: '#FBBF24',
        error: '#EF4444',
        info: '#00D9FF',
        
        // Light Minimal Theme (Alternative)
        light: {
          background: '#FAFBFF',
          surface: '#FFFFFF',
          foreground: '#0F172A',
          muted: '#64748B',
          primary: '#2563EB',
          secondary: '#8B5CF6',
          accent: '#10B981',
        },
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
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
      
      backdropBlur: {
        xs: '2px',
      },
      
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 217, 255, 0.3)',
        'glow-green': '0 0 20px rgba(0, 255, 163, 0.3)',
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.3)',
        'elevated': '0 10px 40px rgba(0, 0, 0, 0.5)',
      },
      
      backgroundImage: {
        'gradient-cognitive': 'linear-gradient(135deg, #00D9FF 0%, #6366F1 100%)',
        'gradient-success': 'linear-gradient(135deg, #00FFA3 0%, #00D9FF 100%)',
        'gradient-neural': 'radial-gradient(circle at 50% 50%, rgba(0, 217, 255, 0.1) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
};

/**
 * DESIGN TOKENS REFERENCE:
 * ============================================================================
 * Dark Cognitive (Default):
 *   - Background: #0A0E27 (Deep blue-black)
 *   - Primary: #00D9FF (Vibrant cyan)
 *   - Secondary: #6366F1 (Indigo)
 *   - Accent: #00FFA3 (Neon green)
 * 
 * Light Minimal (Alternative):
 *   - Background: #FAFBFF (Light blue-white)
 *   - Primary: #2563EB (Royal blue)
 *   - Secondary: #8B5CF6 (Purple)
 *   - Accent: #10B981 (Emerald green)
 * ============================================================================
 */
