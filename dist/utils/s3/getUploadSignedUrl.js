Object.defineProperty(exports, '__esModule', { value: true });
// @ts-ignore
const s3_1 = require('config/s3');
const getUploadSignedUrl_1 = require('../../services/S3Service/getUploadSignedUrl');
const getUploadSignedUrl = (
  key,
  bucket,
  {
    singletonConn = 'default',
    region = '',
    metadata = undefined,
    expiresIn = 600,
  } = {}
) => {
  const configRegion = s3_1.default.region;
  return (0, getUploadSignedUrl_1.default)(key, bucket, {
    singletonConn,
    region: region !== '' ? region : configRegion,
    metadata,
    expiresIn,
  });
};
exports.default = getUploadSignedUrl;
