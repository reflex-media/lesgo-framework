import { GetClientOptions } from '../../services/DynamoDbService/getClient';
import { QueryInputOptions } from '../../services/DynamoDbService/query';
export declare const query: (tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, string>, opts?: QueryInputOptions, clientOpts?: GetClientOptions) => Promise<Record<string, any>[] | undefined>;
export default query;
