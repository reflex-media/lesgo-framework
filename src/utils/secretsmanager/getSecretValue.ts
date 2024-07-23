import getSecretValueService, {
  GetSecretValueOptions,
} from '../../services/SecretsManagerService/getSecretValue';
import { ClientOptions } from '../../types/aws';

const getSecretValue = async (
  secretId: string,
  opts?: GetSecretValueOptions,
  clientOpts?: ClientOptions
) => {
  const { SecretString } = await getSecretValueService(
    secretId,
    opts,
    clientOpts
  );

  try {
    return JSON.parse(SecretString as string);
  } catch (error) {
    return SecretString;
  }
};

export default getSecretValue;
