Object.defineProperty(exports, '__esModule', { value: true });
const aws_1 = require('../../config/aws');
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
  const configRegion = aws_1.default.region;
  return (0, getUploadSignedUrl_1.default)(key, bucket, {
    singletonConn,
    region: region !== '' ? region : configRegion,
    metadata,
    expiresIn,
  });
};
exports.default = getUploadSignedUrl;
