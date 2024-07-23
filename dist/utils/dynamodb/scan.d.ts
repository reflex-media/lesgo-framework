import { ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
export declare const scan: (tableName: string, opts?: ScanCommandInput, clientOpts?: ClientOptions) => Promise<Record<string, any>[] | undefined>;
export default scan;
