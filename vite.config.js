import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: Use VITE_BASE environment variable at build time so CI can set the correct base path
// for GitHub Pages. If not provided, default to '/ReactPractice/'.
const basePath = process.env.VITE_BASE || '/ReactPractice/'

export default defineConfig({
  base: basePath,
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
})
