import { ScanCommandInput } from '@aws-sdk/lib-dynamodb';
export interface ScanInputOptions {
    filterExpression?: string;
    expressionAttributeValues?: Record<string, string>;
    projectionExpression?: string;
    expressionAttributeNames?: Record<string, string>;
    indexName?: string;
    select?: string;
}
export interface ScanOptions extends ScanInputOptions {
    region: string;
    singletonConn: string;
}
export declare const prepareScanInput: (tableName: string, opts: ScanInputOptions) => ScanCommandInput;
declare const scan: (tableName: string, opts: ScanOptions) => Promise<Record<string, any>[] | undefined>;
export default scan;
