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
import { Readable } from 'stream';
import getClient from './getClient';
import LesgoException from '../../exceptions/LesgoException';
const FILE = 'lesgo.services.S3Service.getObject';
const streamToBuffer = stream =>
  __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  });
const getObject = (key, bucket, { region, singletonConn }) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const client = getClient({ region, singletonConn });
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    let body;
    try {
      const { Body } = yield client.send(command);
      body = Body;
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
    if (!body || !(body instanceof Readable)) {
      throw new LesgoException(
        'No data returned from S3 or data is not a readable stream',
        `${FILE}::ERROR_NO_DATA_OR_NOT_READABLE`,
        500,
        {
          bucket,
          key,
        }
      );
    }
    const objectBody = yield streamToBuffer(body);
    return objectBody;
  });
export default getObject;
