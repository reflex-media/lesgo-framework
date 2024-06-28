Object.defineProperty(exports, '__esModule', { value: true });
// @ts-ignore
const s3_1 = require('config/s3');
const getClient_1 = require('../../services/S3Service/getClient');
const getClient = ({ singletonConn = 'default', region = '' } = {}) => {
  const configRegion = s3_1.default.region;
  return (0, getClient_1.default)({
    singletonConn,
    region: region !== '' ? region : configRegion,
  });
};
exports.default = getClient;
