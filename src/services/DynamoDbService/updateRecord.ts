import {
  NativeAttributeValue,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import { isEmpty, logger, validateFields } from '../../utils';
import dynamodbConfig from '../../config/dynamodb';
import getClient, { GetClientOptions } from './getClient';

const FILE = 'lesgo.services.DynamoDbService.updateRecord';

export type Key = Record<string, NativeAttributeValue>;

export interface UpdateRecordInputOptions {
  conditionExpression?: string;
  expressionAttributeNames?: Record<string, string>;
}

export interface ValidatedCommandInput extends UpdateRecordInputOptions {
  key: Key;
  tableName: string;
  updateExpression: string;
  expressionAttributeValues: Record<string, string>;
}

const prepareUpdateInput = (input: ValidatedCommandInput) => {
  let commandInput: UpdateCommandInput = {
    TableName: dynamodbConfig.tables.find(t => t.alias === input.tableName)
      ?.name,
    Key: input.key,
    UpdateExpression: input.updateExpression,
    ExpressionAttributeValues: input.expressionAttributeValues,
  };

  if (!isEmpty(input.conditionExpression)) {
    commandInput = {
      ...commandInput,
      ConditionExpression: input.conditionExpression,
    };
  }

  if (!isEmpty(input.expressionAttributeNames)) {
    commandInput = {
      ...commandInput,
      ExpressionAttributeNames: input.expressionAttributeNames,
    };
  }

  return commandInput;
};

const updateRecord = async (
  key: Record<string, string>,
  tableName: string,
  updateExpression: string,
  expressionAttributeValues: Record<string, string>,
  opts?: UpdateRecordInputOptions,
  clientOpts?: GetClientOptions
) => {
  const input = validateFields(
    { key, tableName, updateExpression, expressionAttributeValues, ...opts },
    [
      { key: 'key', type: 'object', required: true },
      { key: 'tableName', type: 'string', required: true },
      { key: 'updateExpression', type: 'string', required: true },
      { key: 'expressionAttributeValues', type: 'object', required: true },
      { key: 'conditionExpression', type: 'string', required: false },
      { key: 'expressionAttributeNames', type: 'object', required: false },
    ]
  ) as ValidatedCommandInput;

  const client = getClient(clientOpts);

  const commandInput = prepareUpdateInput(input);
  logger.debug(`${FILE}::QUERY_PREPARED`, { commandInput });

  try {
    const data = await client.send(new UpdateCommand(commandInput));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
    return data;
  } catch (error) {
    throw new LesgoException('Failed to update record', `${FILE}::ERROR`, 500, {
      error,
      commandInput,
      opts,
    });
  }
};

export default updateRecord;
