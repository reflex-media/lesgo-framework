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

const SNS = jest.fn().mockImplementation(opts => {
  return {
    publish: jest.fn().mockImplementation(params => {
      return {
        promise: jest.fn().mockImplementation(() => {
          return new Promise((resolve, reject) => {
            if (params.Message === 'throw') {
              return reject(new Error('test error'));
            }

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
    getSMSAttributes: jest.fn().mockImplementation(() => {
      return {
        promise: jest.fn().mockImplementation(() => {
          return new Promise(resolve => {
            const response = {
              attributes: {
                key: 'value',
              },
            };
            resolve(response);
          });
        }),
      };
    }),
    checkIfPhoneNumberIsOptedOut: jest.fn().mockImplementation(() => {
      return {
        promise: jest.fn().mockImplementation(() => {
          return new Promise(resolve => {
            resolve({
              isOptedOut: true,
            });
          });
        }),
      };
    }),
    setSMSAttributes: jest.fn().mockImplementation(params => {
      return {
        promise: jest.fn().mockImplementation(() => {
          return new Promise(resolve => {
            const response = {
              mocked: params,
            };
            resolve(response);
          });
        }),
      };
    }),
    createTopic: jest.fn().mockImplementation(params => {
      return {
        promise: jest.fn().mockImplementation(() => {
          return new Promise(resolve => {
            const response = {
              TopicArn: `arn:121212/${params.Name}`,
              mocked: params,
            };
            resolve(response);
          });
        }),
      };
    }),
    listTopics: jest.fn().mockImplementation(params => {
      return {
        promise: jest.fn().mockImplementation(() => {
          return new Promise(resolve => {
            const response = {
              Topics:
                params.NextToken === 'next-token'
                  ? [{ TopicArn: 'arn:343434/my-topic2' }]
                  : [
                      { TopicArn: 'arn:121212/my-topic' },
                      { TopicArn: 'arn:232323/my-topic1' },
                    ],
            };

            if (params.NextToken !== 'next-token') {
              response.NextToken = 'next-token';
            }
            resolve(response);
          });
        }),
      };
    }),
    deleteTopic: jest.fn().mockImplementation(params => {
      return {
        promise: jest.fn().mockImplementation(() => {
          return new Promise(resolve => {
            resolve({ mocked: params });
          });
        }),
      };
    }),
    getTopicAttributes: jest.fn().mockImplementation(params => {
      return {
        promise: jest.fn().mockImplementation(() => {
          return new Promise(resolve => {
            resolve({
              Attributes: {
                DisplayName: `Test Topic: ${params.TopicArn}`,
              },
              mocked: params,
            });
          });
        }),
      };
    }),
    setTopicAttributes: jest.fn().mockImplementation(params => {
      return {
        promise: jest.fn().mockImplementation(() => {
          return new Promise(resolve => {
            resolve({
              mocked: params,
            });
          });
        }),
      };
    }),
    subscribe: jest.fn().mockImplementation(() => {
      return {
        promise: jest.fn(),
      };
    }),
    unsubscribe: jest.fn().mockImplementation(() => {
      return {
        promise: jest.fn(),
      };
    }),
    listSubscriptionsByTopic: jest.fn().mockImplementation(params => {
      return {
        promise: jest.fn().mockImplementation(() => {
          return new Promise(resolve => {
            const response = {
              Subscriptions:
                params.NextToken === 'next-token'
                  ? [{ SubscriptionArn: 'arn:343434/my-sub2' }]
                  : [
                      { SubscriptionArn: 'arn:121212/my-sub' },
                      { SubscriptionArn: 'arn:232323/my-sub1' },
                    ],
            };

            if (params.NextToken !== 'next-token') {
              response.NextToken = 'next-token';
            }
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

class EnvironmentCredentials {
  constructor(opts) {
    this.opts = opts;
  }
}

export {
  SQS,
  S3,
  SNS,
  config,
  Endpoint,
  HttpRequest,
  Signers,
  NodeHttpClient,
  EnvironmentCredentials,
};

export default {
  SQS,
  S3,
  SNS,
  config,
  Endpoint,
  HttpRequest,
  Signers,
  NodeHttpClient,
  EnvironmentCredentials,
};
