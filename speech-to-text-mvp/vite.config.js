import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages uses /{repo-name}/ URL structure
  base: '/20250428-test1/',
})
// Trigger deployment with Finnish TTS support
