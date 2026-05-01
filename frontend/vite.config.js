import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy requests /api → backend Spring Boot (port 8080)
    // Giải quyết CORS khi dev: frontend 5173 → backend 8080
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  // Vitest — cấu hình unit test
  test: {
    globals: true,           // Cho phép dùng describe, it, expect không cần import
    environment: 'jsdom',    // Giả lập DOM cho React components
    setupFiles: './src/test/setup.js',  // Setup file chạy trước mỗi test
    css: { modules: { classNameStrategy: 'non-scoped' } }, // Hỗ trợ CSS modules
  },
})

