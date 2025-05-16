import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,ts,jsx,tsx}'],
      exclude: ['**/*.test.{js,ts,jsx,tsx}', '**/*.spec.{js,ts,jsx,tsx}'],
    },
    exclude: [...configDefaults.exclude],
  },
});
