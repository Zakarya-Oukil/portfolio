import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createPortfolioApi } from './server/portfolio-api.mjs';
const apiPlugin = (): Plugin => ({ name: 'portfolio-api', configureServer(server) { server.middlewares.use(createPortfolioApi()); }, configurePreviewServer(server) { server.middlewares.use(createPortfolioApi()); } });
export default defineConfig({
  plugins: [react(), apiPlugin()],
  resolve: { alias: { 'react-native': 'react-native-web' }, extensions: ['.web.tsx','.web.ts','.web.jsx','.web.js','.tsx','.ts','.jsx','.js'] },
  define: { __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'), global: 'window' },
  server: { port: 3000, host: '127.0.0.1', watch: { ignored: ['**/public/media/**', '**/server/*.json'] } }
});
