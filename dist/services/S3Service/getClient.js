Object.defineProperty(exports, '__esModule', { value: true });
const client_s3_1 = require('@aws-sdk/client-s3');
const logger_1 = require('../../utils/logger');
const isEmpty_1 = require('../../utils/isEmpty');
const FILE = 'lesgo/services/S3Service/getClient';
const singleton = {};
const getClient = ({ region, singletonConn }) => {
  if (!(0, isEmpty_1.default)(singleton[singletonConn])) {
    logger_1.default.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
      client: singleton[singletonConn],
    });
    return singleton[singletonConn];
  }
  const client = new client_s3_1.S3Client({ region });
  logger_1.default.debug(`${FILE}::NEW_CLIENT`, {
    client: singleton[singletonConn],
  });
  singleton[singletonConn] = client;
  return client;
};
exports.default = getClient;
