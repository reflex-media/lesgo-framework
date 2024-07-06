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
Object.defineProperty(exports, '__esModule', { value: true });
const client_s3_1 = require('@aws-sdk/client-s3');
const getClient_1 = require('./getClient');
const LesgoException_1 = require('../../exceptions/LesgoException');
const isEmpty_1 = require('../../utils/isEmpty');
const FILE = 'lesgo/services/S3Service/getObject';
const getObject = (key, bucket, { region, singletonConn }) =>
  __awaiter(void 0, void 0, void 0, function* () {
    if ((0, isEmpty_1.default)(key)) {
      throw new LesgoException_1.default(
        'Key is undefined',
        `${FILE}::KEY_UNDEFINED`
      );
    }
    if ((0, isEmpty_1.default)(bucket)) {
      throw new LesgoException_1.default(
        'Bucket is undefined',
        `${FILE}::BUCKET_UNDEFINED`
      );
    }
    const client = (0, getClient_1.default)({ region, singletonConn });
    const command = new client_s3_1.GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    try {
      const response = yield client.send(command);
      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      // const str = await response.Body.transformToString();
      return response;
    } catch (error) {
      throw new LesgoException_1.default(
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
exports.default = getObject;
