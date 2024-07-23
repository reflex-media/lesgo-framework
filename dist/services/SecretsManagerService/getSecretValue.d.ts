import { GetSecretValueCommandInput } from '@aws-sdk/client-secrets-manager';
import { ClientOptions } from '../../types/aws';
declare const getSecretValue: (secretId: string, opts?: GetSecretValueCommandInput, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-secrets-manager").GetSecretValueCommandOutput>;
export default getSecretValue;
