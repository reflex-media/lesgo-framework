import { LesgoException } from '../../exceptions';
import sqsConfig from '../../config/sqs';
import { convertQueueAliasToObject } from '../../utils/sqs';

const FILE = 'lesgo.services.SQSService.getQueueUrl';

export type Queue = {
  alias: string;
  name: string;
  url: string;
};

export default (queue: string | Queue) => {
  if (
    typeof queue !== 'string' &&
    'alias' in queue &&
    'name' in queue &&
    'url' in queue
  ) {
    return queue.url;
  }

  const queues = <Queue[]>convertQueueAliasToObject(sqsConfig.queueAliases);
  const configQueue = queues.find(q => q.alias === queue);

  if (!configQueue) {
    throw new LesgoException(
      `Queue with alias ${queue} not found in config`,
      `${FILE}::QUEUE_NOT_FOUND`,
      404,
      {
        queue,
      }
    );
  }

  return configQueue.url;
};
