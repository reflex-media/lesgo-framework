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
import { PutObjectCommand } from '@aws-sdk/client-s3';
import LesgoException from '../../exceptions/LesgoException';
import s3Config from '../../config/s3';
import { logger, validateFields } from '../../utils';
import getClient from './getClient';
const FILE = 'lesgo/services/S3Service/putObject';
const putObject = (key, file, opts, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const input = validateFields({ key }, [
      { key: 'key', type: 'string', required: true },
    ]);
    const client = getClient(clientOpts);
    const command = new PutObjectCommand(
      Object.assign(Object.assign({}, opts), {
        Bucket:
          (opts === null || opts === void 0 ? void 0 : opts.Bucket) ||
          s3Config.bucket,
        Key: input.key,
        Body: file,
        StorageClass:
          (opts === null || opts === void 0 ? void 0 : opts.StorageClass) ||
          'STANDARD',
      })
    );
    try {
      const response = yield client.send(command);
      logger.debug(`${FILE}::RESPONSE`, { response, command });
      return response;
    } catch (error) {
      throw new LesgoException(
        'Error occurred putting object to S3 bucket',
        `${FILE}::ERROR`,
        500,
        {
          error,
          command,
          opts,
          clientOpts,
        }
      );
    }
  });
export default putObject;
