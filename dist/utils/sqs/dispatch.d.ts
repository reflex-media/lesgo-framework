import { Queue } from '../../services/SQSService/dispatch';
export declare const dispatch: (payload: Record<any, any>, queue: Queue, { singletonConn, region }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
}) => Promise<import("@aws-sdk/client-sqs").SendMessageCommandOutput>;
export default dispatch;
