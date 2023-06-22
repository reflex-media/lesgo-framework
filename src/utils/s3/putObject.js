import config from 'config/s3'; // eslint-disable-line import/no-unresolved
import { putObject } from '../../services/S3Service';

export default (
  key = '',
  bucket = '',
  file = '',
  { singletonConn = 'default', region = '' } = {}
) => {
  const configRegion = config.region;

  return putObject(key, bucket, file, {
    singletonConn,
    region: region !== '' ? region : configRegion,
  });
};
