import { GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import getClient from './getClient';
import LesgoException from '../../exceptions/LesgoException';

const FILE = 'lesgo.services.SecretsManager.getSecretValue';

export interface GetSecretValueOptions {
  region: string;
  singletonConn: string;
}

const getSecretValue = async (
  secretId: string,
  { region, singletonConn }: GetSecretValueOptions
) => {
  const client = getClient({ region, singletonConn });

  const command = new GetSecretValueCommand({
    SecretId: secretId,
  });

  let body;

  try {
    const { SecretString } = await client.send(command);
    body = SecretString;
  } catch (error) {
    throw new LesgoException(
      'Error occurred getting secret value from Secrets Manager',
      `${FILE}::ERROR`,
      500,
      {
        error,
        secretId,
      }
    );
  }

  if (body) {
    return JSON.parse(body);
  }
};

export default getSecretValue;
