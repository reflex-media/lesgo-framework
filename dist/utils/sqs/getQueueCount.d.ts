import { GetQueueCountOptions } from '../../services/SQSService/getQueueCount';
import { Queue } from '../../services/SQSService/getQueueUrl';
import { ClientOptions } from '../../types/aws';
export declare const getQueueCount: (queue: string | Queue, opts?: GetQueueCountOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-sqs").GetQueueAttributesCommandOutput>;
export default getQueueCount;
