import {
  GetSecretValueCommand,
  GetSecretValueCommandInput,
} from '@aws-sdk/client-secrets-manager';
import LesgoException from '../../exceptions/LesgoException';
import { logger, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import getClient from './getClient';

const FILE = 'lesgo.services.SecretsManager.getSecretValue';

export type GetSecretValueOptions = Omit<
  GetSecretValueCommandInput,
  'SecretId'
> & {
  SecretId?: string;
};

const getSecretValue = async (
  secretId: string,
  opts?: GetSecretValueOptions,
  clientOpts?: ClientOptions
) => {
  const input = validateFields({ secretId }, [
    { key: 'secretId', type: 'string', required: true },
  ]);

  const client = getClient(clientOpts);

  const command = new GetSecretValueCommand({
    SecretId: input.secretId,
    ...opts,
  });

  try {
    const resp = await client.send(command);
    logger.debug(`${FILE}::RESPONSE`, { resp: '<REDACTED>', command });

    return resp;
  } catch (error) {
    throw new LesgoException(
      'Error occurred getting secret value from Secrets Manager',
      `${FILE}::ERROR`,
      500,
      {
        error,
        command,
        opts,
      }
    );
  }
};

export default getSecretValue;
