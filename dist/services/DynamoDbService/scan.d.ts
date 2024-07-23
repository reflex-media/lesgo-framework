import { ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
export interface ScanOptions extends Partial<Omit<ScanCommandInput, 'TableName'>> {
    TableName?: string;
}
declare const scan: (tableAlias: string, opts?: ScanOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").ScanCommandOutput>;
export default scan;
