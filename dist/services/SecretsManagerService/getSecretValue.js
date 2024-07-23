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
import LesgoException from '../../exceptions/LesgoException';
import { logger, validateFields } from '../../utils';
import getClient from './getClient';
const FILE = 'lesgo.services.SecretsManager.getSecretValue';
const getSecretValue = (secretId, opts, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const input = validateFields({ secretId }, [
      { key: 'secretId', type: 'string', required: true },
    ]);
    const client = getClient(clientOpts);
    const command = new GetSecretValueCommand(
      Object.assign(Object.assign({}, opts), { SecretId: input.secretId })
    );
    try {
      const resp = yield client.send(command);
      logger.debug(`${FILE}::RESPONSE`, { resp, command });
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
  });
export default getSecretValue;
