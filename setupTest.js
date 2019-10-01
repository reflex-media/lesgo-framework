/* eslint no-console: 0 */

// Add test-specific environment configurations
process.env.APP_ENV = 'test';
process.env.APP_DEBUG = true;
process.env.SENTRY_ENABLED = true;

// Mock the console logs
console.log = jest.fn();
console.debug = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

jest.mock('@sentry/minimal');
