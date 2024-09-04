import { SQSClient } from '@aws-sdk/client-sqs';
import { ClientOptions } from '../../types/aws';
declare const getClient: (clientOpts?: ClientOptions) => SQSClient;
export default getClient;
