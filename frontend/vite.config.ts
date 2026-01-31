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
    host: true, // Permettre l'accès externe
    proxy: {
      // Toutes les requêtes /api sont redirigées vers le gateway
      '/api': {
        target: 'http://chift-gateway:3000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('❌ Proxy Error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('📡 Proxying:', req.method, req.url, '-> http://chift-gateway:3000');
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('📬 Proxy Response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
})
