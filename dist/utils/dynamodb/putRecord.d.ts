import { GetClientOptions } from '../../services/DynamoDbService/getClient';
import { Item } from '../../services/DynamoDbService/putRecord';
declare const putRecord: (item: Item, tableName: string, clientOpts?: GetClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>;
export default putRecord;
