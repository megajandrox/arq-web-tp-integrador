import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Dirección del backend
        changeOrigin: true,             // Cambiar el origen de la solicitud
        secure: false,                  // Deshabilitar SSL si es necesario
      },
    },
  },
})
