import { Queue } from '../../services/SQSService/deleteMessage';
export interface DeleteMessagesOptions {
    region?: string;
    singletonConn?: string;
}
export declare const deleteMessage: (queue: string | Queue, receiptHandle: string, opts?: DeleteMessagesOptions) => Promise<void>;
export default deleteMessage;
