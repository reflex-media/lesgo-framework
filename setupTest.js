/* eslint no-console: 0 */

// Mock the console logs
console.log = jest.fn();
console.debug = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// Mock Sentry
jest.mock('@sentry/minimal');
