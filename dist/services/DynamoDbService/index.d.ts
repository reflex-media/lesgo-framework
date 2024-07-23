import deleteRecord from './deleteRecord';
import getClient from './getClient';
import putRecord from './putRecord';
import query from './query';
import scan from './scan';
import updateRecord from './updateRecord';
export { deleteRecord, getClient, putRecord, query, scan, updateRecord };
declare const _default: {
    deleteRecord: (key: import("./deleteRecord").Key, tableAlias: string, opts?: import("./deleteRecord").DeleteRecordOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").DeleteCommandOutput>;
    getClient: (opts?: import("../../types/aws").ClientOptions) => import("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient;
    putRecord: (item: import("./putRecord").Item, tableAlias: string, opts?: import("@aws-sdk/lib-dynamodb").PutCommandInput | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>;
    query: (tableAlias: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>, opts?: import("@aws-sdk/lib-dynamodb").QueryCommandInput | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").QueryCommandOutput>;
    scan: (tableAlias: string, opts?: import("@aws-sdk/lib-dynamodb").ScanCommandInput | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").ScanCommandOutput>;
    updateRecord: (key: Record<string, string>, tableAlias: string, updateExpression: string, expressionAttributeValues: Record<string, string>, opts?: import("./updateRecord").UpdateRecordOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
};
export default _default;
