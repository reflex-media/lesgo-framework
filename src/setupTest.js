/* eslint no-console: 0 */

// Mock the console logs
console.log = jest.fn();
console.debug = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// import * as Sentry from '@sentry/minimal';

// Sentry.captureMessage = jest.fn();

// Mock sentry
jest.mock('@sentry/minimal', () => {
  return {
    Sentry: jest.fn().mockImplementation(opts => {
      return {
        withScope: jest.fn(() => false),
        captureMessage: jest.fn().mockImplementation((message, level) => {
          return {
            message,
            level,
            mocked: {
              dsn: opts.dsn,
            },
          };
        }),
      };
    }),
  };
});
