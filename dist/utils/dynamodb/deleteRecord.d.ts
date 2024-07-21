import { GetClientOptions } from '../../services/DynamoDbService/getClient';
import { Key } from '../../services/DynamoDbService/deleteRecord';
declare const deleteRecord: (key: Key, tableName: string, clientOpts?: GetClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").DeleteCommandOutput>;
export default deleteRecord;
