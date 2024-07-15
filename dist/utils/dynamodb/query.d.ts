export declare const query: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, string>, { filterExpression, projectionExpression, expressionAttributeNames, singletonConn, region, indexName, }?: {
    filterExpression?: string | undefined;
    projectionExpression?: string | undefined;
    expressionAttributeNames?: {} | undefined;
    singletonConn?: string | undefined;
    region?: string | undefined;
    indexName?: string | undefined;
}) => Promise<Record<string, any>[] | undefined>;
export default query;
