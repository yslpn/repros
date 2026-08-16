import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  source: {
    entry: {
      index: './src/valibot-import.ts',
    },
  },
  output: {
    distPath: {
      root: './dist-valibot-rsbuild',
    },
  },
});
