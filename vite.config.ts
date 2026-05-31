import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/jizhang-bear/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png'],
      manifest: {
        name: '自嘲熊记账',
        short_name: '🐻记账',
        description: '自嘲熊主题的可爱记账应用',
        theme_color: '#fff8f0',
        background_color: '#fff8f0',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/jizhang-bear/',
        icons: [
          {
            src: 'favicon.png',
            sizes: '48x48 72x72 96x96 128x128 144x144 192x192 256x256 512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'external-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
            },
          },
        ],
      },
    }),
  ],
});
