declare const getClient: ({ singletonConn, region }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
}) => import("@aws-sdk/client-s3").S3Client;
export default getClient;
