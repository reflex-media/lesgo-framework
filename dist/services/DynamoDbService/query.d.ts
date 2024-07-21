import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { GetClientOptions } from './getClient';
export interface QueryInputOptions {
    filterExpression?: string;
    projectionExpression?: string;
    expressionAttributeNames?: Record<string, string>;
    indexName?: string;
    select?: string;
}
export interface ValidatedCommandInput extends QueryInputOptions {
    tableName: string;
    keyConditionExpression: string;
    expressionAttributeValues: Record<string, any>;
}
export declare const prepareQueryInput: (input: ValidatedCommandInput) => QueryCommandInput;
declare const query: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>, opts?: QueryInputOptions, clientOpts?: GetClientOptions) => Promise<Record<string, any>[] | undefined>;
export default query;
