import { LesgoException } from '../../exceptions';
import config from '../../config/aws';
import dispatchService from '../../services/SQSService/dispatch';
import isEmpty from '../isEmpty';
import validateFields from '../validateFields';
const FILE = 'lesgo.utils.sqs.dispatch';
export const dispatch = (
  payload,
  queue,
  { singletonConn = 'default', region = '' } = {}
) => {
  region = isEmpty(region) ? config.sqs.region : region;
  const input = validateFields({ payload, singletonConn, region }, [
    { key: 'payload', type: 'object', required: true },
    { key: 'singletonConn', type: 'string', required: true },
    { key: 'region', type: 'string', required: true },
  ]);
  if (typeof queue === 'string') {
    const configQueue = config.sqs.queues.find(q => q.alias === queue);
    if (!configQueue) {
      throw new LesgoException(
        `Queue with alias ${queue} not found in config`,
        `${FILE}::QUEUE_NOT_FOUND`,
        500,
        {
          queue,
        }
      );
    }
    queue = configQueue;
  }
  return dispatchService(input.payload, queue, {
    region: input.region,
    singletonConn: input.singletonConn,
  });
};
export default dispatch;
