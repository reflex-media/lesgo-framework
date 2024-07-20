declare const getClient: ({ singletonConn, region }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
}) => Promise<{
    client: import("aws-sdk/clients/rdsdataservice");
    params: import("aws-sdk/clients/rdsdataservice").ExecuteStatementRequest;
}>;
export default getClient;
