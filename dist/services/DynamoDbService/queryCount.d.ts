export interface QueryCountInputOptions {
    filterExpression?: string;
    indexName?: string;
}
export interface QueryCountOptions extends QueryCountInputOptions {
    region: string;
    singletonConn: string;
}
declare const queryCount: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>, opts: QueryCountOptions) => Promise<number | undefined>;
export default queryCount;
