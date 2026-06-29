import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
    },
  },
  html: {
    template: './src/index.html',
  },
  server: {
    host: '127.0.0.1',
    port: 4171,
    publicDir: { name: 'public' },
  },
  output: {
    copy: [
      {
        from: 'copied/copy-config.json',
        to: 'copy-config.json',
      },
    ],
  },
});
