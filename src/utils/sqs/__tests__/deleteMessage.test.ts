import { LesgoException } from '../../../exceptions';
import deleteMessageService from '../../../services/SQSService/deleteMessage';
import { Queue } from '../../../services/SQSService/getQueueUrl';
import deleteMessage from '../deleteMessage';

jest.mock('../../../services/SQSService/deleteMessage');

describe('deleteMessage', () => {
  const queue: Queue = {
    alias: 'testQueue',
    name: 'testQueueName',
    url: 'testQueueUrl',
  };
  const receiptHandle = 'testReceiptHandle';
  const opts = {
    region: 'testRegion',
    singletonConn: 'default',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call logger.debug with the correct arguments', async () => {
    await deleteMessage(queue, receiptHandle, undefined, opts);

    expect(deleteMessageService).toHaveBeenCalledWith(
      queue,
      receiptHandle,
      undefined,
      opts
    );
  });

  it('should call deleteMessageService with the correct arguments', async () => {
    await deleteMessage(queue, receiptHandle, undefined, opts);

    expect(deleteMessageService).toHaveBeenCalledWith(
      queue,
      receiptHandle,
      undefined,
      opts
    );
  });
});
