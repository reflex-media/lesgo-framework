import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
export declare const query: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, string>, opts?: QueryCommandInput, clientOpts?: ClientOptions) => Promise<Record<string, any>[] | undefined>;
export default query;
