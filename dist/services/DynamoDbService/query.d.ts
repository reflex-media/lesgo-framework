import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
export interface QueryOptions extends Partial<Omit<QueryCommandInput, 'TableName'>> {
    TableName?: string;
}
declare const query: (tableAlias: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>, opts?: QueryOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").QueryCommandOutput>;
export default query;
