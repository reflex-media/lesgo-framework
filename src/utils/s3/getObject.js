import { getObject } from '../../services/S3Service';
import config from 'config/s3';

export default (
  key = '',
  bucket = '',
  { singletonConn = 'default', region = '' } = {}
) => {
  const configRegion = config.region;

  return getObject(key, bucket, {
    singletonConn,
    region: region !== '' ? region : configRegion,
  });
};
