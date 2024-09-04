import dispatchService, {
  DispatchOptions,
} from '../../services/SQSService/dispatch';
import { Queue } from '../../services/SQSService/getQueueUrl';
import { ClientOptions } from '../../types/aws';

export const dispatch = async (
  payload: Record<any, any>,
  queue: string | Queue,
  opts?: DispatchOptions,
  clientOpts?: ClientOptions
) => {
  return dispatchService(payload, queue, opts, clientOpts);
};

export default dispatch;
