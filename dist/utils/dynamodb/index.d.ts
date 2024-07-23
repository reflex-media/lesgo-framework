import deleteRecord from './deleteRecord';
import getClient from './getClient';
import putRecord from './putRecord';
import query from './query';
import scan from './scan';
import updateRecord from './updateRecord';
export { deleteRecord, getClient, putRecord, query, scan, updateRecord };
declare const _default: {
    deleteRecord: (key: import("../../services/DynamoDbService/deleteRecord").Key, tableAlias: string, opts?: import("@aws-sdk/lib-dynamodb").DeleteCommandInput | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").DeleteCommandOutput>;
    getClient: (opts?: import("../../types/aws").ClientOptions | undefined) => import("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient;
    putRecord: (item: import("../../services/DynamoDbService/putRecord").Item, tableAlias: string, opts?: import("../../services/DynamoDbService/putRecord").PutRecordOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>;
    query: (tableAlias: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>, opts?: import("../../services/DynamoDbService/query").QueryOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<Record<string, any>[]>;
    scan: (tableAlias: string, opts?: import("../../services/DynamoDbService/scan").ScanOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<Record<string, any>[]>;
    updateRecord: (key: import("../../services/DynamoDbService/updateRecord").Key, tableAlias: string, updateExpression: string, expressionAttributeValues: Record<string, any>, opts?: import("../../services/DynamoDbService/updateRecord").UpdateRecordOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
};
export default _default;
