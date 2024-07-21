import deleteRecord from './deleteRecord';
import getClient from './getClient';
import putRecord from './putRecord';
import query from './query';
import scan from './scan';
import updateRecord from './updateRecord';
export { deleteRecord, getClient, putRecord, query, scan, updateRecord };
declare const _default: {
    deleteRecord: (key: import("../../services/DynamoDbService/deleteRecord").Key, tableName: string, clientOpts?: import("../../services/DynamoDbService/getClient").GetClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").DeleteCommandOutput>;
    getClient: (opts?: import("../../services/DynamoDbService/getClient").GetClientOptions | undefined) => import("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient;
    putRecord: (item: import("../../services/DynamoDbService/putRecord").Item, tableName: string, clientOpts?: import("../../services/DynamoDbService/getClient").GetClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>;
    query: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, string>, opts?: import("../../services/DynamoDbService/query").QueryInputOptions | undefined, clientOpts?: import("../../services/DynamoDbService/getClient").GetClientOptions | undefined) => Promise<Record<string, any>[] | undefined>;
    scan: (tableName: string, opts?: import("../../services/DynamoDbService/scan").ScanInputOptions | undefined, clientOpts?: import("../../services/DynamoDbService/getClient").GetClientOptions | undefined) => Promise<Record<string, any>[] | undefined>;
    updateRecord: (key: import("../../services/DynamoDbService/updateRecord").Key, tableName: string, updateExpression: string, expressionAttributeValues: Record<string, string>, opts?: import("../../services/DynamoDbService/updateRecord").UpdateRecordInputOptions | undefined, clientOpts?: import("../../services/DynamoDbService/getClient").GetClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
};
export default _default;
