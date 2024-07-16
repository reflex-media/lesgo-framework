import { Queue } from '../../services/SQSService/receiveMessages';
export interface ReceiveMessagesOptions {
    region?: string;
    singletonConn?: string;
    maxNumberOfMessages?: number;
    waitTimeSeconds?: number;
}
export declare const receiveMessages: (queue: string | Queue, opts?: ReceiveMessagesOptions) => Promise<import("@aws-sdk/client-sqs").ReceiveMessageCommandOutput>;
export default receiveMessages;
