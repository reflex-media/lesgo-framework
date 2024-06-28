declare const putObject: (key: string, bucket: string, file: string, { singletonConn, region, storageClass }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
    storageClass?: string | undefined;
}) => Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
export default putObject;
