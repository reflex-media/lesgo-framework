import { ClientOptions } from '../../types/aws';
import queryService, {
  QueryOptions,
} from '../../services/DynamoDbService/query';

export const query = async (
  tableAlias: string,
  keyConditionExpression: string,
  expressionAttributeValues: Record<string, string>,
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
