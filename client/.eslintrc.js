module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [ 'plugin:vue/essential', '@vue/airbnb', ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prefer-arrow-callback': 'off',
    'func-names': 'off',
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'arrow-body-style': 'off',
    'no-underscore-dangle': 'off',
    'no-mixed-operators': 'off',
    'comma-dangle': [ 'error', 'always', ],
    'comma-spacing': [ 'error', { before: false, after: true, }, ],
    'array-bracket-spacing': [ 'error', 'always', ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
