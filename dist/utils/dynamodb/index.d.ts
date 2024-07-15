import deleteRecord from './deleteRecord';
import putRecord from './putRecord';
import query from './query';
import queryCount from './queryCount';
import updateRecord from './updateRecord';
export { deleteRecord, putRecord, query, queryCount, updateRecord };
declare const _default: {
    deleteRecord: (key: import("../../services/DynamoDbService/deleteRecord").Key, tableName: string, { singletonConn, region }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
    }) => Promise<import("@aws-sdk/lib-dynamodb").DeleteCommandOutput>;
    putRecord: (item: import("../../services/DynamoDbService/putRecord").Item, tableName: string, { singletonConn, region }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
    }) => Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>;
    query: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, string>, { filterExpression, projectionExpression, expressionAttributeNames, singletonConn, region, indexName, }?: {
        filterExpression?: string | undefined;
        projectionExpression?: string | undefined;
        expressionAttributeNames?: {} | undefined;
        singletonConn?: string | undefined;
        region?: string | undefined;
        indexName?: string | undefined;
    }) => Promise<Record<string, any>[] | undefined>;
    queryCount: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, string>, { filterExpression, singletonConn, region, indexName, }?: {
        filterExpression?: string | undefined;
        singletonConn?: string | undefined;
        region?: string | undefined;
        indexName?: string | undefined;
    }) => Promise<number | undefined>;
    updateRecord: (key: import("../../services/DynamoDbService/updateRecord").Key, tableName: string, { singletonConn, region, updateExpression, expressionAttributeValues, conditionExpression, expressionAttributeNames, }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
        updateExpression?: string | undefined;
        expressionAttributeValues?: {} | undefined;
        conditionExpression?: string | undefined;
        expressionAttributeNames?: {} | undefined;
    }) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
};
export default _default;
