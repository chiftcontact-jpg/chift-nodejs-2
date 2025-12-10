import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3046,
    proxy: {
      // User Service (authentification et gestion utilisateurs)
      '/api/users': {
        target: 'http://localhost:3050',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/users/, '/api/users'),
      },
      // Backend principal (business logic)
      '/api': {
        target: 'http://localhost:3045',
        changeOrigin: true,
      },
    },
  },
})
