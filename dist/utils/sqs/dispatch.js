import { LesgoException } from '../../exceptions';
import config from '../../config/aws';
import dispatchService from '../../services/SQSService/dispatch';
import isEmpty from '../isEmpty';
import validateFields from '../validateFields';
import logger from '../logger';
const FILE = 'lesgo.utils.sqs.dispatch';
export const dispatch = (payload, queue, opts = {}) => {
  logger.debug(`${FILE}::DISPATCH`, {
    payload,
    queue,
    opts,
  });
  opts.region = isEmpty(opts.region) ? config.sqs.region : opts.region;
  opts.singletonConn = isEmpty(opts.singletonConn)
    ? 'default'
    : opts.singletonConn;
  const input = validateFields(Object.assign({ payload }, opts), [
    { key: 'payload', type: 'object', required: true },
    { key: 'region', type: 'string', required: true },
    { key: 'singletonConn', type: 'string', required: true },
    { key: 'fifo', type: 'boolean', required: false },
    { key: 'messageGroupId', type: 'string', required: false },
    { key: 'messageDeduplicationId', type: 'string', required: false },
  ]);
  logger.debug(`${FILE}::VALIDATED_INPUT`, {
    input,
  });
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
  if (input.fifo || queue.name.endsWith('.fifo')) {
    if (isEmpty(input.messageGroupId)) {
      throw new LesgoException(
        'messageGroupId is required for FIFO queue',
        `${FILE}::MESSAGE_GROUP_ID_REQUIRED`,
        500
      );
    }
    return dispatchService(input.payload, queue, {
      region: input.region,
      singletonConn: input.singletonConn,
      fifo: true,
      messageGroupId: input.messageGroupId,
      messageDeduplicationId: input.messageDeduplicationId,
    });
  }
  return dispatchService(input.payload, queue, {
    region: input.region,
    singletonConn: input.singletonConn,
  });
};
export default dispatch;
