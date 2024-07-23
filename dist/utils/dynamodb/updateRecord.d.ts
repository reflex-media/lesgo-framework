import { ClientOptions } from '../../types/aws';
import { Key, UpdateRecordOptions } from '../../services/DynamoDbService/updateRecord';
import { NativeAttributeValue } from '@aws-sdk/lib-dynamodb';
export declare const updateRecord: (key: Key, tableAlias: string, updateExpression: string, expressionAttributeValues: Record<string, NativeAttributeValue>, opts?: UpdateRecordOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
export default updateRecord;
