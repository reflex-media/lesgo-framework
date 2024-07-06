Object.defineProperty(exports, '__esModule', { value: true });
const aws_1 = require('../../config/aws');
const putObject_1 = require('../../services/S3Service/putObject');
const putObject = (
  key,
  bucket,
  file,
  { singletonConn = 'default', region = '', storageClass = 'STANDARD' } = {}
) => {
  const configRegion = aws_1.default.region;
  return (0, putObject_1.default)(key, bucket, file, {
    singletonConn,
    region: region !== '' ? region : configRegion,
    storageClass: storageClass || 'STANDARD',
  });
};
exports.default = putObject;
