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
import LesgoException from '../../exceptions/LesgoException';
import s3Config from '../../config/s3';
import { logger, validateFields } from '../../utils';
import getClient from './getClient';
const FILE = 'lesgo.services.S3Service.getObject';
export const streamToBuffer = stream =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (!stream || !(stream instanceof Readable)) {
      throw new LesgoException(
        'Data is not a readable stream',
        `${FILE}::ERROR_NOT_READABLE_STREAM`
      );
    }
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  });
const getObject = (key, opts, clientOpts) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const input = validateFields({ key }, [
      { key: 'key', type: 'string', required: true },
    ]);
    const client = getClient(clientOpts);
    const commandInput = Object.assign(
      {
        Bucket:
          (opts === null || opts === void 0 ? void 0 : opts.Bucket) ||
          s3Config.bucket,
        Key: input.key,
      },
      opts
    );
    try {
      const resp = yield client.send(new GetObjectCommand(commandInput));
      logger.debug(`${FILE}::RESPONSE`, { commandInput });
      return resp;
    } catch (error) {
      throw new LesgoException(
        'Error occurred getting object from S3 bucket',
        `${FILE}::ERROR`,
        500,
        {
          error,
          commandInput,
          opts,
          clientOpts,
        }
      );
    }
  });
export default getObject;
