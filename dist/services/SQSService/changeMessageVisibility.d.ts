import { ChangeMessageVisibilityCommandInput } from '@aws-sdk/client-sqs';
import { ClientOptions } from '../../types/aws';
import { Queue } from './getQueueUrl';
export interface changeMessageVisibilityOptions extends Partial<Omit<ChangeMessageVisibilityCommandInput, 'QueueUrl' | 'ReceiptHandle' | 'VisibilityTimeout'>> {
    QueueUrl?: string;
    ReceiptHandle?: string;
    VisibilityTimeout?: number;
}
declare const changeMessageVisibility: (queue: string | Queue, receiptHandle: string, visibilityTimeout: number, opts?: changeMessageVisibilityOptions, clientOpts?: ClientOptions) => Promise<void>;
export default changeMessageVisibility;
