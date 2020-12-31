const warning = process.env['CI'] ? 2 : 1;

module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: [
    'prettier',
  ],
  plugins: ['prettier'],
  rules: {
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
