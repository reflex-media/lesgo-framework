import s3Config from '../../config/s3';
import getObjectService from '../../services/S3Service/getObject';
import isEmpty from '../isEmpty';
import validateFields from '../validateFields';

const getObject = async (
  key: string,
  bucket?: string,
  { singletonConn = 'default', region = '' } = {}
) => {
  region = isEmpty(region) ? s3Config.region : region;
  bucket = isEmpty(bucket) ? s3Config.bucket : bucket;

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
