import { LesgoException } from '../../../exceptions';
import deleteMessageService, {
  Queue,
} from '../../../services/SQSService/deleteMessage';
import logger from '../../logger';
import { deleteMessage, DeleteMessagesOptions } from '../deleteMessage';

jest.mock('../../logger');
jest.mock('../../../services/SQSService/deleteMessage');

describe('deleteMessage', () => {
  const queue: Queue = {
    alias: 'testQueue',
    name: 'testQueueName',
    url: 'testQueueUrl',
  };
  const receiptHandle = 'testReceiptHandle';
  const opts: DeleteMessagesOptions = {
    region: 'testRegion',
    singletonConn: 'default',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call logger.debug with the correct arguments', () => {
    deleteMessage(queue, receiptHandle, opts);

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.utils.sqs.deleteMessage::VALIDATED_INPUT',
      {
        input: {
          region: 'testRegion',
          singletonConn: 'default',
          receiptHandle,
        },
      }
    );
  });

  it('should throw a LesgoException when the queue alias is not found in config', () => {
    expect(
      deleteMessage('nonExistentQueue', receiptHandle, opts)
    ).rejects.toThrow(
      new LesgoException(
        'Queue with alias nonExistentQueue not found in config',
        'lesgo.utils.sqs.deleteMessage::QUEUE_NOT_FOUND',
        500,
        {
          queue: 'nonExistentQueue',
        }
      )
    );
  });

  it('should call deleteMessageService with the correct arguments', () => {
    deleteMessage(queue, receiptHandle, opts);

    expect(deleteMessageService).toHaveBeenCalledWith(queue, receiptHandle, {
      region: 'testRegion',
      singletonConn: 'default',
    });
  });
});
