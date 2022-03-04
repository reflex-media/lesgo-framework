import {
  normalizeHandler,
  disconnectConnections,
} from '../normalizeSQSMessageMiddleware';

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
        messageId: 'messageId',
        receiptHandle: 'receiptHandle',
        body: '{"data":{"testQueueKey":"testQueueValue"}}',
      },
    ]);
    expect(data).toMatchObject([
      {
        messageId: 'messageId',
        receiptHandle: 'receiptHandle',
        data: {
          testQueueKey: 'testQueueValue',
        },
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
