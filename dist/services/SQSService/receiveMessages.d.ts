import { ReceiveMessageCommandInput } from '@aws-sdk/client-sqs';
import { ClientOptions } from '../../types/aws';
import { Queue } from './getQueueUrl';
declare const receiveMessages: (queue: string | Queue, opts?: ReceiveMessageCommandInput, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-sqs").ReceiveMessageCommandOutput>;
export default receiveMessages;
