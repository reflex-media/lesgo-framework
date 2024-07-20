import { RDSDataClient } from '@aws-sdk/client-rds-data';
export interface Singleton {
    [key: string]: RDSDataClient;
}
export interface GetClientOptions {
    secretArn?: string;
    resourceArn?: string;
    databaseName?: string;
    region: string;
    singletonConn: string;
}
declare const getClient: ({ secretArn, resourceArn, databaseName, region, singletonConn, }: GetClientOptions) => {
    client: RDSDataClient;
    params: {
        secretArn: string | undefined;
        resourceArn: string | undefined;
        database: string | undefined;
    };
};
export default getClient;
