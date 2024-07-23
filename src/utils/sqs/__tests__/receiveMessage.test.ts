import receiveMessagesService from '../../../services/SQSService/receiveMessages';
import { Queue } from '../../../services/SQSService/getQueueUrl';
import receiveMessages from '../receiveMessages';

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
    const options = {
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 5,
    };
    const clientOptions = {
      region,
      singletonConn,
    };

    await receiveMessages(queue, options, clientOptions);

    expect(receiveMessagesService).toHaveBeenCalledWith(
      queue,
      options,
      clientOptions
    );
  });

  it('should call receiveMessagesService with default options if not provided', async () => {
    await receiveMessages(queue);

    expect(receiveMessagesService).toHaveBeenCalledWith(
      queue,
      undefined,
      undefined
    );
  });
});
