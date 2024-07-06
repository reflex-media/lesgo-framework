Object.defineProperty(exports, '__esModule', { value: true });
const aws_1 = require('../../config/aws');
const getClient_1 = require('../../services/S3Service/getClient');
const getClient = ({ singletonConn = 'default', region = '' } = {}) => {
  const configRegion = aws_1.default.region;
  return (0, getClient_1.default)({
    singletonConn,
    region: region !== '' ? region : configRegion,
  });
};
exports.default = getClient;
