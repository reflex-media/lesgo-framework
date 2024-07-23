import { DeleteMessageCommandInput } from '@aws-sdk/client-sqs';
import { Queue } from '../../services/SQSService/getQueueUrl';
import { ClientOptions } from '../../types/aws';
export declare const deleteMessage: (queue: string | Queue, receiptHandle: string, opts?: DeleteMessageCommandInput, clientOpts?: ClientOptions) => Promise<void>;
export default deleteMessage;
