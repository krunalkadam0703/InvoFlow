import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    ignores: ['eslint.config.js'], // Ignore config file itself
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      prettier,
      import: importPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      // Prettier integration
      'prettier/prettier': 'error',

      // General rules
      'no-console': 'off',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-undef': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],

      // Import rules
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js built-in modules
            'external', // External packages
            'internal', // Internal modules (if configured)
            ['parent', 'sibling'], // Parent and sibling imports
            'index', // Index imports
            'type', // Type imports
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: '~/**',
              group: 'internal',
              position: 'before',
            },
          ],
        },
      ],
      'import/no-unresolved': 'off', // Can cause issues with ES modules
      'import/no-duplicates': 'error',
      'import/no-unused-modules': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'always',
          json: 'always',
        },
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: ['**/*.test.js', '**/*.spec.js', 'eslint.config.js'],
        },
      ],

      // Code quality
      'no-else-return': 'error',
      'no-return-await': 'error',
      'require-await': 'warn', // Changed to warn for flexibility
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',
      'no-useless-catch': 'warn', // Changed to warn
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.json'],
        },
      },
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.min.js',
      '.env*',
      'prisma/migrations/**',
      'public/**',
      '.prisma/**',
    ],
  },
];
