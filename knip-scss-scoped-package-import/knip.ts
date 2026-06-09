import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/index.ts'],
  project: ['src/**/*.{ts,scss}'],
  compilers: {
    scss: true,
  },
};

export default config;
