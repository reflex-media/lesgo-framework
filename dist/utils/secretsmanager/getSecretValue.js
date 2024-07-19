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
import getSecretValueService from '../../services/SecretsManagerService/getSecretValue';
import config from '../../config/aws';
import isEmpty from '../isEmpty';
import validateFields from '../validateFields';
const getSecretValue = (
  secretId,
  { singletonConn = 'default', region = '' } = {}
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    region = isEmpty(region) ? config.secretsManager.region : region;
    const input = validateFields({ secretId, singletonConn, region }, [
      { key: 'secretId', type: 'string', required: true },
      { key: 'singletonConn', type: 'string', required: true },
      { key: 'region', type: 'string', required: true },
    ]);
    return getSecretValueService(input.secretId, {
      singletonConn: input.singletonConn,
      region: input.region,
    });
  });
export default getSecretValue;
