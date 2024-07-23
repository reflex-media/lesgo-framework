import getClient from './getClient';
import getSecretValue from './getSecretValue';
export { getClient, getSecretValue };
declare const _default: {
    getClient: (clientOpts?: import("../../types/aws").ClientOptions) => import("@aws-sdk/client-secrets-manager").SecretsManagerClient;
    getSecretValue: (secretId: string, opts?: import("@aws-sdk/client-secrets-manager").GetSecretValueCommandInput | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/client-secrets-manager").GetSecretValueCommandOutput>;
};
export default _default;
