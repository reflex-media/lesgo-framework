/// <reference types="node" />
import { PutObjectCommandInput, StorageClass } from '@aws-sdk/client-s3';
import { ClientOptions } from '../../types/aws';
export interface PutObjectOptions {
    region: string;
    singletonConn: string;
    storageClass: StorageClass;
}
declare const putObject: (key: string, file: Buffer | Uint8Array | Blob | string, opts?: PutObjectCommandInput, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
export default putObject;
