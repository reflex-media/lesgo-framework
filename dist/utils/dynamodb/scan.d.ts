import { ClientOptions } from '../../types/aws';
import { ScanOptions } from '../../services/DynamoDbService/scan';
export declare const scan: (tableAlias: string, opts?: ScanOptions, clientOpts?: ClientOptions) => Promise<Record<string, any>[]>;
export default scan;
