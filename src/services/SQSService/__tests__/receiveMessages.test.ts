import { ReceiveMessageCommand } from '@aws-sdk/client-sqs';
import LesgoException from '../../../exceptions/LesgoException';
import { getClient, receiveMessages } from '../../SQSService';
import { Queue } from '../getQueueUrl';

jest.mock('../getClient', () => {
  return jest.fn().mockImplementation(() => ({
    send: jest.fn().mockImplementation(command => {
      if (command instanceof ReceiveMessageCommand) {
        if (command.input.QueueUrl === 'invalidQueueUrl') {
          return Promise.reject(new Error('invalidQueueUrl'));
        }

        return Promise.resolve({ _mocked: command.input });
      }

      return Promise.reject(new Error('Command not mocked'));
    }),
  }));
});

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

  it('should call getClient with the correct arguments', async () => {
    await receiveMessages(queue, undefined, { region, singletonConn });

    expect(getClient).toHaveBeenCalledWith({ region, singletonConn });
  });

  it('should return the data from client.send', async () => {
    const resp = await receiveMessages(queue, undefined, {
      region,
      singletonConn,
    });

    expect(resp).toMatchObject({
      _mocked: {
        QueueUrl: queue.url,
      },
    });
  });

  it('should throw a LesgoException when an error occurs', async () => {
    const queue: Queue = {
      alias: 'invalidQueueAlias',
      name: 'invalidQueueName',
      url: 'invalidQueueUrl',
    };

    await expect(
      receiveMessages(queue, undefined, { region, singletonConn })
    ).rejects.toThrow(
      new LesgoException(
        'Error occurred receiving messages from queue',
        'lesgo.services.SQSService.receiveMessages::RECEIVE_MESSAGES_ERROR',
        500,
        {
          queue,
          opts: {
            QueueUrl: queue.url,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 0,
          },
        }
      )
    );
  });
});
