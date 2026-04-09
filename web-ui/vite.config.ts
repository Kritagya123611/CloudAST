import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Keep your existing Node polyfills so the browser doesn't crash
  define: {
    'process.env': {}
  },
  
  // ADD THIS: Fixes the Rollup Babel build error in Vercel
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  }
})