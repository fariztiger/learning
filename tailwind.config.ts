import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05080F',
          900: '#080D18',
          850: '#0B1220',
          800: '#0F1729',
          700: '#152038',
          600: '#1D2B47',
          500: '#27395C',
        },
        gold: {
          50: '#FFF9EC',
          100: '#FFEFC9',
          200: '#FFE19A',
          300: '#FFCE63',
          400: '#F5B942',
          500: '#E8A020',
          600: '#C47F10',
          700: '#96600C',
          800: '#6B430A',
        },
        bull: '#22C98B',
        bear: '#FF5C7A',
        sky2: '#4CC9F0',
        violet2: '#8B7CF6',
        mist: {
          100: '#E8EDF7',
          200: '#C4CEDE',
          300: '#97A3B8',
          400: '#6B7891',
          500: '#48546C',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(245, 185, 66, 0.35)',
        card: '0 1px 0 rgba(255,255,255,0.04), 0 12px 40px -12px rgba(0,0,0,0.6)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        'radial-gold':
          'radial-gradient(1000px 500px at 80% -10%, rgba(245,185,66,0.16), transparent 60%), radial-gradient(800px 420px at 10% 10%, rgba(76,201,240,0.10), transparent 55%)',
        'grid-fade':
          'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease both',
        'fade-in': 'fade-in 0.4s ease both',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        shimmer: 'shimmer 2.2s linear infinite',
        float: 'float 7s ease-in-out infinite',
        ticker: 'ticker 32s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
