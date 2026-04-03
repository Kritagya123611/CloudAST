import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this 'define' block to fake the Node process variable
  define: {
    'process.env': {},
    'global': 'window'
  }
})