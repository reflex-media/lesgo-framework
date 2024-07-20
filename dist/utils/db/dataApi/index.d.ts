import getClient from './getClient';
import query from './query';
export { getClient, query };
declare const _default: {
    getClient: ({ singletonConn, region }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
    }) => Promise<{
        client: import("aws-sdk/clients/rdsdataservice");
        params: import("aws-sdk/clients/rdsdataservice").ExecuteStatementRequest;
    }>;
    query: (key: string, bucket?: string | undefined, { singletonConn, region }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
    }) => Promise<import("aws-sdk/lib/request").PromiseResult<import("aws-sdk/clients/rdsdataservice").ExecuteStatementResponse, import("aws-sdk").AWSError>>;
};
export default _default;
