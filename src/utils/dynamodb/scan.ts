import { ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
import scanService from '../../services/DynamoDbService/scan';

export const scan = async (
  tableAlias: string,
  opts?: ScanCommandInput,
  clientOpts?: ClientOptions
) => {
  const data = await scanService(tableAlias, opts, clientOpts);
  return data?.Items || [];
};

export default scan;
