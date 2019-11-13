/* eslint no-console: 0 */

// Mock the console logs
console.log = jest.fn();
console.debug = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// Mock Sentry
jest.mock('@sentry/minimal');

// Mock config.js as this comes from client application
jest.mock('./src/config', () => {
  return {
    app: jest.fn(),
    aws: {
      sqs: {
        queues: {
          pingQueue: {
            url: jest.fn(),
          },
        },
      },
      s3: jest.fn(),
    },
    sentry: {
      enabled: true,
    },
  };
});

// Mock AWS SDK
jest.mock('aws-sdk', () => {
  return {
    SQS: jest.fn().mockImplementation(opts => {
      return {
        sendMessage: jest.fn().mockImplementation(params => {
          return {
            promise: jest.fn().mockImplementation(() => {
              return new Promise(resolve => {
                const response = {
                  ResponseMetadata: {
                    RequestId: 'RequestId',
                  },
                  MD5OfMessageBody: 'MD5OfMessageBody',
                  MessageId: 'MessageId',
                  mocked: {
                    opts,
                    params,
                  },
                };
                resolve(response);
              });
            }),
          };
        }),
        mocked: {
          ...opts,
        },
      };
    }),
    S3: jest.fn().mockImplementation(opts => {
      return {
        getObject: jest.fn().mockImplementation(params => {
          return {
            promise: jest.fn().mockImplementation(() => {
              return new Promise(resolve => {
                const response = {
                  LastModified: '2019-09-04T05:00:57.000Z',
                  ContentLength: 27892,
                  ETag: '38e6c8a510f49edec0ad4244a7665312',
                  ContentType: '.jpg',
                  Metadata: {},
                  Body: {
                    type: 'Buffer',
                    data: [],
                  },
                  mocked: {
                    opts,
                    params,
                  },
                };
                resolve(response);
              });
            }),
          };
        }),
        mocked: {
          ...opts,
        },
      };
    }),
  };
});
