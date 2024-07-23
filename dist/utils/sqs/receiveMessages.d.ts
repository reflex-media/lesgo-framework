import { ReceiveMessageCommandInput } from '@aws-sdk/client-sqs';
import { Queue } from '../../services/SQSService/getQueueUrl';
import { ClientOptions } from '../../types/aws';
export declare const receiveMessages: (queue: string | Queue, opts?: ReceiveMessageCommandInput, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-sqs").ReceiveMessageCommandOutput>;
export default receiveMessages;
