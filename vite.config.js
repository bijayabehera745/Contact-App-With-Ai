import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // <-- This is the main fix
  server: { port: 5173 },
  build: { outDir: 'dist' }
})