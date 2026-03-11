import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'risk-very-low': '#22c55e',
        'risk-low': '#84cc16',
        'risk-moderate': '#eab308',
        'risk-high': '#f97316',
        'risk-very-high': '#ef4444',
      },
    },
  },
  plugins: [],
};

export default config;
