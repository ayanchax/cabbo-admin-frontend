
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'remove-non-production-folders',
      apply: 'build',
      async closeBundle() {
        const outDir = path.resolve(__dirname, 'dist')
        await Promise.all([
          fs.rm(path.join(outDir, 'docs'), { recursive: true, force: true }),
          fs.rm(path.join(outDir, 'favicon.svg'), { force: true }),
        ])
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      ignored: ['**/docs/**', '**/payloads/**'],
    },
  },
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('react-router') || id.includes('@remix-run/router')) {
            return 'vendor-router'
          }

          if (id.includes('@tanstack/')) {
            return 'vendor-query'
          }

          if (id.includes('react-hot-toast') || id.includes('goober')) {
            return 'vendor-toast'
          }

          if (id.includes('react-day-picker') || id.includes('date-fns')) {
            return 'vendor-datetime'
          }

          if (id.includes('lucide-react')) {
            return 'vendor-icons'
          }

          if (id.includes('axios')) {
            return 'vendor-http'
          }

          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('scheduler')
          ) {
            return 'vendor-react'
          }
        },
      },
      checks: {
        pluginTimings: false,
      },
    },
  },
})
