import react from "@vitejs/plugin-react"
import * as path from "node:path"
import { defineConfig } from "vitest/config"
import { loadEnv } from "vite"
import packageJson from "./package.json" with { type: "json" }

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  
  return {
    plugins: [react()],
    base: "/",

    server: {
      open: true,
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },

    build: {
      outDir: "dist",
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },

    test: {
      root: import.meta.dirname,
      name: packageJson.name,
      environment: "jsdom",

      typecheck: {
        enabled: true,
        tsconfig: path.join(import.meta.dirname, "tsconfig.json"),
      },

      globals: true,
      watch: false,
      setupFiles: ["./src/setupTests.ts"],
    },
  }
})
