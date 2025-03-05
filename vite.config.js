import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shadcn/ui': '/node_modules/@shadcn/ui', // Add this alias if needed
    },
  },
})
