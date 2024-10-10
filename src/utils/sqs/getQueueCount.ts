import getQueueCountService, {
  GetQueueCountOptions,
} from '../../services/SQSService/getQueueCount';
import { Queue } from '../../services/SQSService/getQueueUrl';
import { ClientOptions } from '../../types/aws';

export const getQueueCount = async (
  queue: string | Queue,
  opts?: GetQueueCountOptions,
  clientOpts?: ClientOptions
) => {
  return getQueueCountService(queue, opts, clientOpts);
};

export default getQueueCount;
