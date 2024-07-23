import deleteRecord from './deleteRecord';
import getClient from './getClient';
import putRecord from './putRecord';
import query from './query';
import scan from './scan';
import updateRecord from './updateRecord';
export { deleteRecord, getClient, putRecord, query, scan, updateRecord };
declare const _default: {
    deleteRecord: (key: import("../../services/DynamoDbService/deleteRecord").Key, tableName: string, opts?: import("@aws-sdk/lib-dynamodb").DeleteCommandInput | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").DeleteCommandOutput>;
    getClient: (opts?: import("../../types/aws").ClientOptions | undefined) => import("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient;
    putRecord: (item: import("../../services/DynamoDbService/putRecord").Item, tableName: string, opts?: import("@aws-sdk/lib-dynamodb").PutCommandInput | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>;
    query: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, string>, opts?: import("@aws-sdk/lib-dynamodb").QueryCommandInput | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<Record<string, any>[] | undefined>;
    scan: (tableName: string, opts?: import("@aws-sdk/lib-dynamodb").ScanCommandInput | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<Record<string, any>[] | undefined>;
    updateRecord: (key: import("../../services/DynamoDbService/updateRecord").Key, tableName: string, updateExpression: string, expressionAttributeValues: Record<string, string>, opts?: import("@aws-sdk/lib-dynamodb").UpdateCommandInput | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
};
export default _default;
