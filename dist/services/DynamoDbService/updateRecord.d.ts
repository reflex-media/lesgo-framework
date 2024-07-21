import { NativeAttributeValue } from '@aws-sdk/lib-dynamodb';
import { GetClientOptions } from './getClient';
export type Key = Record<string, NativeAttributeValue>;
export interface UpdateRecordInputOptions {
    conditionExpression?: string;
    expressionAttributeNames?: Record<string, string>;
}
export interface ValidatedCommandInput extends UpdateRecordInputOptions {
    key: Key;
    tableName: string;
    updateExpression: string;
    expressionAttributeValues: Record<string, string>;
}
declare const updateRecord: (key: Record<string, string>, tableName: string, updateExpression: string, expressionAttributeValues: Record<string, string>, opts?: UpdateRecordInputOptions, clientOpts?: GetClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
export default updateRecord;
