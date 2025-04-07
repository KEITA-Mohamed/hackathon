import postcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

/** @type {import('postcss').Config} */
const config = {
  plugins: {
    [postcss]: {},
    autoprefixer: {},
  },
};

export default config;
