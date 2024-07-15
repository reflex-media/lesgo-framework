export interface ScanOptions {
    filterExpression?: string;
    projectionExpression?: string;
    expressionAttributeValues?: Record<string, string>;
    expressionAttributeNames?: Record<string, string>;
    singletonConn?: string;
    region?: string;
    indexName?: string;
}
export declare const scan: (tableName: string, { filterExpression, expressionAttributeValues, projectionExpression, expressionAttributeNames, indexName, singletonConn, region, }?: ScanOptions) => Promise<Record<string, any>[] | undefined>;
export default scan;
