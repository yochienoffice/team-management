/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'widgetBg': "#232935",
        'hs-sidebar': '#2D2F3A',
        'hs-sidebar-text': '#F5F6F8',
        'hs-sidebar-text-hover': '#F5F6F8',
        'hs-logout': '#181C1F',
        'hs-sidebar-hover': '#51BAA9',
        'hs-text-secondary': '#475468',
        'hs-primary': '#6A41C6',
        'hs-main-bg-highlight': '#FAF5FF',
        'hs-main-bg': '#F9FAFB',
        'hs-toggle-active': '#F9F5FF',
        'hs-toggle-text-active': '#6941C6',
        'hs-toggle-text-primary': '#344054',
        'hs-text-warning': '#F04438',
        'hs-icon-normal': '#475467',
        'hs-icon-warning': '#B42318',
      },
      boxShadow: {
        'list-shadow': 'rgba(0, 0, 0, 0.2) 0px 3px 10px'
      },
      transitionProperty: {
        'height': 'height',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      flex: {
        '2': '2 2 0%',
        '5': '5 5 0%',
      },
      margin: {
        '70': '272px',
      },
      screens: {
        'xs': '480px',
      },
      gap: {
        '17': '68px',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}