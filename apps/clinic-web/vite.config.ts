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
        name: "SHS Clinic Dashboard",
        short_name: "SHS Clinic",
        description:
          "Manage patient flow in real time — works offline during load shedding.",
        theme_color: "#1E3A8A",
        background_color: "#F8FAFC",
        display: "standalone",
        orientation: "landscape",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
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
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api/],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  server: {
    port: 5174,
  },
});
