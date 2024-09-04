import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
export interface Singleton {
    [key: string]: DynamoDBDocumentClient;
}
declare const getClient: (opts?: ClientOptions) => DynamoDBDocumentClient;
export default getClient;
