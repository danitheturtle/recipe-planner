import eslintConfig from '@eslint/js';
import tslint from 'typescript-eslint';
import globals from 'globals';
//Plugins
import importPlugin from 'eslint-plugin-import';
import nodePlugin from 'eslint-plugin-n';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

export default [
  eslintConfig.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  hooksPlugin.configs['recommended-latest'],
  nodePlugin.configs['flat/recommended-script'],
  importPlugin.flatConfigs.errors,
  prettierPlugin,
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
    files: ['**/*.ts', '**/*.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    plugins: {
      '@typescript-eslint': tslint.plugin,
    },
    languageOptions: {
      parser: tslint.parser,
      parserOptions: {
        projectService: true,
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      //Custom rules here:
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-debugger': 'warn',
    },
  },
];
