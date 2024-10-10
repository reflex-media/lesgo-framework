import { Queue } from '../../services/SQSService/getQueueUrl';
import { ClientOptions } from '../../types/aws';
import changeMessageVisibilityService, {
  changeMessageVisibilityOptions,
} from '../../services/SQSService/changeMessageVisibility';

export const changeMessageVisibility = async (
  queue: string | Queue,
  receiptHandle: string,
  visibilityTimeout: number,
  opts?: changeMessageVisibilityOptions,
  clientOpts?: ClientOptions
) => {
  return changeMessageVisibilityService(
    queue,
    receiptHandle,
    visibilityTimeout,
    opts,
    clientOpts
  );
};

export default changeMessageVisibility;
