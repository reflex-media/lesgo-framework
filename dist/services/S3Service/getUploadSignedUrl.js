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
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger, validateFields } from '../../utils';
import s3Config from '../../config/s3';
import getClient from './getClient';
const FILE = 'lesgo.services.S3Service.getUploadSignedUrl';
const getUploadSignedUrl = (key, opts, signingOpts, clientOpts) =>
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
    const command = new PutObjectCommand(commandInput);
    signingOpts = Object.assign({ expiresIn: 3600 }, signingOpts);
    const resp = yield getSignedUrl(client, command, signingOpts);
    logger.debug(`${FILE}::RESPONSE`, { resp, commandInput, signingOpts });
    return resp;
  });
export default getUploadSignedUrl;
