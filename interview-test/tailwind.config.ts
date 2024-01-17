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
        green: {
          '50': '#eefff4',
          '100': '#d7ffe8',
          '200': '#b1ffd3',
          '300': '#75ffb2',
          '400': '#32f689',
          '500': '#07da66',
          '600': '#00ba53',
          '700': '#039245',
          '800': '#09723a',
          '900': '#0a5d32',
          '950': '#003519',
        },
      },
    },
  },
  plugins: [],
};

export default config;
