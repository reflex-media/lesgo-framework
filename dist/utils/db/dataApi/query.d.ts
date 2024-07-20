declare const query: (key: string, bucket?: string, { singletonConn, region }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
}) => Promise<import("aws-sdk/lib/request").PromiseResult<import("aws-sdk/clients/rdsdataservice").ExecuteStatementResponse, import("aws-sdk").AWSError>>;
export default query;
