import { Key } from '../../services/DynamoDbService/updateRecord';
export interface UpdateRecordOptions {
    updateExpression?: string;
    expressionAttributeValues?: Record<string, any>;
    conditionExpression?: string;
    expressionAttributeNames?: Record<string, string>;
    singletonConn?: string;
    region?: string;
}
export declare const updateRecord: (key: Key, tableName: string, { singletonConn, region, updateExpression, expressionAttributeValues, conditionExpression, expressionAttributeNames, }?: UpdateRecordOptions) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
export default updateRecord;
