import { logger } from '../../utils';
import { LesgoException } from '../../exceptions';
import getSecretValueService, {
  GetSecretValueOptions,
} from '../../services/SecretsManagerService/getSecretValue';
import { ClientOptions } from '../../types/aws';
import isEmpty from '../isEmpty';

export interface Secrets {
  [key: string]: string | object;
}

const secret: Secrets = {};

const FILE = 'lesgo.utils.secretsmanager.getSecretValue';

const getSecretValue = async (
  secretId: string,
  opts?: GetSecretValueOptions,
  clientOpts?: ClientOptions
) => {
  if (secret[secretId]) {
    logger.debug(`${FILE}::CACHED_SECRET_VALUE`, { secretId });
    return secret[secretId];
  }

  let secretString;

  try {
    const { SecretString } = await getSecretValueService(
      secretId,
      opts,
      clientOpts
    );

    secretString = SecretString;
  } catch (error) {
    throw new LesgoException(
      'Failed to get secret value',
      `${FILE}::ERROR_GET_SECRET_VALUE`,
      500
    );
  }

  if (isEmpty(secretString)) {
    throw new LesgoException(
      'Missing secretString',
      `${FILE}::SECRET_STRING_EMPTY`,
      500
    );
  }

  try {
    const secretObj = JSON.parse(secretString as string);
    secret[secretId] = secretObj;

    logger.debug(`${FILE}::SECRET_VALUE`, { secretId });
    return secretObj;
  } catch (error) {
    secret[secretId] = secretString || '';

    logger.debug(`${FILE}::SECRET_VALUE`, { secretId });
    return secretString;
  }
};

export default getSecretValue;
