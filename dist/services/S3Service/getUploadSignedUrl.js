Object.defineProperty(exports, '__esModule', { value: true });
const client_s3_1 = require('@aws-sdk/client-s3');
const s3_request_presigner_1 = require('@aws-sdk/s3-request-presigner');
const getClient_1 = require('./getClient');
const getUploadSignedUrl = (
  key,
  bucket,
  { singletonConn, region, expiresIn, metadata }
) => {
  const client = (0, getClient_1.default)({ region, singletonConn });
  const command = new client_s3_1.PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Metadata: metadata,
  });
  return (0, s3_request_presigner_1.getSignedUrl)(client, command, {
    expiresIn,
  });
};
exports.default = getUploadSignedUrl;
