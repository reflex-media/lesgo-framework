import {
  NativeAttributeValue,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import { isEmpty, logger } from '../../utils';
import getClient from './getClient';

const FILE = 'lesgo.services.DynamoDbService.updateRecord';

export type Key = Record<string, NativeAttributeValue>;

export interface UpdateRecordInputOptions {
  updateExpression: string;
  expressionAttributeValues: Record<string, string>;
  conditionExpression?: string;
  expressionAttributeNames?: Record<string, string>;
}

export interface UpdateRecordOptions extends UpdateRecordInputOptions {
  region: string;
  singletonConn: string;
}

const prepareUpdateInput = (
  key: Key,
  tableName: string,
  opts: UpdateRecordInputOptions
) => {
  let input: UpdateCommandInput = {
    TableName: tableName,
    Key: key,
    UpdateExpression: opts.updateExpression,
    ExpressionAttributeValues: opts.expressionAttributeValues,
  };

  if (!isEmpty(opts.conditionExpression)) {
    input = {
      ...input,
      ConditionExpression: opts.conditionExpression,
    };
  }

  if (!isEmpty(opts.expressionAttributeNames)) {
    input = {
      ...input,
      ExpressionAttributeNames: opts.expressionAttributeNames,
    };
  }

  return input;
};

const updateRecord = async (
  key: Record<string, string>,
  tableName: string,
  {
    region,
    singletonConn,
    updateExpression,
    expressionAttributeValues,
    conditionExpression,
    expressionAttributeNames,
  }: UpdateRecordOptions
) => {
  const params = prepareUpdateInput(key, tableName, {
    updateExpression,
    expressionAttributeValues,
    conditionExpression,
    expressionAttributeNames,
  });
  logger.debug(`${FILE}::QUERY_PREPARED`, { params });

  const client = getClient({ singletonConn, region });

  try {
    const data = await client.send(new UpdateCommand(params));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
    return data;
  } catch (err) {
    throw new LesgoException('Failed to update record', `${FILE}::ERROR`, 500, {
      err,
      params,
    });
  }
};

export default updateRecord;
