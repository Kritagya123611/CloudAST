import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    // This injects a true Node environment (process, global, Buffer) into the browser
    nodePolyfills() 
  ],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  }
})