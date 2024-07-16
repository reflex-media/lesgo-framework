import { DeleteMessageCommand } from '@aws-sdk/client-sqs';
import LesgoException from '../../../exceptions/LesgoException';
import logger from '../../../utils/logger';
import getClient from '../getClient';
import deleteMessage from '../deleteMessage';

jest.mock('../getClient', () => {
  return jest.fn().mockImplementation(() => ({
    send: jest.fn().mockImplementation(command => {
      if (command instanceof DeleteMessageCommand) {
        return Promise.resolve(command.input);
      }

      return Promise.reject(new Error('Command not mocked'));
    }),
  }));
});
jest.mock('../../../utils/logger');

describe('deleteMessage', () => {
  const queue = {
    alias: 'testQueue',
    name: 'testQueueName',
    url: 'testQueueUrl',
  };
  const receiptHandle = 'testReceiptHandle';
  const singletonConn = 'default';
  const region = 'ap-southeast-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getClient with the correct arguments', async () => {
    await deleteMessage(queue, receiptHandle, { region, singletonConn });

    expect(getClient).toHaveBeenCalledWith({ region, singletonConn });
  });

  it('should call client.send with the correct arguments', async () => {
    await deleteMessage(queue, receiptHandle, {
      region,
      singletonConn,
    });

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.SQSService.deleteMessage::MESSAGE_DELETED_FROM_QUEUE',
      {
        opts: {
          QueueUrl: queue.url,
          ReceiptHandle: receiptHandle,
        },
        queue,
      }
    );
  });

  it('should call logger.debug with the correct arguments', async () => {
    const client = {
      send: jest.fn().mockResolvedValue({}),
    };
    (getClient as jest.Mock).mockReturnValue(client);

    await deleteMessage(queue, receiptHandle, { region, singletonConn });

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.SQSService.deleteMessage::MESSAGE_DELETED_FROM_QUEUE',
      {
        opts: {
          QueueUrl: queue.url,
          ReceiptHandle: receiptHandle,
        },
        queue,
      }
    );
  });

  it('should throw a LesgoException when an error occurs', async () => {
    const error = new Error('Test error');
    const client = {
      send: jest.fn().mockRejectedValue(error),
    };
    (getClient as jest.Mock).mockReturnValue(client);

    await expect(
      deleteMessage(queue, receiptHandle, { region, singletonConn })
    ).rejects.toThrow(
      new LesgoException(
        'Error occurred deleting message from queue',
        'lesgo.services.SQSService.deleteMessage::DELETE_MESSAGE_ERROR',
        500,
        {
          error,
          queue,
          opts: {
            QueueUrl: queue.url,
            ReceiptHandle: receiptHandle,
          },
        }
      )
    );
  });
});
