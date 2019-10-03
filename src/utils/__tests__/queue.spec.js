import queue, { dispatch } from '../queue';
import { aws } from '../../config';

describe('test queue utils', () => {
  it('test queue.dispatch', () => {
    return expect(
      // eslint-disable-next-line import/no-named-as-default-member
      queue.dispatch({ someData: 'someValue' }, 'pingQueue')
    ).resolves.toMatchObject({
      MessageId: 'MessageId',
      mocked: {
        opts: {},
        params: {
          MessageBody: '{"someData":"someValue"}',
          QueueUrl: `${aws.sqs.queues.pingQueue.url}`,
        },
      },
    });
  });

  it('test queue dispatch', () => {
    return expect(
      dispatch({ someData: 'someValue' }, 'pingQueue')
    ).resolves.toMatchObject({
      MessageId: 'MessageId',
      mocked: {
        opts: {},
        params: {
          MessageBody: '{"someData":"someValue"}',
          QueueUrl: `${aws.sqs.queues.pingQueue.url}`,
        },
      },
    });
  });

  it('test queue dispatch with empty payload', () => {
    return expect(() => dispatch()).toThrow(
      new Error('payload is undefined in dispatch()')
    );
  });

  it('test queue dispatch with empty queueName', () => {
    return expect(() => dispatch({ someData: 'someValue' })).toThrow(
      new Error('queueName is undefined in dispatch()')
    );
  });
});
