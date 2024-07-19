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
import { GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import getClient from './getClient';
import LesgoException from '../../exceptions/LesgoException';
const FILE = 'lesgo.services.SecretsManager.getSecretValue';
const getSecretValue = (secretId, { region, singletonConn }) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const client = getClient({ region, singletonConn });
    const command = new GetSecretValueCommand({
      SecretId: secretId,
    });
    let body;
    try {
      const { SecretString } = yield client.send(command);
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
  });
export default getSecretValue;
