import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
import queryService from '../../services/DynamoDbService/query';

export const query = async (
  tableAlias: string,
  keyConditionExpression: string,
  expressionAttributeValues: Record<string, string>,
  opts?: QueryCommandInput,
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
