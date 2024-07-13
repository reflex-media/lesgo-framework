import config from '../../config/aws';
import putObjectService from '../../services/S3Service/putObject';
import isEmpty from '../isEmpty';
import validateFields from '../validateFields';
const putObject = (
  key,
  file,
  bucket,
  { singletonConn = 'default', region = '', storageClass = 'STANDARD' } = {}
) => {
  region = isEmpty(region) ? config.s3.region : region;
  bucket = isEmpty(bucket) ? config.s3.bucket : bucket;
  const input = validateFields(
    { key, bucket, singletonConn, region, storageClass },
    [
      { key: 'key', type: 'string', required: true },
      { key: 'bucket', type: 'string', required: true },
      { key: 'singletonConn', type: 'string', required: true },
      { key: 'region', type: 'string', required: true },
      { key: 'storageClass', type: 'string', required: true },
    ]
  );
  return putObjectService(input.key, file, input.bucket, {
    singletonConn: input.singletonConn,
    region: input.region,
    storageClass: input.storageClass || 'STANDARD',
  });
};
export default putObject;
