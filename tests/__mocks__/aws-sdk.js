const SQS = jest.fn().mockImplementation(opts => {
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
});

const S3 = jest.fn().mockImplementation(opts => {
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
});

const config = {
  credentials: jest.fn(),
  getCredentials: jest.fn().mockImplementation(callback => {
    return callback(null, {
      mocked: {
        credentials: 'mockedCredentials',
      },
    });
  }),
};

const Endpoint = jest.fn().mockImplementation(opts => {
  return opts;
});

const HttpRequest = jest.fn().mockImplementation(opts => {
  return opts;
});

const Signers = {
  V4: jest.fn().mockImplementation((req, service) => {
    return {
      mocked: {
        req,
        service,
      },
      addAuthorization: jest
        .fn()
        .mockImplementation((awsCreds, dateInstance) => {
          return {
            mocked: {
              awsCreds,
              dateInstance,
            },
          };
        }),
    };
  }),
};

const NodeHttpClient = jest.fn().mockImplementation(() => {
  return {
    handleRequest: jest.fn().mockImplementation(
      // eslint-disable-next-line no-unused-vars
      (httpRequest, httpOptions, successCallback, errCallback) => {
        return true;
      }
    ),
  };
});

const DynamoDB = jest.fn().mockImplementation(() => {
  return {
    describeTable: jest.fn().mockImplementation(() => {
      return true;
    }),
  };
});

class EnvironmentCredentials {
  constructor(opts) {
    this.opts = opts;
  }
}

export {
  SQS,
  S3,
  config,
  Endpoint,
  HttpRequest,
  Signers,
  NodeHttpClient,
  EnvironmentCredentials,
  DynamoDB,
};

export default {
  SQS,
  S3,
  config,
  Endpoint,
  HttpRequest,
  Signers,
  NodeHttpClient,
  EnvironmentCredentials,
  DynamoDB,
};
