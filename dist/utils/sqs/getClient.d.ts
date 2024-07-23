import { ClientOptions } from '../../types/aws';
declare const getClient: (clientOpts?: ClientOptions) => import("@aws-sdk/client-sqs").SQSClient;
export default getClient;
