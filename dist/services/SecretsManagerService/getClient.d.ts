import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { ClientOptions } from '../../types/aws';
export interface Singleton {
    [key: string]: SecretsManagerClient;
}
declare const getClient: (clientOpts?: ClientOptions) => SecretsManagerClient;
export default getClient;
