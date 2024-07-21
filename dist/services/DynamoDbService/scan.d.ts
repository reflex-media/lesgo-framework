import { ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { GetClientOptions } from './getClient';
export interface ScanInputOptions extends GetClientOptions {
    filterExpression?: string;
    expressionAttributeValues?: Record<string, string>;
    projectionExpression?: string;
    expressionAttributeNames?: Record<string, string>;
    indexName?: string;
    select?: string;
}
export interface ValidatedCommandInput extends ScanInputOptions {
    tableName: string;
}
export declare const prepareScanInput: (input: ValidatedCommandInput) => ScanCommandInput;
declare const scan: (tableName: string, opts?: ScanInputOptions, clientOpts?: GetClientOptions) => Promise<Record<string, any>[] | undefined>;
export default scan;
