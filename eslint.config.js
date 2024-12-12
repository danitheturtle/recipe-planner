import globals from 'globals';
//language parser
import tsParser from '@typescript-eslint/parser';
//Plugins
import ts from '@typescript-eslint/eslint-plugin';
import imprt from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import jsx from 'eslint-plugin-jsx-a11y';
import hooks from 'eslint-plugin-react-hooks';
//Configs
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  eslintConfigPrettier,
  {
    ignores: ['.yarn/'],
    files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.spec.ts', 'src/**/*.spec.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
        ecmaVersion: 'latest',
        projectService: true,
      },
      globals: {
        ...globals.browser,
        ...globals.builtin,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      import: imprt,
      react: react,
      'jsx-a11y': jsx,
      'react-hooks': hooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      //Custom rules here:
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-debugger': 'warn',
    },
  },
];
