import { NativeAttributeValue } from '@aws-sdk/lib-dynamodb';
export type Key = Record<string, NativeAttributeValue>;
export interface UpdateRecordInputOptions {
    updateExpression: string;
    expressionAttributeValues: Record<string, string>;
    conditionExpression?: string;
    expressionAttributeNames?: Record<string, string>;
}
export interface UpdateRecordOptions extends UpdateRecordInputOptions {
    region: string;
    singletonConn: string;
}
declare const updateRecord: (key: Record<string, string>, tableName: string, { region, singletonConn, updateExpression, expressionAttributeValues, conditionExpression, expressionAttributeNames, }: UpdateRecordOptions) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
export default updateRecord;
