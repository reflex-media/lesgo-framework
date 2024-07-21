import deleteRecord from './deleteRecord';
import getClient from './getClient';
import putRecord from './putRecord';
import query from './query';
import scan from './scan';
import updateRecord from './updateRecord';
export { deleteRecord, getClient, putRecord, query, scan, updateRecord };
declare const _default: {
    deleteRecord: (key: import("./deleteRecord").Key, tableName: string, clientOpts?: import("./getClient").GetClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").DeleteCommandOutput>;
    getClient: (opts?: import("./getClient").GetClientOptions) => import("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient;
    putRecord: (item: import("./putRecord").Item, tableName: string, clientOpts?: import("./getClient").GetClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>;
    query: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>, opts?: import("./query").QueryInputOptions | undefined, clientOpts?: import("./getClient").GetClientOptions | undefined) => Promise<Record<string, any>[] | undefined>;
    scan: (tableName: string, opts?: import("./scan").ScanInputOptions | undefined, clientOpts?: import("./getClient").GetClientOptions | undefined) => Promise<Record<string, any>[] | undefined>;
    updateRecord: (key: Record<string, string>, tableName: string, updateExpression: string, expressionAttributeValues: Record<string, string>, opts?: import("./updateRecord").UpdateRecordInputOptions | undefined, clientOpts?: import("./getClient").GetClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
};
export default _default;
