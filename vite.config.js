import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/FRLG-Tracker/',
  server: {
    host: true, // Exposes on LAN: http://<your-ip>:5173
    port: 5173,
  },
})
