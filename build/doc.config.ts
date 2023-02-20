import baseConfig from './base.config';
import { defineConfig } from 'vite';

export default defineConfig({
  ...baseConfig,
  base: '/vue3-sign',
  build: {
    outDir: 'docs',
  },
});
