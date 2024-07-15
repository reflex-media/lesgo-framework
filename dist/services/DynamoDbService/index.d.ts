import deleteRecord from './deleteRecord';
import getClient from './getClient';
import putRecord from './putRecord';
import query from './query';
import queryCount from './queryCount';
import updateRecord from './updateRecord';
export { deleteRecord, getClient, putRecord, query, queryCount, updateRecord };
declare const _default: {
    deleteRecord: (key: Record<string, string>, tableName: string, { region, singletonConn }: import("./getClient").GetClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").DeleteCommandOutput>;
    getClient: ({ singletonConn, region }: import("./getClient").GetClientOptions) => import("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient;
    putRecord: (item: import("./putRecord").Item, tableName: string, { region, singletonConn }: import("./getClient").GetClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>;
    query: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>, opts: import("./query").QueryOptions) => Promise<Record<string, any>[] | undefined>;
    queryCount: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>, opts: import("./queryCount").QueryCountOptions) => Promise<number | undefined>;
    updateRecord: (key: Record<string, string>, tableName: string, { region, singletonConn, updateExpression, expressionAttributeValues, conditionExpression, expressionAttributeNames, }: import("./updateRecord").UpdateRecordOptions) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
};
export default _default;
