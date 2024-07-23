import { UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
import { Key } from '../../services/DynamoDbService/updateRecord';
export declare const updateRecord: (key: Key, tableName: string, updateExpression: string, expressionAttributeValues: Record<string, string>, opts?: UpdateCommandInput, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").UpdateCommandOutput>;
export default updateRecord;
