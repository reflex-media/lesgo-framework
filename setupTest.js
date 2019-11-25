/* eslint no-console: 0 */

// Mock the console logs
console.log = jest.fn();
console.debug = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// Mock Sentry
jest.mock('@sentry/minimal');

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

// Mock Elasticsearch
jest.mock('@elastic/elasticsearch', () => {
  return {
    Client: jest.fn().mockImplementation((opts, conn) => {
      return {
        indices: {
          create: jest.fn().mockImplementation((params, callback) => {
            return callback(null, {
              data: {},
              mocked: {
                params,
              },
            });
          }),
        },
        search: jest.fn().mockImplementation((param, callback) => {
          return callback(null, {
            response: {},
            mocked: {
              param,
            },
          });
        }),
        get: jest.fn().mockImplementation((params, callback) => {
          return callback(null, {
            response: {},
            mocked: {
              params,
            },
          });
        }),
        index: jest.fn().mockImplementation((params, callback) => {
          return callback(null, {
            data: {},
            mocked: {
              params,
            },
          });
        }),
        bulk: jest.fn().mockImplementation((bodies, callback) => {
          return callback(null, {
            data: {},
            mocked: {
              bodies,
            },
          });
        }),
        mocked: {
          opts,
          conn,
        },
      };
    }),
    Connection: jest.fn().mockImplementation(() => {}),
  };
});
