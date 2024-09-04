import { ReceiveMessagesOptions } from '../../services/SQSService/receiveMessages';
import { Queue } from '../../services/SQSService/getQueueUrl';
import { ClientOptions } from '../../types/aws';
export declare const receiveMessages: (queue: string | Queue, opts?: ReceiveMessagesOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-sqs").ReceiveMessageCommandOutput>;
export default receiveMessages;
