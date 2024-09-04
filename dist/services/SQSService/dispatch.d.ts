import { SendMessageCommandInput } from '@aws-sdk/client-sqs';
import { ClientOptions } from '../../types/aws';
import { Queue } from './getQueueUrl';
export interface DispatchOptions extends Partial<Omit<SendMessageCommandInput, 'QueueUrl' | 'MessageBody'>> {
    QueueUrl?: string;
    MessageBody?: string;
}
declare const dispatch: (payload: Record<any, any>, queue: string | Queue, opts?: DispatchOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-sqs").SendMessageCommandOutput>;
export default dispatch;
