import config from 'config/s3'; // eslint-disable-line import/no-unresolved
import { getObject } from '../../services/S3Service';

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
