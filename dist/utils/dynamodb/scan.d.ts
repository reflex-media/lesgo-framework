import { ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
export declare const scan: (tableAlias: string, opts?: ScanCommandInput, clientOpts?: ClientOptions) => Promise<Record<string, any>[]>;
export default scan;
