import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    // Mirrors production, where the backend serves this build from its own
    // origin, so relative /api/v1 URLs work in dev too.
    proxy: {
      "/api": {
        target: process.env.BACKEND_URL || "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
})
