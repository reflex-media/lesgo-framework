module.exports = {
  verbose: true,
  testMatch: ['**/__tests__/*.spec.js'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['html', 'text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  setupFiles: ['./setupTest.js'],
  moduleNameMapper: {
    '^Config(.*)$': '<rootDir>/tests/__mocks__/config$1.js',
  },
};
