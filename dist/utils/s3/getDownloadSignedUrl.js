import config from '../../config/aws';
import getDownloadSignedUrlService from '../../services/S3Service/getDownloadSignedUrl';
import isEmpty from '../isEmpty';
import validateFields from '../validateFields';
const getDownloadSignedUrl = (
  key,
  bucket,
  { singletonConn = 'default', region = '', expiresIn = 3600 } = {}
) => {
  region = isEmpty(region) ? config.s3.region : region;
  bucket = isEmpty(bucket) ? config.s3.bucket : bucket;
  const input = validateFields(
    { key, bucket, singletonConn, region, expiresIn },
    [
      { key: 'key', type: 'string', required: true },
      { key: 'bucket', type: 'string', required: true },
      { key: 'singletonConn', type: 'string', required: true },
      { key: 'region', type: 'string', required: true },
      { key: 'expiresIn', type: 'number', required: true },
    ]
  );
  return getDownloadSignedUrlService(input.key, input.bucket, {
    singletonConn: input.singletonConn,
    region: input.region,
    expiresIn: input.expiresIn,
  });
};
export default getDownloadSignedUrl;
