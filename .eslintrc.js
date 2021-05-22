const isProd = process.env.NODE_ENV === 'production';
const defaultRules = {
  'no-bitwise': ['error', { allow: ['&', '|', '^'] }],
  'arrow-body-style': [2, 'as-needed'],
  'arrow-parens': ['error', 'as-needed'],
  'class-methods-use-this': 0,
  'comma-dangle': [2, 'always-multiline'],
  'no-underscore-dangle': 0,
  'max-len': 0,
  'newline-per-chained-call': 0,
  'no-confusing-arrow': 0,
  'no-console': [isProd ? 'error' : 'warn', { allow: ['warn', 'error'] }],
  'no-debugger': isProd ? 'error' : 'warn',
  'no-plusplus': 0,
  'no-use-before-define': 0,
  'prefer-template': 2,
  'prettier/prettier': 'error',
  'react/destructuring-assignment': 0,
  'require-yield': 0,
  'no-await-in-loop': 0,
};

module.exports = {
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['prettier', '@typescript-eslint'],
      extends: [
        'airbnb-base',
        'prettier',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        ...defaultRules,
        'no-shadow': 0,
        'no-unused-vars': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/member-delimiter-style': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-unused-vars': [
          isProd ? 2 : 1,
          { ignoreRestSiblings: true },
        ],
        '@typescript-eslint/ban-types': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        '@typescript-eslint/no-use-before-define': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
      },
      // parserOptions: {
      //   ecmaVersion: 2018,
      //   sourceType: 'module',
      // },
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.js', '.ts'],
          },
        },
      },
    },
    {
      files: ['**/*.js'],
      extends: ['airbnb-base', 'prettier'],
      env: {
        node: true,
        jest: true,
        es6: true,
      },
      plugins: ['prettier'],
      rules: {
        ...defaultRules,
        'no-unused-vars': isProd ? 'error' : 'warn',
      },
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.js', '.ts'],
          },
        },
      },
    },
  ],
};
