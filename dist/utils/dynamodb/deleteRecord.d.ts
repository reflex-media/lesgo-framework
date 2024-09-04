import { ClientOptions } from '../../types/aws';
import { Key } from '../../services/DynamoDbService/deleteRecord';
import { DeleteCommandInput } from '@aws-sdk/lib-dynamodb';
declare const deleteRecord: (key: Key, tableAlias: string, opts?: DeleteCommandInput, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").DeleteCommandOutput>;
export default deleteRecord;
