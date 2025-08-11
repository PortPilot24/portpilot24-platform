import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // 백엔드(Spring)
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },

      // AI들 — FastAPI 엔드포인트가 이미 /predictainer/... 형태라면 rewrite 불필요
      '/predictainer': {
        target: 'http://localhost:8000',   // ⚠️ 로컬에서 포트 겹치면 각자 다르게
        changeOrigin: true,
      },
      '/document-validator': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/harbor-agent': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/safety-detector': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/container-monitoring': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
