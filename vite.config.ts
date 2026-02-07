import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Multi-page build configuration
      // www.orostone.sk -> index.html
      // eshop.orostone.sk -> eshop.html
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
            eshop: path.resolve(__dirname, 'eshop.html'),
          },
          output: {
            // Shared chunks pre optimalizáciu bundle size
            manualChunks: {
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              'vendor-ui': ['framer-motion', 'lucide-react'],
              'vendor-utils': ['@supabase/supabase-js', 'gsap', 'lenis'],
            },
          },
        },
      },
    };
});
