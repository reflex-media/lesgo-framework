export interface QueryOptions {
    secretArn?: string;
    resourceArn?: string;
    databaseName?: string;
    singletonConn: string;
    region: string;
}
declare const query: (sql: string, opts: QueryOptions) => Promise<import("aws-sdk/lib/request").PromiseResult<import("aws-sdk/clients/rdsdataservice").ExecuteStatementResponse, import("aws-sdk").AWSError>>;
export default query;
