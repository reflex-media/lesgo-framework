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
import config from '../../config/aws';
import getDownloadSignedUrlService from '../../services/S3Service/getDownloadSignedUrl';
import isEmpty from '../isEmpty';
import validateFields from '../validateFields';
const getDownloadSignedUrl = (
  key,
  bucket,
  { singletonConn = 'default', region = '', expiresIn = 3600 } = {}
) =>
  __awaiter(void 0, void 0, void 0, function* () {
    region = isEmpty(region) ? config.s3.region : region;
    bucket = isEmpty(bucket) ? config.s3.bucket : bucket;
    const input = validateFields(
      { key, bucket, singletonConn, region, expiresIn },
      [
        { key: 'key', type: 'string', required: true },
        { key: 'bucket', type: 'string', required: true },
        { key: 'singletonConn', type: 'string', required: true },
        { key: 'region', type: 'string', required: true },
        { key: 'expiresIn', type: 'number', required: true },
      ]
    );
    return getDownloadSignedUrlService(input.key, input.bucket, {
      singletonConn: input.singletonConn,
      region: input.region,
      expiresIn: input.expiresIn,
    });
  });
export default getDownloadSignedUrl;
