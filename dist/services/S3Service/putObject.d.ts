import { StorageClass } from '@aws-sdk/client-s3';
interface PutObjectOptions {
    region: string;
    singletonConn: string;
    storageClass: StorageClass;
}
declare const putObject: (key: string, bucket: string, file: Buffer | Uint8Array | Blob | string, { region, singletonConn, storageClass }: PutObjectOptions) => Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
export default putObject;
