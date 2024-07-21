import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import dynamodbConfig from '../../config/dynamodb';
import getClient, { GetClientOptions } from './getClient';
import { validateFields, logger } from '../../utils';

const FILE = 'lesgo.services.DynamoDbService.query';

export interface QueryInputOptions {
  filterExpression?: string;
  projectionExpression?: string;
  expressionAttributeNames?: Record<string, string>;
  indexName?: string;
  select?: string;
}

export interface ValidatedCommandInput extends QueryInputOptions {
  tableName: string;
  keyConditionExpression: string;
  expressionAttributeValues: Record<string, any>;
}

export const prepareQueryInput = (input: ValidatedCommandInput) => {
  const commandInput: QueryCommandInput = {
    TableName: dynamodbConfig.tables.find(t => t.alias === input.tableName)
      ?.name,
    KeyConditionExpression: input.keyConditionExpression,
    ExpressionAttributeValues: input.expressionAttributeValues,
  };

  commandInput.FilterExpression = input.filterExpression;
  commandInput.ProjectionExpression = input.projectionExpression;
  commandInput.ExpressionAttributeNames = input.expressionAttributeNames;
  commandInput.IndexName = input.indexName;
  commandInput.Select = input.select as QueryCommandInput['Select'];

  return commandInput;
};

const query = async (
  tableName: string,
  keyConditionExpression: string,
  expressionAttributeValues: Record<string, any>,
  opts?: QueryInputOptions,
  clientOpts?: GetClientOptions
) => {
  const input = validateFields(
    { tableName, keyConditionExpression, expressionAttributeValues, ...opts },
    [
      { key: 'tableName', type: 'string', required: true },
      { key: 'keyConditionExpression', type: 'string', required: true },
      { key: 'expressionAttributeValues', type: 'object', required: true },
      { key: 'filterExpression', type: 'string', required: false },
      { key: 'projectionExpression', type: 'string', required: false },
      { key: 'expressionAttributeNames', type: 'object', required: false },
      { key: 'indexName', type: 'string', required: false },
      { key: 'select', type: 'string', required: false },
    ]
  ) as ValidatedCommandInput;

  const client = getClient(clientOpts);

  const commandInput = prepareQueryInput(input);
  logger.debug(`${FILE}::QUERY_PREPARED`, { commandInput });

  try {
    const data = await client.send(new QueryCommand(commandInput));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
    return data.Items;
  } catch (error) {
    throw new LesgoException('Failed to query', `${FILE}::ERROR`, 500, {
      error,
      commandInput,
      opts,
    });
  }
};

export default query;
