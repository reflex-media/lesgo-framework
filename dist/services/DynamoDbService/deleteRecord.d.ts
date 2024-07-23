import { DeleteCommandInput, NativeAttributeValue } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
export type Key = Record<string, NativeAttributeValue>;
declare const deleteRecord: (key: Key, tableAlias: string, opts?: DeleteCommandInput, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").DeleteCommandOutput>;
export default deleteRecord;
