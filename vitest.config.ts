import path from 'path';
import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  },
  test: {
    exclude: [...configDefaults.exclude, '**/e2e/**']
  }
});
