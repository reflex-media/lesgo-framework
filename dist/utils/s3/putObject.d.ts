/// <reference types="node" />
declare const putObject: (key: string, file: Buffer | Uint8Array | Blob | string, bucket?: string, { singletonConn, region, storageClass }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
    storageClass?: string | undefined;
}) => Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
export default putObject;
