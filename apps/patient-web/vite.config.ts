import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.jpg", "icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "Smart Health — Your Health, Your Time",
        short_name: "SmartHealth",
        description:
          "Book clinic appointments and track queues — works offline, even during load shedding.",
        theme_color: "#1E3A8A",
        background_color: "#F8FAFC",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,woff2}"],
        runtimeCaching: [
          {
            // Public clinics list — safe to cache
            urlPattern: /\/api\/v1\/clinics$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "shs-public-clinics",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
          {
            // Public queue status — safe to cache
            urlPattern: /\/api\/v1\/appointments\/queue\//,
            handler: "NetworkFirst",
            options: {
              cacheName: "shs-public-queue",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  server: {
    port: 5175,
  },
});
