Object.defineProperty(exports, '__esModule', { value: true });
exports.putObject =
  exports.GetUploadSignedUrl =
  exports.GetDownloadSignedUrl =
  exports.getHeadObject =
  exports.getObject =
  exports.getClient =
    void 0;
var getClient_1 = require('./getClient');
Object.defineProperty(exports, 'getClient', {
  enumerable: true,
  get: function () {
    return getClient_1.default;
  },
});
var getObject_1 = require('./getObject');
Object.defineProperty(exports, 'getObject', {
  enumerable: true,
  get: function () {
    return getObject_1.default;
  },
});
var getHeadObject_1 = require('./getHeadObject');
Object.defineProperty(exports, 'getHeadObject', {
  enumerable: true,
  get: function () {
    return getHeadObject_1.default;
  },
});
var getDownloadSignedUrl_1 = require('./getDownloadSignedUrl');
Object.defineProperty(exports, 'GetDownloadSignedUrl', {
  enumerable: true,
  get: function () {
    return getDownloadSignedUrl_1.default;
  },
});
var getUploadSignedUrl_1 = require('./getUploadSignedUrl');
Object.defineProperty(exports, 'GetUploadSignedUrl', {
  enumerable: true,
  get: function () {
    return getUploadSignedUrl_1.default;
  },
});
var putObject_1 = require('./putObject');
Object.defineProperty(exports, 'putObject', {
  enumerable: true,
  get: function () {
    return putObject_1.default;
  },
});
