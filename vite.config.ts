import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { pageFor } from './src/data/sitePages'
import { renderPageHead } from './src/data/renderPageHead'
import svgr from 'vite-plugin-svgr' 

// https://vitejs.dev/config/
export default defineConfig({
  // Сайт разворачивается в корне https://krasnotsarstvo.ru/.
  base: '/',
  build: { manifest: true },
  plugins: [
    { name: 'development-page-head', apply: 'serve', transformIndexHtml(html, context) {
      const path = (context.originalUrl ?? context.path).split('?')[0];
      return html.replace('<!--page-head-->', renderPageHead(pageFor(path)));
    } },
    react(),
    svgr() 
  ],
})
