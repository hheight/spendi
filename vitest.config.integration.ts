import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  },
  test: {
    include: ['tests/integration/**/*.test.ts'],
    setupFiles: ['tests/helpers/setup-integration.ts'],
    poolOptions: {
      forks: {
        singleFork: true
      }
    }
  }
});
