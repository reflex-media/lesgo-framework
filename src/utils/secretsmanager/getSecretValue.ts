import { LesgoException } from '../../exceptions';
import getSecretValueService, {
  GetSecretValueOptions,
} from '../../services/SecretsManagerService/getSecretValue';
import { ClientOptions } from '../../types/aws';
import isEmpty from '../isEmpty';

const FILE = 'lesgo.utils.secretsmanager.getSecretValue';

const getSecretValue = async (
  secretId: string,
  opts?: GetSecretValueOptions,
  clientOpts?: ClientOptions
) => {
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
    return JSON.parse(secretString as string);
  } catch (error) {
    return secretString;
  }
};

export default getSecretValue;
