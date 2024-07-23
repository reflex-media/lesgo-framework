import { ClientOptions } from '../../types/aws';
import { Item, PutRecordOptions } from '../../services/DynamoDbService/putRecord';
declare const putRecord: (item: Item, tableAlias: string, opts?: PutRecordOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>;
export default putRecord;
