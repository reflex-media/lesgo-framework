import config from '../../config/aws';
import getObjectService from '../../services/S3Service/getObject';
import isEmpty from '../isEmpty';
import validateFields from '../validateFields';

const getObject = (
  key: string,
  bucket?: string,
  { singletonConn = 'default', region = '' } = {}
) => {
  region = isEmpty(region) ? config.s3.region : region;
  bucket = isEmpty(bucket) ? config.s3.bucket : bucket;

  const input = validateFields({ key, bucket, singletonConn, region }, [
    { key: 'key', type: 'string', required: true },
    { key: 'bucket', type: 'string', required: true },
    { key: 'singletonConn', type: 'string', required: true },
    { key: 'region', type: 'string', required: true },
  ]);

  return getObjectService(input.key, input.bucket, {
    singletonConn: input.singletonConn,
    region: input.region,
  });
};

export default getObject;
