import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://train-u5pc.vercel.app",
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {
        target: "https://train-u5pc.vercel.app",
        changeOrigin: true,
        ws: true,
        secure: false,
      },
    },
  },
});

