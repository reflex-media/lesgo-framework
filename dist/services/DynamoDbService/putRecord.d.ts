import { NativeAttributeValue, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
export interface PutRecordOptions extends Partial<Omit<PutCommandInput, 'TableName'>> {
    TableName?: string;
}
export type Item = Record<string, NativeAttributeValue>;
declare const putRecord: (item: Item, tableAlias: string, opts?: PutRecordOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>;
export default putRecord;
