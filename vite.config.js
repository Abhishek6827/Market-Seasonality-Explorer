import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Market-Seasonality-Explorer/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and related libraries
          "react-vendor": ["react", "react-dom", "react/jsx-runtime"],

          // UI library chunks
          "radix-ui": [
            "@radix-ui/react-select",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-label",
            "@radix-ui/react-slot",
          ],

          // Animation library
          "framer-motion": ["framer-motion"],

          // Date utilities
          "date-utils": ["date-fns"],

          // Chart and visualization
          charts: ["recharts"],

          // Icons
          icons: ["lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
