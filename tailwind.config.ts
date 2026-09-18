import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        focus: '#2563eb',
        rest: '#16a34a',
        warning: '#f59e0b',
      },
    },
  },
  plugins: [],
};

export default config;
