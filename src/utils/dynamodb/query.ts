import { GetClientOptions } from '../../services/DynamoDbService/getClient';
import queryService, {
  QueryInputOptions,
} from '../../services/DynamoDbService/query';

export const query = async (
  tableName: string,
  keyConditionExpression: string,
  expressionAttributeValues: Record<string, string>,
  opts?: QueryInputOptions,
  clientOpts?: GetClientOptions
) => {
  return queryService(
    tableName,
    keyConditionExpression,
    expressionAttributeValues,
    opts,
    clientOpts
  );
};

export default query;
