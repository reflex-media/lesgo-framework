import { GetQueueAttributesCommand } from '@aws-sdk/client-sqs';
import getQueueCount from '../getQueueCount';
import getClient from '../getClient';
import LesgoException from '../../../exceptions/LesgoException';
import { Queue } from '../getQueueUrl';

jest.mock('../getClient', () => {
  return jest.fn().mockImplementation(() => ({
    send: jest.fn().mockImplementation(command => {
      if (command instanceof GetQueueAttributesCommand) {
        if (command.input.QueueUrl === 'invalidQueueUrl') {
          return Promise.reject(new Error('invalidQueueUrl'));
        }

        return Promise.resolve({ _mocked: command.input });
      }

      return Promise.reject(new Error('Command not mocked'));
    }),
  }));
});

describe('getQueueCount', () => {
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

  it('should return queue attributes data', async () => {
    await getQueueCount(queue, undefined, { region, singletonConn });

    expect(getClient).toHaveBeenCalledWith({ region, singletonConn });
  });

  it('should pass options to the command input', async () => {
    const resp = await getQueueCount(queue, undefined, {
      region,
      singletonConn,
    });

    expect(resp).toMatchObject({
      _mocked: {
        QueueUrl: queue.url,
      },
    });
  });

  it('should throw LesgoException on error', async () => {
    const queue: Queue = {
      alias: 'invalidQueueAlias',
      name: 'invalidQueueName',
      url: 'invalidQueueUrl',
    };

    await expect(
      getQueueCount(queue, undefined, { region, singletonConn })
    ).rejects.toThrow(
      new LesgoException(
        'Error occurred getting count from queue',
        `lesgo.services.SQSService.getQueueCount::QUEUE_COUNT_ERROR`,
        500,
        {
          queue,
        }
      )
    );
  });
});
