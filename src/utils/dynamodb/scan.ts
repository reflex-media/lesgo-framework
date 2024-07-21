import { GetClientOptions } from '../../services/DynamoDbService/getClient';
import scanService, {
  ScanInputOptions,
} from '../../services/DynamoDbService/scan';

export const scan = async (
  tableName: string,
  opts?: ScanInputOptions,
  clientOpts?: GetClientOptions
) => {
  return scanService(tableName, opts, clientOpts);
};

export default scan;
