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

describe('MiddlewareGroup: test disconnectConnections middleware', () => {
  it('should not call db.end() whenever a db options is not set', async () => {
    const end = jest.fn().mockResolvedValue();
    await disconnectConnections();

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
