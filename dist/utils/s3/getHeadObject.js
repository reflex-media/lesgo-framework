Object.defineProperty(exports, '__esModule', { value: true });
const aws_1 = require('../../config/aws');
const getHeadObject_1 = require('../../services/S3Service/getHeadObject');
const getHeadObject = (
  key,
  bucket,
  { singletonConn = 'default', region = '' } = {}
) => {
  const configRegion = aws_1.default.region;
  return (0, getHeadObject_1.default)(key, bucket, {
    singletonConn,
    region: region !== '' ? region : configRegion,
  });
};
exports.default = getHeadObject;
