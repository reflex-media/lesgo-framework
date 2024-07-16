declare const getClient: ({ singletonConn, region }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
}) => import("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient;
export default getClient;
