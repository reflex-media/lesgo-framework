module.exports = {
  verbose: true,
  testMatch: ['**/__tests__/*.spec.js'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['html', 'text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 99,
      functions: 99,
      lines: 99,
      statements: 99,
    },
  },
  setupFiles: ['./setupTest.js'],
  moduleNameMapper: {
    '^config(.*)$': '<rootDir>/tests/__mocks__/config$1.js',
  },
};
