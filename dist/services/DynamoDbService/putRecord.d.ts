import { NativeAttributeValue } from '@aws-sdk/lib-dynamodb';
import { GetClientOptions } from './getClient';
export type Item = Record<string, NativeAttributeValue>;
declare const putRecord: (item: Item, tableName: string, clientOpts?: GetClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>;
export default putRecord;
