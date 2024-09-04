import { dispatch } from '../../sqs';
import dispatchService from '../../../services/SQSService/dispatch';

jest.mock('../../../services/SQSService/dispatch');

describe('dispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call dispatchService with the default values', async () => {
    const payload = { foo: 'bar' };
    const queue = {
      alias: 'testQueue',
      name: 'testQueueName',
      url: 'testQueueUrl',
    };

    await dispatch(payload, queue);

    expect(dispatchService).toHaveBeenCalledWith(
      payload,
      queue,
      undefined,
      undefined
    );
  });

  it('should call dispatchService with the correct arguments', async () => {
    const payload = { foo: 'bar' };
    const queue = {
      alias: 'testQueue',
      name: 'testQueueName',
      url: 'testQueueUrl',
    };
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';

    await dispatch(payload, queue, undefined, { singletonConn, region });

    expect(dispatchService).toHaveBeenCalledWith(payload, queue, undefined, {
      region,
      singletonConn,
    });
  });

  it('should call dispatchService with queue as string', async () => {
    const payload = { foo: 'bar' };
    const queue = 'testQueue';
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';

    await dispatch(payload, queue, undefined, { singletonConn, region });

    expect(dispatchService).toHaveBeenCalledWith(payload, queue, undefined, {
      region,
      singletonConn,
    });
  });
});
