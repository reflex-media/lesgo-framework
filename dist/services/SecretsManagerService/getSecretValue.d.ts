import { GetSecretValueCommandInput } from '@aws-sdk/client-secrets-manager';
import { ClientOptions } from '../../types/aws';
export type GetSecretValueOptions = Omit<GetSecretValueCommandInput, 'SecretId'> & {
    SecretId?: string;
};
declare const getSecretValue: (secretId: string, opts?: GetSecretValueOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-secrets-manager").GetSecretValueCommandOutput>;
export default getSecretValue;
