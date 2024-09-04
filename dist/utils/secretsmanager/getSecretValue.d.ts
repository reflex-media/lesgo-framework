import { GetSecretValueOptions } from '../../services/SecretsManagerService/getSecretValue';
import { ClientOptions } from '../../types/aws';
declare const getSecretValue: (secretId: string, opts?: GetSecretValueOptions, clientOpts?: ClientOptions) => Promise<any>;
export default getSecretValue;
