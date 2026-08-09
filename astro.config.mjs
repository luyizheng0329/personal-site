// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://luyiz.github.io',
  base: '/personal-site',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/love/'), // 排除未启用的恋爱模块
    }),
  ],

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
