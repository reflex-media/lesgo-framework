import {
  normalizeHandler,
  disconnectConnections,
} from '../normalizeSNSMessageMiddleware';

describe('MiddlewareGroup: test normalizeRecords middleware', () => {
  it('test without parameters', () => {
    const data = normalizeHandler(undefined);
    expect(data).toBe(null);
  });

  it('test with valid empty records', () => {
    const data = normalizeHandler({});
    expect(data).toBe(null);
  });

  it('test with valid SQS records', () => {
    const data = normalizeHandler([
      {
        EventSource: 'aws:sns',
        EventVersion: '1.0',
        EventSubscriptionArn:
          'arn:aws:sns:ap-southeast-1:302390420902:vodSnsCallback:2de629ff-eec3-41f5-903d-9c4e3f0e5b23',
        Sns: {
          Type: 'Notification',
          MessageId: '4fddf9ba-3a96-5f76-a3a9-a2989d8176db',
          TopicArn: 'arn:aws:sns:ap-southeast-1:302390420902:vodSnsCallback',
          Subject: null,
          Message: '{"message":"test"}',
          Timestamp: '2022-06-14T15:10:15.421Z',
          SignatureVersion: '1',
          Signature:
            'Dd0osQpOEhnbeszNGEAXNspvNl2zd7VmNdZ/Lzn3EPM0tW4Q/O34/3Wkyu2g9BIDyi3+1dxtdD5xCZf5nqlJpqysijuVQrmojlgCigIgIs03pKguyHhOv3LGFPpCNEemp3Cu07Loul6cxqFWe2q76J1fHqdqCCSv6BsgTCSeXWo7+9mZTmNhIPAq4i5EIN1/TNmX0YHKMFQa+ehI0YwgZnz/IB8BjVJrg+jSoB646AjSwDi8VuxOBHN1MhkldPG4ti3dSQ2p4aI1apYC5zKh2OLritwoi3vyFUsgfJwJKXyfiSeqyV5tov80qWxgqJDgWvVsnxFbJ3TNomts+hzhKg==',
          SigningCertUrl:
            'https://sns.ap-southeast-1.amazonaws.com/SimpleNotificationService-7ff5318490ec183fbaddaa2a969abfda.pem',
          UnsubscribeUrl:
            'https://sns.ap-southeast-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:ap-southeast-1:302390420902:vodSnsCallback:2de629ff-eec3-41f5-903d-9c4e3f0e5b23',
          MessageAttributes: {},
        },
      },
    ]);
    expect(data).toMatchObject([
      {
        messageId: '4fddf9ba-3a96-5f76-a3a9-a2989d8176db',
        message: 'test',
      },
    ]);
  });
});

describe('MiddlewareGroup: test disconnectConnections db middleware', () => {
  it('should not call db.end() whenever a db options is not present', async () => {
    const end = jest.fn().mockResolvedValue();
    await disconnectConnections();

    expect(end).toHaveBeenCalledTimes(0);
  });

  it('should not call anything whenever no options is passed', async () => {
    const end = jest.fn().mockResolvedValue();
    await disconnectConnections();

    expect(end).toHaveBeenCalledTimes(0);
  });

  it('should not call db.end() whenever a db options is not set', async () => {
    const end = jest.fn().mockResolvedValue();
    await disconnectConnections({ db: {} });

    expect(end).toHaveBeenCalledTimes(0);
  });

  it('should call db.end() whenever a db options is set', async () => {
    const end = jest.fn().mockResolvedValue();
    await disconnectConnections({
      db: {
        end,
      },
    });

    expect(end).toHaveBeenCalledTimes(1);
  });
});

describe('MiddlewareGroup: test disconnectConnections dbRead middleware', () => {
  it('should not call dbRead.end() whenever a dbRead options is not set', async () => {
    const end = jest.fn().mockResolvedValue();
    await disconnectConnections({ dbRead: {} });

    expect(end).toHaveBeenCalledTimes(0);
  });

  it('should call dbRead.end() whenever a dbRead options is set', async () => {
    const end = jest.fn().mockResolvedValue();
    await disconnectConnections({
      dbRead: {
        end,
      },
    });

    expect(end).toHaveBeenCalledTimes(1);
  });
});

describe('MiddlewareGroup: test disconnectConnections cache middleware', () => {
  it('should not call cache.end() whenever a cache options is not set', async () => {
    const cache = jest.fn().mockResolvedValue();
    await disconnectConnections({ cache: {} });

    expect(cache).toHaveBeenCalledTimes(0);
  });

  it('should call cache.end() whenever a cache options is set', async () => {
    const end = jest.fn().mockResolvedValue();
    await disconnectConnections({
      cache: {
        end,
      },
    });

    expect(end).toHaveBeenCalledTimes(1);
  });
});
