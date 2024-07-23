import { GetSecretValueCommandInput } from '@aws-sdk/client-secrets-manager';
import getSecretValueService from '../../services/SecretsManagerService/getSecretValue';
import { ClientOptions } from '../../types/aws';

const getSecretValue = async (
  secretId: string,
  opts?: GetSecretValueCommandInput,
  clientOpts?: ClientOptions
) => {
  const { SecretString } = await getSecretValueService(
    secretId,
    opts,
    clientOpts
  );

  try {
    if (typeof SecretString === 'object') {
      return JSON.parse(SecretString);
    }
  } catch (error) {
    return SecretString;
  }

  return SecretString;
};

export default getSecretValue;
