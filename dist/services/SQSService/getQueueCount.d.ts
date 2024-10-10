import { GetQueueAttributesCommandInput } from '@aws-sdk/client-sqs';
import { ClientOptions } from '../../types/aws';
import { Queue } from './getQueueUrl';
export interface GetQueueCountOptions extends Partial<Omit<GetQueueAttributesCommandInput, 'QueueUrl'>> {
    QueueUrl?: string;
}
declare const getQueueCount: (queue: string | Queue, opts?: GetQueueCountOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-sqs").GetQueueAttributesCommandOutput>;
export default getQueueCount;
