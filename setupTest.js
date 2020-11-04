/* eslint no-console: 0 */

// Mock the console logs
console.log = jest.fn();
console.debug = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// Mock Knex.js library
jest.mock('./src/services/knex', () => {
  return jest.fn().mockImplementation(() => {
    return {
      raw: jest.fn().mockImplementation(query => {
        return new Promise(resolve => {
          const response = {
            data: {},
            mocked: {
              query,
            },
          };
          resolve(response);
        });
      }),
    };
  });
});
