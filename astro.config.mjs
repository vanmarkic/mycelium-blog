import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind(),
    sitemap()
  ],
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'nl', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  site: 'https://vanmarkic.github.io',
  base: '/mycelium-blog/',
});
