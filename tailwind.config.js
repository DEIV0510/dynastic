/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#04060B',
        ink: '#080B12',
        surface: '#0B1019',
        raised: '#111827',
        hair: 'rgba(255,255,255,0.08)',
        electric: {
          DEFAULT: '#0B84FF',
          400: '#3AA0FF',
          300: '#6FBBFF',
          600: '#0060D6',
          700: '#0045A0',
        },
        silver: {
          100: '#F2F6FB',
          200: '#D7DEE8',
          300: '#AEB9C8',
          400: '#8593A6',
          500: '#5F6C7E',
          600: '#3C4655',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(11,132,255,.35), 0 12px 48px -12px rgba(11,132,255,.55)',
        'glow-sm': '0 0 24px -6px rgba(11,132,255,.6)',
        plate: '0 24px 60px -30px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.06)',
      },
      backgroundImage: {
        'silver-sheen': 'linear-gradient(105deg,#F2F6FB 0%,#AEB9C8 38%,#FFFFFF 52%,#8593A6 68%,#E6ECF4 100%)',
        'electric-sheen': 'linear-gradient(105deg,#6FBBFF 0%,#0B84FF 45%,#9BD2FF 55%,#0060D6 100%)',
        grid: 'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        sweep: { '0%': { transform: 'translateX(-120%)' }, '100%': { transform: 'translateX(220%)' } },
        pulseGlow: { '0%,100%': { opacity: '.45' }, '50%': { opacity: '.9' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        sweep: 'sweep 2.2s cubic-bezier(.4,0,.2,1) infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
};
