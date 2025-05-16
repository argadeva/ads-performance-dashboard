import eslint from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import react from 'eslint-plugin-react';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

let autoImportConfig = require('./.eslintrc-auto-import.json');

// Best practice: set root true and ignores at the top level
export default [
  {
    ignores: ['**', '!src', '!src/**/*'],
  },
  eslint.configs.recommended,
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:react/recommended'),
  {
    files: ['src/**/*.{js,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        ...(autoImportConfig.globals || {}),
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react: react,
      'simple-import-sort': simpleImportSort,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^react'],
            ['^type:'],
            ['^@?\\w'],
            ['^@/'],
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      ...reactHooks.configs.recommended.rules,
    },
  },
];
