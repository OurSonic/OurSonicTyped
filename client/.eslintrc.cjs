module.exports = {
  root: true,
  env: {browser: true, es2020: true},
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:tailwindcss/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint'],

  settings: {
    tailwindcss: {
      config: 'tailwind.config.cjs',
    },
  },
  rules: {
    'react-refresh/only-export-components': ['warn', {allowConstantExport: true}],
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    'prefer-const': 'off',
    'no-empty-pattern': 'off',
    '@typescript-eslint/ban-types': 'off',
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'tailwindcss/no-custom-classname': 'error',
    'react-hooks/rules-of-hooks': 'off',
    'no-constant-condition': 'off',
  },
};
