import { colors } from './src/styles/tailwindcss/color';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors,
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
        santokki: ['SanTokki', 'Pretendard', '-apple-system'],
        paperlogy: ['Paperlogy', 'Pretendard', '-apple-system'],
      },
    },
  },
  plugins: [],
};
