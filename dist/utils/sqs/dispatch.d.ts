import { SendMessageCommandInput } from '@aws-sdk/client-sqs';
import { Queue } from '../../services/SQSService/getQueueUrl';
import { ClientOptions } from '../../types/aws';
export declare const dispatch: (payload: Record<any, any>, queue: string | Queue, opts?: SendMessageCommandInput, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-sqs").SendMessageCommandOutput>;
export default dispatch;
