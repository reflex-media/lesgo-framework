declare const queryCount: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, string>, { filterExpression, singletonConn, region, indexName, }?: {
    filterExpression?: string | undefined;
    singletonConn?: string | undefined;
    region?: string | undefined;
    indexName?: string | undefined;
}) => Promise<number | undefined>;
export default queryCount;
