
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // This allows process.env.API_KEY to be available in the browser
    'process.env': JSON.stringify(process.env)
  },
  build: {
    outDir: 'dist',
    target: 'esnext'
  }
});
