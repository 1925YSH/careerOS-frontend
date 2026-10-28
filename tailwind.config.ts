import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: '#0B1220', // Primary background, headings, dark hero
          primary: '#2563EB', // Primary action buttons, links, active states
          ai: '#06B6D4', // AI accent, match scores, agent UI
          success: '#16A34A', // High match, verified, success states
          warning: '#D97706', // Needs review, skill gaps, stale
          danger: '#DC2626', // Errors, destructive actions
          surface: '#F8FAFC', // Page background, subtle panels
          border: '#CBD5E1', // Cards, dividers, form borders
        },
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

