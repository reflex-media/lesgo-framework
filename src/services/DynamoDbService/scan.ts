import { ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import LesgoException from '../../exceptions/LesgoException';
import { validateFields, logger } from '../../utils';
import { ClientOptions } from '../../types/aws';
import getClient from './getClient';
import getTableName from './getTableName';

const FILE = 'lesgo.services.DynamoDbService.scan';

export interface ScanOptions
  extends Partial<Omit<ScanCommandInput, 'TableName'>> {
  TableName?: string;
}

const scan = async (
  tableAlias: string,
  opts?: ScanOptions,
  clientOpts?: ClientOptions
) => {
  const input = validateFields({ tableAlias, ...opts }, [
    { key: 'tableAlias', type: 'string', required: true },
  ]);

  const tableName = getTableName(input.tableAlias);
  const client = getClient(clientOpts);

  const commandInput: ScanCommandInput = {
    TableName: tableName,
    ...opts,
  };

  try {
    const data = await client.send(new ScanCommand(commandInput));
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { data, commandInput });
    return data;
  } catch (error) {
    throw new LesgoException('Failed to scan', `${FILE}::ERROR`, 500, {
      error,
      commandInput,
      opts,
    });
  }
};

export default scan;
