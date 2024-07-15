import { Key } from '../../services/DynamoDbService/deleteRecord';
declare const deleteRecord: (key: Key, tableName: string, { singletonConn, region }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
}) => Promise<import("@aws-sdk/lib-dynamodb").DeleteCommandOutput>;
export default deleteRecord;
