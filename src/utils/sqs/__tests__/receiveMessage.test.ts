import { LesgoException } from '../../../exceptions';
import config from '../../../config/aws';
import receiveMessagesService, {
  Queue,
} from '../../../services/SQSService/receiveMessages';
import receiveMessages, { ReceiveMessagesOptions } from '../receiveMessages';

jest.mock('../../../services/SQSService/receiveMessages');

describe('receiveMessages', () => {
  const queue: Queue = {
    alias: 'testQueue',
    name: 'testQueueName',
    url: 'testQueueUrl',
  };
  const region = 'ap-southeast-1';
  const singletonConn = 'default';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call receiveMessagesService with the correct arguments', async () => {
    const options: ReceiveMessagesOptions = {
      region,
      singletonConn,
      maxNumberOfMessages: 10,
      waitTimeSeconds: 5,
    };

    await receiveMessages(queue, options);

    expect(receiveMessagesService).toHaveBeenCalledWith(queue, options);
  });

  it('should call receiveMessagesService with default options if not provided', async () => {
    await receiveMessages(queue);

    expect(receiveMessagesService).toHaveBeenCalledWith(queue, {
      region: config.sqs.region,
      singletonConn: 'default',
    });
  });

  it('should throw a LesgoException when the queue alias is not found in config', async () => {
    const invalidQueueAlias = 'invalidQueueAlias';

    await expect(receiveMessages(invalidQueueAlias)).rejects.toThrow(
      new LesgoException(
        `Queue with alias ${invalidQueueAlias} not found in config`,
        'lesgo.utils.sqs.receiveMessages::QUEUE_NOT_FOUND',
        500,
        {
          queue: invalidQueueAlias,
        }
      )
    );
  });
});
