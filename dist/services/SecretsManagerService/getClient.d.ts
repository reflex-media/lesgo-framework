import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
export interface Singleton {
    [key: string]: SecretsManagerClient;
}
export interface GetClientOptions {
    region: string;
    singletonConn: string;
}
declare const getClient: ({ region, singletonConn }: GetClientOptions) => SecretsManagerClient;
export default getClient;
