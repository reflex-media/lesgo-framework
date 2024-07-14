import config from '../../config/aws';
import dispatchService, { Queue } from '../../services/SQSService/dispatch';
import isEmpty from '../isEmpty';
import validateFields from '../validateFields';

export const dispatch = (
  payload: Record<any, any>,
  queue: Queue,
  { singletonConn = 'default', region = '' } = {}
) => {
  region = isEmpty(region) ? config.sqs.region : region;

  const input = validateFields({ payload, singletonConn, region }, [
    { key: 'payload', type: 'object', required: true },
    { key: 'singletonConn', type: 'string', required: true },
    { key: 'region', type: 'string', required: true },
  ]);

  return dispatchService(input.payload, queue, {
    region: input.region,
    singletonConn: input.singletonConn,
  });
};

export default dispatch;
