import { DeleteCommandInput, NativeAttributeValue } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
export type Key = Record<string, NativeAttributeValue>;
export interface DeleteRecordOptions extends Partial<Omit<DeleteCommandInput, 'TableName'>> {
    TableName?: string;
}
declare const deleteRecord: (key: Key, tableAlias: string, opts?: DeleteRecordOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").DeleteCommandOutput>;
export default deleteRecord;
