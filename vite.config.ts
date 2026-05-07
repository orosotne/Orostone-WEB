import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Browsers from the last ~3 years (matches `caniuse-db` baseline2024).
        // Vite default is 'modules' (ES2020+); we go a hair newer for smaller output.
        target: 'es2022',
        // No source maps in production — they're a security/IP concern and add ~30%
        // to the dist/ size. Devs use the Vercel preview build with source maps if
        // they need to debug a production issue.
        sourcemap: false,
        // Split CSS per dynamically-imported chunk so route CSS doesn't all land
        // in the initial stylesheet (already enabled by default; explicit for clarity).
        cssCodeSplit: true,
        // Inline assets ≤ 4KB as data URLs (Vite default). Above that, emit a file
        // and use the cache-control: immutable rule from vercel.json.
        assetsInlineLimit: 4096,
        rollupOptions: {
          input: path.resolve(__dirname, 'index.html'),
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              'vendor-ui': ['framer-motion', 'lucide-react'],
              'vendor-gsap': ['gsap', 'lenis'],
              'vendor-supabase': ['@supabase/supabase-js'],
            },
          },
        },
      },
    };
});
