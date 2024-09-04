import { ClientOptions } from '../../types/aws';
import { QueryOptions } from '../../services/DynamoDbService/query';
import { NativeAttributeValue } from '@aws-sdk/lib-dynamodb';
export declare const query: (tableAlias: string, keyConditionExpression: string, expressionAttributeValues: Record<string, NativeAttributeValue>, opts?: QueryOptions, clientOpts?: ClientOptions) => Promise<Record<string, any>[]>;
export default query;
