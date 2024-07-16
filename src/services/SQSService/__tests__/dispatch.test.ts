import { SendMessageCommand } from '@aws-sdk/client-sqs';
import LesgoException from '../../../exceptions/LesgoException';
import logger from '../../../utils/logger';
import getClient from '../getClient';
import dispatch from '../dispatch';
import SQSService from '../../SQSService';

jest.mock('../getClient', () => {
  return jest.fn().mockImplementation(() => ({
    send: jest.fn().mockImplementation(command => {
      if (command instanceof SendMessageCommand) {
        return Promise.resolve({});
      }

      return Promise.reject(new Error('Command not mocked'));
    }),
  }));
});
jest.mock('../../../utils/logger');

describe('dispatch', () => {
  const payload = { foo: 'bar' };
  const queue = {
    alias: 'testQueue',
    name: 'testQueueName',
    url: 'testQueueUrl',
  };
  const singletonConn = 'default';
  const region = 'ap-southeast-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getClient with the correct arguments', async () => {
    await dispatch(payload, queue, { region, singletonConn });

    expect(getClient).toHaveBeenCalledWith({ region, singletonConn });
  });

  it('should call logger.debug with the correct arguments', async () => {
    const client = {
      send: jest.fn().mockResolvedValue({}),
    };
    (getClient as jest.Mock).mockReturnValue(client);

    await SQSService.dispatch(payload, queue, { region, singletonConn });

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.SQSService.dispatch::MESSAGE_SENT_TO_QUEUE',
      {
        data: {},
        opts: {
          MessageBody: JSON.stringify(payload),
          QueueUrl: queue.url,
        },
        payload,
        queue,
      }
    );
  });

  it('should return the data from client.send', async () => {
    const data = { foo: 'bar' };
    const client = {
      send: jest.fn().mockResolvedValue(data),
    };
    (getClient as jest.Mock).mockReturnValue(client);

    const result = await dispatch(payload, queue, { region, singletonConn });

    expect(result).toBe(data);
  });

  it('should throw a LesgoException when an error occurs', async () => {
    const error = new Error('Test error');
    const client = {
      send: jest.fn().mockRejectedValue(error),
    };
    (getClient as jest.Mock).mockReturnValue(client);

    await expect(
      dispatch(payload, queue, { region, singletonConn })
    ).rejects.toThrow(
      new LesgoException(
        'Error occurred sending message to queue',
        'lesgo.services.SQSService.dispatch::SEND_MESSAGE_ERROR',
        500,
        {
          error,
          payload,
          queue,
        }
      )
    );
  });
});
