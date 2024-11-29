import { GetSecretValueOptions } from '../../services/SecretsManagerService/getSecretValue';
import { ClientOptions } from '../../types/aws';
export interface Secrets {
    [key: string]: string | object;
}
declare const getSecretValue: (secretId: string, opts?: GetSecretValueOptions, clientOpts?: ClientOptions) => Promise<any>;
export default getSecretValue;
