const path = require('path');

module.exports = {
  globalSetup: path.resolve('./jest/setup.js'),
  globals: {
    'ts-jest': {
      tsconfig: path.resolve('./tsconfig.json'),
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
