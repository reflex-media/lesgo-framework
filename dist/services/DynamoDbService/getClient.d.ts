import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDbClientOptions } from '../../types/aws';
export interface Singleton {
    [key: string]: DynamoDBDocumentClient;
}
declare const getClient: (opts?: DynamoDbClientOptions) => DynamoDBDocumentClient;
export default getClient;
