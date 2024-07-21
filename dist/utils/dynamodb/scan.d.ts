import { GetClientOptions } from '../../services/DynamoDbService/getClient';
import { ScanInputOptions } from '../../services/DynamoDbService/scan';
export declare const scan: (tableName: string, opts?: ScanInputOptions, clientOpts?: GetClientOptions) => Promise<Record<string, any>[] | undefined>;
export default scan;
