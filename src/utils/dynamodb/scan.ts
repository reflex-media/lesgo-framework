import { ClientOptions } from '../../types/aws';
import scanService, { ScanOptions } from '../../services/DynamoDbService/scan';

export const scan = async (
  tableAlias: string,
  opts?: ScanOptions,
  clientOpts?: ClientOptions
) => {
  const data = await scanService(tableAlias, opts, clientOpts);
  return data?.Items || [];
};

export default scan;
