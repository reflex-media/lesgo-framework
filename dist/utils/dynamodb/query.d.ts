export interface QueryOptions {
    filterExpression?: string;
    projectionExpression?: string;
    expressionAttributeNames?: Record<string, string>;
    singletonConn?: string;
    region?: string;
    indexName?: string;
}
export declare const query: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, string>, { filterExpression, projectionExpression, expressionAttributeNames, indexName, singletonConn, region, }?: QueryOptions) => Promise<Record<string, any>[] | undefined>;
export default query;
