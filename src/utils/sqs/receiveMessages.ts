import { LesgoException } from '../../exceptions';
import sqsConfig from '../../config/sqs';
import receiveMessagesService, {
  Queue,
} from '../../services/SQSService/receiveMessages';
import isEmpty from '../isEmpty';
import validateFields from '../validateFields';
import logger from '../logger';

const FILE = 'lesgo.utils.sqs.receiveMessages';

export interface ReceiveMessagesOptions {
  region?: string;
  singletonConn?: string;
  maxNumberOfMessages?: number;
  waitTimeSeconds?: number;
}

export const receiveMessages = async (
  queue: string | Queue,
  opts: ReceiveMessagesOptions = {}
) => {
  logger.debug(`${FILE}::RECEIVE_MESSAGES_PARAMETERS`, {
    queue,
    opts,
  });

  opts.region = isEmpty(opts.region) ? sqsConfig.region : opts.region;
  opts.singletonConn = isEmpty(opts.singletonConn)
    ? 'default'
    : opts.singletonConn;

  const input = validateFields(opts, [
    { key: 'region', type: 'string', required: true },
    { key: 'singletonConn', type: 'string', required: true },
    { key: 'maxNumberOfMessages', type: 'number', required: false },
    { key: 'waitTimeSeconds', type: 'number', required: false },
  ]);

  logger.debug(`${FILE}::VALIDATED_INPUT`, {
    input,
  });

  if (typeof queue === 'string') {
    const configQueue = sqsConfig.queues.find(q => q.alias === queue);

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

  return receiveMessagesService(queue, {
    region: input.region,
    singletonConn: input.singletonConn,
    maxNumberOfMessages: input.maxNumberOfMessages,
    waitTimeSeconds: input.waitTimeSeconds,
  });
};

export default receiveMessages;
