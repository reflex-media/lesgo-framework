import { SendMessageCommandInput } from '@aws-sdk/client-sqs';
import dispatchService from '../../services/SQSService/dispatch';
import { Queue } from '../../services/SQSService/getQueueUrl';
import { ClientOptions } from '../../types/aws';

export const dispatch = async (
  payload: Record<any, any>,
  queue: string | Queue,
  opts?: SendMessageCommandInput,
  clientOpts?: ClientOptions
) => {
  return dispatchService(payload, queue, opts, clientOpts);
};

export default dispatch;
