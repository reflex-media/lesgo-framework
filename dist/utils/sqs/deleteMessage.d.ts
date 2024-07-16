import { Queue } from '../../services/SQSService/deleteMessage';
export interface ReceiveMessagesOptions {
    region?: string;
    singletonConn?: string;
}
export declare const deleteMessage: (queue: string | Queue, receiptHandle: string, opts?: ReceiveMessagesOptions) => Promise<void>;
export default deleteMessage;
