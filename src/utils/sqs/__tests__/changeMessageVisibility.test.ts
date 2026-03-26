import { changeMessageVisibility } from '../../sqs';
import changeMessageVisibilityService from '../../../services/SQSService/changeMessageVisibility';
import { Queue } from '../../../services/SQSService/getQueueUrl';
import { ClientOptions } from '../../../types/aws';

jest.mock('../../../services/SQSService/changeMessageVisibility');

describe('changeMessageVisibility', () => {
  const queue: Queue = {
    alias: 'testQueue',
    name: 'testQueueName',
    url: 'testQueueUrl',
  };
  const receiptHandle = 'testReceiptHandle';
  const visibilityTimeout = 300;
  const clientOpts: ClientOptions = {
    region: 'us-west-2',
    singletonConn: 'default',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call changeMessageVisibilityService with the correct arguments', async () => {
    const opts = {
      QueueUrl: 'customQueueUrl',
    };

    await changeMessageVisibility(
      queue,
      receiptHandle,
      visibilityTimeout,
      opts,
      clientOpts
    );

    expect(changeMessageVisibilityService).toHaveBeenCalledWith(
      queue,
      receiptHandle,
      visibilityTimeout,
      opts,
      clientOpts
    );
  });

  it('should call changeMessageVisibilityService with queue as string', async () => {
    const queueAlias = 'testQueue';

    await changeMessageVisibility(
      queueAlias,
      receiptHandle,
      visibilityTimeout,
      undefined,
      clientOpts
    );

    expect(changeMessageVisibilityService).toHaveBeenCalledWith(
      queueAlias,
      receiptHandle,
      visibilityTimeout,
      undefined,
      clientOpts
    );
  });

  it('should call changeMessageVisibilityService with default values when opts and clientOpts not provided', async () => {
    await changeMessageVisibility(queue, receiptHandle, visibilityTimeout);

    expect(changeMessageVisibilityService).toHaveBeenCalledWith(
      queue,
      receiptHandle,
      visibilityTimeout,
      undefined,
      undefined
    );
  });

  it('should return the result from changeMessageVisibilityService', async () => {
    (changeMessageVisibilityService as jest.Mock).mockResolvedValueOnce(
      undefined
    );

    const result = await changeMessageVisibility(
      queue,
      receiptHandle,
      visibilityTimeout
    );

    expect(result).toBeUndefined();
    expect(changeMessageVisibilityService).toHaveBeenCalledTimes(1);
  });
});
