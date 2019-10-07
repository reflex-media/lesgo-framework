import { normalizeHandler } from '../normalizeSQSMessage';

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
