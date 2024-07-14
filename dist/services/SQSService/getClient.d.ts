import { SQSClient } from '@aws-sdk/client-sqs';
export interface GetClientOptions {
    region: string;
    singletonConn: string;
}
declare const getClient: ({ region, singletonConn }: GetClientOptions) => SQSClient;
export default getClient;
