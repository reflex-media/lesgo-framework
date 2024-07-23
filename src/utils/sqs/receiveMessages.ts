import receiveMessagesService, {
  ReceiveMessagesOptions,
} from '../../services/SQSService/receiveMessages';
import { Queue } from '../../services/SQSService/getQueueUrl';
import { ClientOptions } from '../../types/aws';

export const receiveMessages = async (
  queue: string | Queue,
  opts?: ReceiveMessagesOptions,
  clientOpts?: ClientOptions
) => {
  return receiveMessagesService(queue, opts, clientOpts);
};

export default receiveMessages;
