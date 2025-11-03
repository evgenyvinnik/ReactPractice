import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: Set the base path to match your GitHub repo name for correct asset loading on GitHub Pages.
// Replace 'ReactPractice' with your actual repo name if different.
export default defineConfig({
  base: '/ReactPractice/',
  plugins: [react()]
})
