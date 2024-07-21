import { ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import dynamodbConfig from '../../config/dynamodb';
import { validateFields, logger } from '../../utils';
import getClient, { GetClientOptions } from './getClient';

const FILE = 'lesgo.services.DynamoDbService.scan';

export interface ScanInputOptions extends GetClientOptions {
  filterExpression?: string;
  expressionAttributeValues?: Record<string, string>;
  projectionExpression?: string;
  expressionAttributeNames?: Record<string, string>;
  indexName?: string;
  select?: string;
}

export interface ValidatedCommandInput extends ScanInputOptions {
  tableName: string;
}

export const prepareScanInput = (input: ValidatedCommandInput) => {
  const commandInput: ScanCommandInput = {
    TableName: dynamodbConfig.tables.find(t => t.alias === input.tableName)
      ?.name,
  };

  commandInput.FilterExpression = input.filterExpression;
  commandInput.ExpressionAttributeValues = input.expressionAttributeValues;
  commandInput.ProjectionExpression = input.projectionExpression;
  commandInput.ExpressionAttributeNames = input.expressionAttributeNames;
  commandInput.IndexName = input.indexName;
  commandInput.Select = input.select as ScanCommandInput['Select'];

  return commandInput;
};

const scan = async (
  tableName: string,
  opts?: ScanInputOptions,
  clientOpts?: GetClientOptions
) => {
  const input = validateFields({ tableName, ...opts }, [
    { key: 'tableName', type: 'string', required: true },
    { key: 'filterExpression', type: 'string', required: false },
    { key: 'expressionAttributeValues', type: 'object', required: false },
    { key: 'projectionExpression', type: 'string', required: false },
    { key: 'expressionAttributeNames', type: 'object', required: false },
    { key: 'indexName', type: 'string', required: false },
    { key: 'select', type: 'string', required: false },
  ]) as ValidatedCommandInput;

  const client = getClient(clientOpts);

  const commandInput = prepareScanInput(input);
  logger.debug(`${FILE}::SCAN_PREPARED`, { commandInput });

  try {
    const data = await client.send(new ScanCommand(commandInput));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data });
    return data.Items;
  } catch (error) {
    throw new LesgoException('Failed to scan', `${FILE}::ERROR`, 500, {
      error,
      commandInput,
      opts,
    });
  }
};

export default scan;
