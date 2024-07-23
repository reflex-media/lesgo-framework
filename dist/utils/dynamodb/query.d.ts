import { ClientOptions } from '../../types/aws';
import { QueryOptions } from '../../services/DynamoDbService/query';
export declare const query: (tableAlias: string, keyConditionExpression: string, expressionAttributeValues: Record<string, string>, opts?: QueryOptions, clientOpts?: ClientOptions) => Promise<Record<string, any>[]>;
export default query;
