import { ClientOptions } from '../../types/aws';
import { Key, UpdateRecordOptions } from '../../services/DynamoDbService/updateRecord';
export declare const updateRecord: (key: Key, tableAlias: string, updateExpression: string, expressionAttributeValues: Record<string, string>, opts?: UpdateRecordOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
export default updateRecord;
