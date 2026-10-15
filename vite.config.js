import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // the 3D scene (three.js) is lazy-loaded in its own chunk, so a larger limit is expected
    chunkSizeWarningLimit: 1200,
  },
})
