/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#09090B',
          900: '#0D0D10',
          850: '#111114',
          800: '#17171B',
          700: '#212126',
          600: '#2E2E35',
        },
        emerald: {
          DEFAULT: '#10B981',
          bright: '#34D399',
          dim: '#065F46',
        },
        blue: {
          DEFAULT: '#3B82F6',
          bright: '#60A5FA',
          dim: '#1E3A8A',
        },
        purple: {
          DEFAULT: '#A855F7',
          bright: '#C084FC',
          dim: '#581C87',
        },
        gold: {
          DEFAULT: '#F5B942',
          bright: '#FBCB6B',
          dim: '#92650C',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-emerald': '0 0 20px rgba(16,185,129,0.35), 0 0 60px rgba(16,185,129,0.12)',
        'glow-blue': '0 0 20px rgba(59,130,246,0.35), 0 0 60px rgba(59,130,246,0.12)',
        'glow-purple': '0 0 20px rgba(168,85,247,0.4), 0 0 70px rgba(168,85,247,0.15)',
        'glow-gold': '0 0 20px rgba(245,185,66,0.4), 0 0 60px rgba(245,185,66,0.15)',
        'glow-sm': '0 0 12px rgba(255,255,255,0.08)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        'radial-fade': 'radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, transparent 70%)',
      },
      backgroundSize: {
        grid: '38px 38px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-18px) translateX(6px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.75, filter: 'brightness(1.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        dash: {
          to: { strokeDashoffset: -200 },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.4s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        dash: 'dash 8s linear infinite',
      },
    },
  },
  plugins: [],
}
