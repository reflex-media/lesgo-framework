import deleteRecord from './deleteRecord';
import putRecord from './putRecord';
import query from './query';
import queryCount from './queryCount';
import scan from './scan';
import updateRecord from './updateRecord';
export { deleteRecord, putRecord, query, queryCount, scan, updateRecord };
declare const _default: {
    deleteRecord: (key: import("../../services/DynamoDbService/deleteRecord").Key, tableName: string, { singletonConn, region }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
    }) => Promise<import("@aws-sdk/lib-dynamodb").DeleteCommandOutput>;
    putRecord: (item: import("../../services/DynamoDbService/putRecord").Item, tableName: string, { singletonConn, region }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
    }) => Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>;
    query: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, string>, { filterExpression, projectionExpression, expressionAttributeNames, indexName, singletonConn, region, }?: import("./query").QueryOptions) => Promise<Record<string, any>[] | undefined>;
    queryCount: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, string>, { filterExpression, singletonConn, region, indexName, }?: import("./queryCount").QueryCountOptions) => Promise<Record<string, any>[] | undefined>;
    scan: (tableName: string, { filterExpression, expressionAttributeValues, projectionExpression, expressionAttributeNames, indexName, singletonConn, region, }?: import("./scan").ScanOptions) => Promise<Record<string, any>[] | undefined>;
    updateRecord: (key: import("../../services/DynamoDbService/updateRecord").Key, tableName: string, { singletonConn, region, updateExpression, expressionAttributeValues, conditionExpression, expressionAttributeNames, }?: import("./updateRecord").UpdateRecordOptions) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
};
export default _default;
