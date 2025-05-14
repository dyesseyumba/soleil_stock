import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8', // instead of 'c8'
      enabled:true,
      reporter: ['text', 'html'],
      exclude: ['src/generated/**'],
    },
    include: ['test/**/*.test.ts'],
  },
});
