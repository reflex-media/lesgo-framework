import { dispatch } from '../../../utils/sqs/dispatch';
import sqs from '../../../utils/sqs';
import dispatchService from '../../../services/SQSService/dispatch';

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
});
