import getQueueUrl, { Queue } from '../getQueueUrl';
import { LesgoException } from '../../../exceptions';

describe('getQueueUrl', () => {
  it('should return the URL if queue is an object with alias, name, and url', () => {
    const queue: Queue = {
      alias: 'testQueue',
      name: 'Test Queue',
      url: 'https://sqs.test.queue.url',
    };

    const result = getQueueUrl(queue);
    expect(result).toBe(queue.url);
  });

  it('should return the URL if queue is a string alias', () => {
    const queueAlias = 'testQueue';

    const result = getQueueUrl(queueAlias);
    expect(result).toBe(
      'https://sqs.ap-southeast-1.amazonaws.com/1234567890/lesgo-testing-testQueue'
    );
  });

  it('should throw LesgoException if queue alias is not found', () => {
    expect(() => getQueueUrl('nonExistentQueue')).toThrow(LesgoException);
    expect(() => getQueueUrl('nonExistentQueue')).toThrow(
      'Queue with alias nonExistentQueue not found in config'
    );
  });
});
