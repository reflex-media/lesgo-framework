import getClient from './getClient';
import getSecretValue from './getSecretValue';
export { getClient, getSecretValue };
declare const _default: {
    getClient: ({ region, singletonConn }: import("./getClient").GetClientOptions) => import("@aws-sdk/client-secrets-manager").SecretsManagerClient;
    getSecretValue: (secretId: string, { region, singletonConn }: import("./getSecretValue").GetSecretValueOptions) => Promise<any>;
};
export default _default;
