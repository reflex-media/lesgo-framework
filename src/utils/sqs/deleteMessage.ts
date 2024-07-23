import deleteMessageService, {
  DeleteMessageOptions,
} from '../../services/SQSService/deleteMessage';
import { Queue } from '../../services/SQSService/getQueueUrl';
import { ClientOptions } from '../../types/aws';

export const deleteMessage = async (
  queue: string | Queue,
  receiptHandle: string,
  opts?: DeleteMessageOptions,
  clientOpts?: ClientOptions
) => {
  return deleteMessageService(queue, receiptHandle, opts, clientOpts);
};

export default deleteMessage;
