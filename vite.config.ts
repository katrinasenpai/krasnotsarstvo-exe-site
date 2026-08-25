import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr' 

// https://vitejs.dev/config/
export default defineConfig({
  // Сайт разворачивается в корне https://krasnotsarstvo.ru/.
  base: '/',
  plugins: [
    react(),
    svgr() 
  ],
})
