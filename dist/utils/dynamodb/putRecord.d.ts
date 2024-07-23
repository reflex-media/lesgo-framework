import { PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
import { Item } from '../../services/DynamoDbService/putRecord';
declare const putRecord: (item: Item, tableName: string, opts?: PutCommandInput, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>;
export default putRecord;
