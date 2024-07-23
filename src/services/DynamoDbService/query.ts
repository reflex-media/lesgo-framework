import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import { validateFields, logger } from '../../utils';
import { ClientOptions } from '../../types/aws';
import getClient from './getClient';
import getTableName from './getTableName';

const FILE = 'lesgo.services.DynamoDbService.query';

export interface QueryOptions
  extends Partial<Omit<QueryCommandInput, 'TableName'>> {
  TableName?: string;
}

const query = async (
  tableAlias: string,
  keyConditionExpression: string,
  expressionAttributeValues: Record<string, any>,
  opts?: QueryOptions,
  clientOpts?: ClientOptions
) => {
  const input = validateFields(
    { tableAlias, keyConditionExpression, expressionAttributeValues },
    [
      { key: 'tableAlias', type: 'string', required: true },
      { key: 'keyConditionExpression', type: 'string', required: true },
      { key: 'expressionAttributeValues', type: 'object', required: true },
    ]
  );

  const tableName = getTableName(input.tableAlias);
  const client = getClient(clientOpts);

  const commandInput: QueryCommandInput = {
    TableName: tableName,
    KeyConditionExpression: input.keyConditionExpression,
    ExpressionAttributeValues: input.expressionAttributeValues,
    ...opts,
  };

  try {
    const data = await client.send(new QueryCommand(commandInput));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data, commandInput });
    return data;
  } catch (error) {
    throw new LesgoException('Failed to query', `${FILE}::ERROR`, 500, {
      error,
      commandInput,
      opts,
    });
  }
};

export default query;
