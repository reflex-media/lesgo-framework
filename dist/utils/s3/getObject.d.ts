declare const getObject: (key: string, bucket: string, { singletonConn, region }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
}) => Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>;
export default getObject;
