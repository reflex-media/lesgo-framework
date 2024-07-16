import { Queue } from '../../services/SQSService/dispatch';
export declare const dispatch: (payload: Record<any, any>, queue: string | Queue, { singletonConn, region, fifo, messageGroupId, }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
    fifo?: boolean | undefined;
    messageGroupId?: string | undefined;
}) => Promise<import("@aws-sdk/client-sqs").SendMessageCommandOutput>;
export default dispatch;
