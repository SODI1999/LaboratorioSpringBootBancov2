/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FBFBFA',
          subtle: '#F4F3EE',
          muted: '#EAE8E1',
        },
        ink: {
          DEFAULT: '#18181B',
          pure: '#0C0C0E',
          secondary: '#52525B',
          tertiary: '#71717A',
          border: '#E4E2DC',
        },
        brand: {
          accent: '#18181B',
          gold: '#C5A880',
          emerald: '#166534',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 8px 20px -4px rgba(0, 0, 0, 0.03)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        'card-3d': '0 25px 50px -12px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'card-white-3d': '0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
};
