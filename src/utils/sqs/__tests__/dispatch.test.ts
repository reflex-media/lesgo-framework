import { dispatch } from '../../../utils/sqs/dispatch';
import sqs from '../../../utils/sqs';
import dispatchService from '../../../services/SQSService/dispatch';
import config from '../../../config/aws';
import { LesgoException } from '../../../exceptions';

jest.mock('../../../services/SQSService/dispatch');

describe('dispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call dispatchService with the default values', () => {
    const payload = { foo: 'bar' };
    const queue = {
      alias: 'testQueue',
      name: 'testQueueName',
      url: 'testQueueUrl',
    };
    const singletonConn = 'default';
    const region = 'ap-southeast-1';

    dispatch(payload, queue);

    expect(dispatchService).toHaveBeenCalledWith(payload, queue, {
      region,
      singletonConn,
    });
  });

  it('should call dispatchService with the correct arguments', () => {
    const payload = { foo: 'bar' };
    const queue = {
      alias: 'testQueue',
      name: 'testQueueName',
      url: 'testQueueUrl',
    };
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';

    sqs.dispatch(payload, queue, { singletonConn, region });

    expect(dispatchService).toHaveBeenCalledWith(payload, queue, {
      region,
      singletonConn,
    });
  });

  it('should call dispatchService with queue as string', () => {
    const payload = { foo: 'bar' };
    const queue = 'testQueue';
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';
    const queueObject = config.sqs.queues.find(q => q.alias === queue);

    sqs.dispatch(payload, queue, { singletonConn, region });

    expect(dispatchService).toHaveBeenCalledWith(
      payload,
      {
        alias: queue,
        name: queueObject?.name,
        url: queueObject?.url,
      },
      {
        region,
        singletonConn,
      }
    );
  });

  it('should throw error if queue not found', async () => {
    const payload = { foo: 'bar' };
    const queue = 'invalidQueue';
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';

    expect(
      sqs.dispatch(payload, queue, { singletonConn, region })
    ).rejects.toThrow(
      new LesgoException(
        `Queue with alias ${queue} not found in config`,
        '::QUEUE_NOT_FOUND',
        500,
        {
          queue,
        }
      )
    );
  });
});
