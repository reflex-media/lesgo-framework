import { SendMessageCommand } from '@aws-sdk/client-sqs';
import LesgoException from '../../../exceptions/LesgoException';
import getClient from '../getClient';
import dispatch from '../dispatch';

jest.mock('../getClient', () => {
  return jest.fn().mockImplementation(() => ({
    send: jest.fn().mockImplementation(command => {
      if (command instanceof SendMessageCommand) {
        if (command.input.QueueUrl === 'invalidQueueUrl') {
          return Promise.reject(new Error('invalidQueueUrl'));
        }

        return Promise.resolve({ _mocked: command.input });
      }

      return Promise.reject(new Error('Command not mocked'));
    }),
  }));
});

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
    await dispatch(payload, queue, undefined, { region, singletonConn });

    expect(getClient).toHaveBeenCalledWith({ region, singletonConn });
  });

  it('should call getClient with the correct arguments for queue string', async () => {
    await dispatch(payload, 'testQueue', undefined, { region, singletonConn });

    expect(getClient).toHaveBeenCalledWith({ region, singletonConn });
  });

  it('should return the data from client.send', async () => {
    const result = await dispatch(payload, queue, undefined, {
      region,
      singletonConn,
    });

    expect(result).toMatchObject({
      _mocked: {
        MessageBody: JSON.stringify(payload),
        QueueUrl: queue.url,
      },
    });
  });

  it('should throw a LesgoException when an error occurs', async () => {
    const queue = {
      alias: 'invalidQueueAlias',
      name: 'invalidQueueName',
      url: 'invalidQueueUrl',
    };

    await expect(
      dispatch(payload, queue, undefined, { region, singletonConn })
    ).rejects.toThrow(
      new LesgoException(
        'Error occurred sending message to queue',
        'lesgo.services.SQSService.dispatch::SEND_MESSAGE_ERROR',
        500,
        {
          error: new Error('invalidQueueUrl'),
          payload,
          queue,
        }
      )
    );
  });

  it('should throw a LesgoException queue does not exist on config', async () => {
    const queue = 'invalidQueueAlias';

    await expect(
      dispatch(payload, queue, undefined, { region, singletonConn })
    ).rejects.toThrow(
      new LesgoException(
        `Queue with alias ${queue} not found in config`,
        'lesgo.services.SQSService.getQueueUrl::QUEUE_NOT_FOUND'
      )
    );
  });
});
