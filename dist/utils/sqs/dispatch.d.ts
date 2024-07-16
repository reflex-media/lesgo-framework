import { Queue } from '../../services/SQSService/dispatch';
export interface DispatchOptions {
    region?: string;
    singletonConn?: string;
    fifo?: boolean;
    messageGroupId?: string;
    messageDeduplicationId?: string;
}
export declare const dispatch: (payload: Record<any, any>, queue: string | Queue, opts?: DispatchOptions) => Promise<import("@aws-sdk/client-sqs").SendMessageCommandOutput>;
export default dispatch;
