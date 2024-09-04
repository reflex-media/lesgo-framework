import { ClientOptions } from '../../types/aws';
import queryService, {
  QueryOptions,
} from '../../services/DynamoDbService/query';
import { NativeAttributeValue } from '@aws-sdk/lib-dynamodb';

export const query = async (
  tableAlias: string,
  keyConditionExpression: string,
  expressionAttributeValues: Record<string, NativeAttributeValue>,
  opts?: QueryOptions,
  clientOpts?: ClientOptions
) => {
  const data = await queryService(
    tableAlias,
    keyConditionExpression,
    expressionAttributeValues,
    opts,
    clientOpts
  );

  return data?.Items || [];
};

export default query;
