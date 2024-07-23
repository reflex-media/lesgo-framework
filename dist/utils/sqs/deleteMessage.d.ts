import { DeleteMessageOptions } from '../../services/SQSService/deleteMessage';
import { Queue } from '../../services/SQSService/getQueueUrl';
import { ClientOptions } from '../../types/aws';
export declare const deleteMessage: (queue: string | Queue, receiptHandle: string, opts?: DeleteMessageOptions, clientOpts?: ClientOptions) => Promise<void>;
export default deleteMessage;
