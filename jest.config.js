module.exports = {
  verbose: true,
  testMatch: ['**/__tests__/*.spec.js'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['html', 'text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFiles: ['./setupTest.js'],
  moduleNameMapper: {
    '^Config(.*)$': '<rootDir>/tests/__mocks__/config$1.js',
  },
};
