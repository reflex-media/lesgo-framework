var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { LesgoException } from '../../exceptions';
import getSecretValueService from '../../services/SecretsManagerService/getSecretValue';
import isEmpty from '../isEmpty';
const FILE = 'lesgo.utils.secretsmanager.getSecretValue';
const getSecretValue = (secretId, opts, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    let secretString;
    try {
      const { SecretString } = yield getSecretValueService(
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
      return JSON.parse(secretString);
    } catch (error) {
      return secretString;
    }
  });
export default getSecretValue;
