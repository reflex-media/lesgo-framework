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
import isEmpty from '../../utils/isEmpty';
import getClient from './getClient';
const FILE = 'lesgo/services/S3Service/putObject';
const putObject = (
  key,
  bucket,
  file,
  { region, singletonConn, storageClass }
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (isEmpty(key)) {
      throw new LesgoException('Key is undefined', `${FILE}::KEY_UNDEFINED`);
    }
    if (isEmpty(bucket)) {
      throw new LesgoException(
        'Bucket is undefined',
        `${FILE}::BUCKET_UNDEFINED`
      );
    }
    const client = getClient({ region, singletonConn });
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      StorageClass: storageClass,
    });
    try {
      const response = yield client.send(command);
      return response;
    } catch (error) {
      throw new LesgoException(
        'Error occurred putting object to S3 bucket',
        `${FILE}::ERROR`,
        500,
        {
          error,
          bucket,
          key,
          storageClass,
        }
      );
    }
  });
export default putObject;
