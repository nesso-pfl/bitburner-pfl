import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    files: ['src/**/*'],
  },
  {
    ignores: ['global.d.ts', 'dist', 'NetscriptDefinitions.d.ts']
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
);