import fs from 'fs';
import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid({
    ssr: false
  })],
  build: {
      target: 'esnext'
  },
  optimizeDeps: {
    force: true,
    include: ['@suid/system']
 },
  resolve: {
    
    dedupe: ['solid-js']
},
server: {
  https: {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem'),
  },
  cors: true,
  hmr: {
    protocol: 'wss',
  },
  strictPort: true,
  open: true,
  headers: {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
  },
},

});
