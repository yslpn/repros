import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: './dist-valibot-vite',
    rollupOptions: {
      input: './src/valibot-import.ts',
    },
  },
});
