/// <reference types="node" />
import { StorageClass } from '@aws-sdk/client-s3';
export interface PutObjectOptions {
    region: string;
    singletonConn: string;
    storageClass: StorageClass;
}
declare const putObject: (key: string, file: Buffer | Uint8Array | Blob | string, bucket: string, { region, singletonConn, storageClass }: PutObjectOptions) => Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
export default putObject;
