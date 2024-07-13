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
import { GetObjectCommand } from '@aws-sdk/client-s3';
import getClient from './getClient';
import LesgoException from '../../exceptions/LesgoException';
import isEmpty from '../../utils/isEmpty';
const FILE = 'lesgo.services.S3Service.getObject';
const getObject = (key, bucket, { region, singletonConn }) =>
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
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    try {
      const response = yield client.send(command);
      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      // const str = await response.Body.transformToString();
      return response;
    } catch (error) {
      throw new LesgoException(
        'Error occurred getting object from S3 bucket',
        `${FILE}::ERROR`,
        500,
        {
          error,
          bucket,
          key,
        }
      );
    }
  });
export default getObject;
