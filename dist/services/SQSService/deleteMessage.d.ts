import { DeleteMessageCommandInput } from '@aws-sdk/client-sqs';
import { ClientOptions } from '../../types/aws';
import { Queue } from './getQueueUrl';
declare const deleteMessage: (queue: string | Queue, receiptHandle: string, opts?: DeleteMessageCommandInput, clientOpts?: ClientOptions) => Promise<void>;
export default deleteMessage;
