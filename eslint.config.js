/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Clean code is happy code ✨
 *
 * ESLint Flat Config for Lyra Web3 Playground
 */

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

// Global ignores — must be a standalone top-level config object
// (outside tseslint.config wrapper to guarantee they act as global ignores)
const globalIgnores = {
  ignores: [
    'dist',
    'node_modules',
    'coverage',
    'server/dist',
    '*.config.js',
    // Sub-packages have their own lint configs
    'mcp-servers/**',
    'market-data/**',
    'defi-tools/**',
    'wallets/**',
    'standards/**',
    'agent-runtime/**',
    'agents/**',
    'erc8004-agents/**',
    'packages/**',
    'scripts/**',
    'locales/**',
  ],
};

export default [
  globalIgnores,
  ...tseslint.config(
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // React Hooks — spread recommended then downgrade all non-core rules to warn.
      // Covers set-state-in-effect, immutability, and any future Compiler-oriented rules.
      ...Object.fromEntries(
        Object.entries(reactHooks.configs.recommended.rules).map(
          ([key, val]) => {
            if (key === 'react-hooks/rules-of-hooks') return [key, 'error'];
            // val may be a number (2), string ('error'), or array — normalise
            const severity = Array.isArray(val) ? val[0] : val;
            if (severity === 'error' || severity === 2) return [key, 'warn'];
            return [key, val];
          }
        )
      ),
      // Explicit overrides in case recommended doesn't list them
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-empty': 'warn',
      'no-case-declarations': 'warn',
      'no-useless-escape': 'warn',
      'curly': ['error', 'multi-line'],
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'no-throw-literal': 'error',

      // Accessibility
      'jsx-a11y/alt-text': 'off', // Using plugin separately if needed
    },
  },
  // Server-specific configuration
  {
    files: ['server/**/*.{ts,js}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off', // Allow console in server
    },
  },
  // Test files configuration
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/test/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  }),
];
