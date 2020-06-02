module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  plugins: ['pretty-imports'],
  rules: {
    'no-empty-pattern': 0,
    'no-unused-vars': 0,
    'pretty-imports/sorted': 'error',
  },
};
