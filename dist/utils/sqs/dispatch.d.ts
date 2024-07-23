import { DispatchOptions } from '../../services/SQSService/dispatch';
import { Queue } from '../../services/SQSService/getQueueUrl';
import { ClientOptions } from '../../types/aws';
export declare const dispatch: (payload: Record<any, any>, queue: string | Queue, opts?: DispatchOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-sqs").SendMessageCommandOutput>;
export default dispatch;
