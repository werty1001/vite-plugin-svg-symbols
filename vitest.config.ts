import { fileURLToPath } from 'node:url';
import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['./tests/**/*.spec.ts'],
    exclude: [...configDefaults.exclude, './tests/**/_*.spec.ts'],
    root: fileURLToPath(new URL('./', import.meta.url)),
  },
});
