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

export default tseslint.config(
  { ignores: [
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
  ] },
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
      // React Hooks rules — keep core rules, downgrade React Compiler rules to warnings
      ...Object.fromEntries(
        Object.entries(reactHooks.configs.recommended.rules).map(
          ([key, val]) => [key, val === 'error' && key !== 'react-hooks/rules-of-hooks' ? 'warn' : val]
        )
      ),
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
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
      'curly': ['warn', 'multi-line'],
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
  }
);
