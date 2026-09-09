/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Estos tokens cambian de valor según la superficie: una sección con
           data-surface="light" redefine las variables y todo el contenido que
           hay dentro se adapta sin tocar una sola clase. Ver src/index.css. */
        void: 'var(--c-void)',
        ink: 'var(--c-ink)',
        surface: 'var(--c-surface)',
        raised: 'var(--c-raised)',
        hair: 'var(--c-hair)',
        glass: 'var(--c-glass)',
        heading: 'var(--c-heading)',
        silver: {
          100: 'var(--c-s100)',
          200: 'var(--c-s200)',
          300: 'var(--c-s300)',
          400: 'var(--c-s400)',
          500: 'var(--c-s500)',
          600: 'var(--c-s600)',
        },
        /* El azul de marca es fijo en las dos superficies. */
        electric: {
          DEFAULT: '#0B84FF',
          400: '#3AA0FF',
          300: 'var(--c-electric-300)',
          600: '#0060D6',
          700: '#0045A0',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(11,132,255,.35), 0 12px 48px -12px rgba(11,132,255,.55)',
        'glow-sm': '0 0 24px -6px rgba(11,132,255,.6)',
        plate: 'var(--sh-plate)',
      },
      backgroundImage: {
        grid: 'linear-gradient(var(--c-grid) 1px,transparent 1px),linear-gradient(90deg,var(--c-grid) 1px,transparent 1px)',
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
