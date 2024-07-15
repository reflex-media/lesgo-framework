import { Key } from '../../services/DynamoDbService/updateRecord';
export declare const updateRecord: (key: Key, tableName: string, { singletonConn, region, updateExpression, expressionAttributeValues, conditionExpression, expressionAttributeNames, }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
    updateExpression?: string | undefined;
    expressionAttributeValues?: {} | undefined;
    conditionExpression?: string | undefined;
    expressionAttributeNames?: {} | undefined;
}) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
export default updateRecord;
