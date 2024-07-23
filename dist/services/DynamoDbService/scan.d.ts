import { ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { ClientOptions } from '../../types/aws';
declare const scan: (tableAlias: string, opts?: ScanCommandInput, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/lib-dynamodb").ScanCommandOutput>;
export default scan;
