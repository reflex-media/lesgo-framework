import { DeleteMessageCommandInput } from '@aws-sdk/client-sqs';
import { ClientOptions } from '../../types/aws';
import { Queue } from './getQueueUrl';
export interface DeleteMessageOptions extends Partial<Omit<DeleteMessageCommandInput, 'QueueUrl' | 'ReceiptHandle'>> {
    QueueUrl?: string;
    ReceiptHandle?: string;
}
declare const deleteMessage: (queue: string | Queue, receiptHandle: string, opts?: DeleteMessageOptions, clientOpts?: ClientOptions) => Promise<void>;
export default deleteMessage;
