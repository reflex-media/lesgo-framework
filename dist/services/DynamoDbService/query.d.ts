import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
declare const query: (tableAlias: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>, opts?: QueryCommandInput, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").QueryCommandOutput>;
export default query;
