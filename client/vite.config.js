import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // send every /api request to the Node.js server
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
