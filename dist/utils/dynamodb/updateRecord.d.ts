import { GetClientOptions } from '../../services/DynamoDbService/getClient';
import { Key, UpdateRecordInputOptions } from '../../services/DynamoDbService/updateRecord';
export declare const updateRecord: (key: Key, tableName: string, updateExpression: string, expressionAttributeValues: Record<string, string>, opts?: UpdateRecordInputOptions, clientOpts?: GetClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
export default updateRecord;
