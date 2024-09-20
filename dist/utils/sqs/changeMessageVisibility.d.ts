import { Queue } from '../../services/SQSService/getQueueUrl';
import { ClientOptions } from '../../types/aws';
import { changeMessageVisibilityOptions } from '../../services/SQSService/changeMessageVisibility';
export declare const changeMessageVisibility: (queue: string | Queue, receiptHandle: string, visibilityTimeout: number, opts?: changeMessageVisibilityOptions, clientOpts?: ClientOptions) => Promise<void>;
export default changeMessageVisibility;
