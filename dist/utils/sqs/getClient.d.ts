declare const getClient: ({ singletonConn, region }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
}) => import("@aws-sdk/client-sqs").SQSClient;
export default getClient;
