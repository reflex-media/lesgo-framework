import aws from 'aws-sdk';
export interface Singleton {
    [key: string]: aws.RDSDataService;
}
export interface GetClientOptions {
    secretArn?: string;
    resourceArn?: string;
    databaseName?: string;
    region: string;
    singletonConn: string;
}
declare const getClient: ({ secretArn, resourceArn, databaseName, region, singletonConn, }: GetClientOptions) => Promise<{
    client: aws.RDSDataService;
    params: aws.RDSDataService.ExecuteStatementRequest;
}>;
export default getClient;
