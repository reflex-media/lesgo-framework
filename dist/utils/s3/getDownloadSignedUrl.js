Object.defineProperty(exports, '__esModule', { value: true });
const aws_1 = require('../../config/aws');
const getDownloadSignedUrl_1 = require('../../services/S3Service/getDownloadSignedUrl');
const getDownloadSignedUrl = (
  key,
  bucket,
  { singletonConn = 'default', region = '', expiresIn = 3600 } = {}
) => {
  const configRegion = aws_1.default.region;
  return (0, getDownloadSignedUrl_1.default)(key, bucket, {
    singletonConn,
    region: region !== '' ? region : configRegion,
    expiresIn,
  });
};
exports.default = getDownloadSignedUrl;
