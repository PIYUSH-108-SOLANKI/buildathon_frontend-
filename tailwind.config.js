/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        peach: {
          DEFAULT: '#F9DDCA',
          light: '#FDF5EF',
          tint: '#FFF9F5',
          dark: '#E8C5AC',
        },
        ivory: {
          DEFAULT: '#FBFAF8',
          card: '#FFFFFF',
          subtle: '#F6F4F0',
        },
        orange: {
          accent: '#F28C55',
          hover: '#E57B42',
          light: '#FFF0E8',
        },
        charcoal: {
          DEFAULT: '#292623',
          muted: '#79716B',
          faint: '#A8A29E',
        },
        border: {
          warm: '#EFE8E1',
          subtle: '#E6DFD7',
          strong: '#D5CDC4',
        },
        status: {
          healthy: {
            DEFAULT: '#10B981',
            text: '#047857',
            bg: '#ECFDF5',
            border: '#A7F3D0',
          },
          degraded: {
            DEFAULT: '#F59E0B',
            text: '#B45309',
            bg: '#FFFBEB',
            border: '#FDE68A',
          },
          critical: {
            DEFAULT: '#E11D48',
            text: '#BE123C',
            bg: '#FFF1F2',
            border: '#FECDD3',
          },
          ai: {
            DEFAULT: '#8B5CF6',
            text: '#6D28D9',
            bg: '#F5F3FF',
            border: '#DDD6FE',
          },
          recovering: {
            DEFAULT: '#F28C55',
            text: '#C2410C',
            bg: '#FFF7ED',
            border: '#FFEDD5',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'soft-sm': '0 1px 3px rgba(41, 38, 35, 0.04), 0 1px 2px rgba(41, 38, 35, 0.02)',
        'soft-md': '0 4px 16px -2px rgba(41, 38, 35, 0.05), 0 2px 6px -1px rgba(41, 38, 35, 0.03)',
        'soft-lg': '0 10px 30px -4px rgba(41, 38, 35, 0.07), 0 4px 12px -2px rgba(41, 38, 35, 0.03)',
        'soft-xl': '0 20px 40px -6px rgba(41, 38, 35, 0.09), 0 8px 16px -4px rgba(41, 38, 35, 0.04)',
      },
    },
  },
  plugins: [],
}
