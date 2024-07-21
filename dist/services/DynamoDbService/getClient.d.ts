import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
export interface Singleton {
    [key: string]: DynamoDBDocumentClient;
}
export interface GetClientOptions {
    region?: string;
    singletonConn?: string;
}
declare const getClient: (opts?: GetClientOptions) => DynamoDBDocumentClient;
export default getClient;
