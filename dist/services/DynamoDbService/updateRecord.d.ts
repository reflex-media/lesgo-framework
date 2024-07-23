import { NativeAttributeValue, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
export type Key = Record<string, NativeAttributeValue>;
declare const updateRecord: (key: Record<string, string>, tableAlias: string, updateExpression: string, expressionAttributeValues: Record<string, string>, opts?: UpdateCommandInput, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
export default updateRecord;
