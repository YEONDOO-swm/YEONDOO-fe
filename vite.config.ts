import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import commonjs from 'vite-plugin-commonjs';


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), commonjs()],
    define: {
        'process.env': process.env,
    },
    server: {
        host: true,
    },
    base: './',
    optimizeDeps: {
        include: ['mermaid'],
        exclude: ["HeightSharp"]
      }
});
