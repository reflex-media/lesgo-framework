Object.defineProperty(exports, '__esModule', { value: true });
exports.putObject =
  exports.getUploadSignedUrl =
  exports.getObject =
  exports.getHeadObject =
  exports.getDownloadSignedUrl =
  exports.getClient =
    void 0;
const getClient_1 = require('./getClient');
exports.getClient = getClient_1.default;
const getDownloadSignedUrl_1 = require('./getDownloadSignedUrl');
exports.getDownloadSignedUrl = getDownloadSignedUrl_1.default;
const getHeadObject_1 = require('./getHeadObject');
exports.getHeadObject = getHeadObject_1.default;
const getObject_1 = require('./getObject');
exports.getObject = getObject_1.default;
const getUploadSignedUrl_1 = require('./getUploadSignedUrl');
exports.getUploadSignedUrl = getUploadSignedUrl_1.default;
const putObject_1 = require('./putObject');
exports.putObject = putObject_1.default;
exports.default = {
  getClient: getClient_1.default,
  getDownloadSignedUrl: getDownloadSignedUrl_1.default,
  getHeadObject: getHeadObject_1.default,
  getObject: getObject_1.default,
  getUploadSignedUrl: getUploadSignedUrl_1.default,
  putObject: putObject_1.default,
};
