import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
export interface QueryInputOptions {
    filterExpression?: string;
    projectionExpression?: string;
    expressionAttributeNames?: Record<string, string>;
    indexName?: string;
    select?: string;
}
export interface QueryOptions extends QueryInputOptions {
    region: string;
    singletonConn: string;
}
export declare const prepareQueryInput: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>, opts: QueryInputOptions) => QueryCommandInput;
declare const query: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>, opts: QueryOptions) => Promise<Record<string, any>[] | undefined>;
export default query;
