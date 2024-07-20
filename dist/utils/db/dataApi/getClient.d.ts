declare const getClient: ({ singletonConn, region }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
}) => {
    client: import("@aws-sdk/client-rds-data").RDSDataClient;
    params: {
        secretArn: string | undefined;
        resourceArn: string | undefined;
        database: string | undefined;
    };
};
export default getClient;
