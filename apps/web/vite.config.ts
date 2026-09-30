/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@aip/shared-types': path.resolve(__dirname, '../../packages/shared-types/src/index.ts'),
      '@aip/shared-utils': path.resolve(__dirname, '../../packages/shared-utils/src/index.ts'),
      '@aip/policy-engine': path.resolve(__dirname, '../../packages/policy-engine/src/index.ts'),
      '@aip/security': path.resolve(__dirname, '../../packages/security/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
