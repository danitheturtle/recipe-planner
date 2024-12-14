/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src-js/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        background: "var(--background)"
      }
    }
  },
  plugins: [],
};
