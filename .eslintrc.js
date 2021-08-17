const warning = process.env['CI'] ? 2 : 1;

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-unused-vars': [warning, { vars: 'all', args: 'none' }],
    'no-console': 'off',
    'no-var': 2,
    'no-debugger': warning,
    'prefer-const': warning,
    'no-fallthrough': warning
  },
  env: {
    node: true,
    mocha: true,
    es6: true,
  },
};
