import { SendMessageCommandInput } from '@aws-sdk/client-sqs';
import { ClientOptions } from '../../types/aws';
import { Queue } from './getQueueUrl';
declare const dispatch: (payload: Record<any, any>, queue: string | Queue, opts?: SendMessageCommandInput, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-sqs").SendMessageCommandOutput>;
export default dispatch;
