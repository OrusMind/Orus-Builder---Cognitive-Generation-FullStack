/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔧 ORUS BUILDER - POSTCSS CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════════
 */

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
};
