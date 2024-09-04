import { ClientOptions } from '../../types/aws';
declare const getClient: (clientOpts?: ClientOptions) => import("@aws-sdk/client-secrets-manager").SecretsManagerClient;
export default getClient;
