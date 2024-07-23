import { ReceiveMessageCommandInput } from '@aws-sdk/client-sqs';
import { ClientOptions } from '../../types/aws';
import { Queue } from './getQueueUrl';
export interface ReceiveMessagesOptions extends Partial<Omit<ReceiveMessageCommandInput, 'QueueUrl'>> {
    QueueUrl?: string;
}
declare const receiveMessages: (queue: string | Queue, opts?: ReceiveMessagesOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-sqs").ReceiveMessageCommandOutput>;
export default receiveMessages;
