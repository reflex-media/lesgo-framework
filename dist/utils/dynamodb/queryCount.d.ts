export interface QueryCountOptions {
    filterExpression?: string;
    singletonConn?: string;
    region?: string;
    indexName?: string;
}
declare const queryCount: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, string>, { filterExpression, singletonConn, region, indexName, }?: QueryCountOptions) => Promise<Record<string, any>[] | undefined>;
export default queryCount;
