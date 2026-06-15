/**
 * @package fabiocherici.com — Vitest config
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Config test unitari (Vitest + Testing Library). Isolata dal build
 *          Next.js (output:export non ne è toccato). Ambiente jsdom per i test
 *          di componenti; alias @/ allineato a tsconfig. M-017.
 * @mission M-017
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules', '.next', 'out'],
  },
});
