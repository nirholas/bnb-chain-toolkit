const config = require('eslint').eslint;

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'sort-keys-fix/sort-keys-fix': 'off',
  },
};

