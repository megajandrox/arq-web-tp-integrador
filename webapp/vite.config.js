import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias para la carpeta src
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Dirección del backend
        changeOrigin: true,             // Cambiar el origen de la solicitud
        secure: false,                  // Deshabilitar SSL si es necesario
      },
    },
  },
});
