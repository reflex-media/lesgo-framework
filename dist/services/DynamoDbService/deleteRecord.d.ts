import { NativeAttributeValue } from '@aws-sdk/lib-dynamodb';
import { GetClientOptions } from './getClient';
export type Key = Record<string, NativeAttributeValue>;
declare const deleteRecord: (key: Record<string, string>, tableName: string, { region, singletonConn }: GetClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").DeleteCommandOutput>;
export default deleteRecord;
