import { NativeAttributeValue, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
export type Key = Record<string, NativeAttributeValue>;
export type UpdateRecordOptions = Omit<UpdateCommandInput, 'TableName' | 'Key'> & {
    TableName?: string;
    Key?: Record<string, NativeAttributeValue> | undefined;
};
declare const updateRecord: (key: Record<string, string>, tableAlias: string, updateExpression: string, expressionAttributeValues: Record<string, string>, opts?: UpdateRecordOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
export default updateRecord;
