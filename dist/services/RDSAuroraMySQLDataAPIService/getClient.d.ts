import { RDSDataClient } from '@aws-sdk/client-rds-data';
export interface Singleton {
    [key: string]: RDSDataClient;
}
export interface GetClientOptions {
    secretArn?: string;
    resourceArn?: string;
    databaseName?: string;
    maxAttempts?: number;
    requestTimeout?: number;
    region: string;
    singletonConn: string;
}
declare const getClient: ({ secretArn, resourceArn, databaseName, maxAttempts, requestTimeout, region, singletonConn, }: GetClientOptions) => {
    client: RDSDataClient;
    params: {
        secretArn: string | undefined;
        resourceArn: string | undefined;
        database: string | undefined;
        maxAttempts: string | number | undefined;
        requestTimeout: string | number | undefined;
    };
};
export default getClient;
