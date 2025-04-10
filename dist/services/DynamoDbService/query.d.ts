import { NativeAttributeValue, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { DynamoDbClientOptions } from '../../types/aws';
export interface QueryOptions extends Partial<Omit<QueryCommandInput, 'TableName'>> {
    TableName?: string;
}
declare const query: (tableAlias: string, keyConditionExpression: string, expressionAttributeValues: Record<string, NativeAttributeValue>, opts?: QueryOptions, clientOpts?: DynamoDbClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").QueryCommandOutput>;
export default query;
