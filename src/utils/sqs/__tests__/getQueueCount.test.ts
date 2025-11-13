import { getQueueCount } from '../../sqs';
import getQueueCountService from '../../../services/SQSService/getQueueCount';
import { Queue } from '../../../services/SQSService/getQueueUrl';
import { ClientOptions } from '../../../types/aws';

jest.mock('../../../services/SQSService/getQueueCount');

describe('getQueueCount', () => {
  const queue: Queue = {
    alias: 'testQueue',
    name: 'testQueueName',
    url: 'testQueueUrl',
  };
  const clientOpts: ClientOptions = {
    region: 'us-west-2',
    singletonConn: 'default',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getQueueCountService with the correct arguments', async () => {
    const opts = {
      QueueUrl: 'customQueueUrl',
    };

    await getQueueCount(queue, opts, clientOpts);

    expect(getQueueCountService).toHaveBeenCalledWith(queue, opts, clientOpts);
  });

  it('should call getQueueCountService with queue as string', async () => {
    const queueAlias = 'testQueue';

    await getQueueCount(queueAlias, undefined, clientOpts);

    expect(getQueueCountService).toHaveBeenCalledWith(
      queueAlias,
      undefined,
      clientOpts
    );
  });

  it('should call getQueueCountService with default values when opts and clientOpts not provided', async () => {
    await getQueueCount(queue);

    expect(getQueueCountService).toHaveBeenCalledWith(
      queue,
      undefined,
      undefined
    );
  });

  it('should return the result from getQueueCountService', async () => {
    const mockResult = {
      Attributes: {
        ApproximateNumberOfMessages: '10',
        ApproximateNumberOfMessagesNotVisible: '5',
      },
    };
    (getQueueCountService as jest.Mock).mockResolvedValueOnce(mockResult);

    const result = await getQueueCount(queue);

    expect(result).toEqual(mockResult);
  });
});
