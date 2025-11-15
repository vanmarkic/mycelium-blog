/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mycelium: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.mycelium.600'),
              '&:hover': {
                color: theme('colors.mycelium.700'),
              },
            },
            h1: {
              color: theme('colors.gray.900'),
            },
            h2: {
              color: theme('colors.gray.900'),
            },
            h3: {
              color: theme('colors.gray.800'),
            },
            code: {
              color: theme('colors.mycelium.700'),
            },
            pre: {
              backgroundColor: theme('colors.gray.50'),
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.mycelium.400'),
              '&:hover': {
                color: theme('colors.mycelium.300'),
              },
            },
            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.gray.100'),
            },
            h3: {
              color: theme('colors.gray.200'),
            },
            code: {
              color: theme('colors.mycelium.300'),
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
