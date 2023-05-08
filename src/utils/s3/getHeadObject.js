import getHeadObject from '../../services/S3Service/getHeadObject';
import config from 'config/s3';

export default (
  key = '',
  bucket = '',
  { singletonConn = 'default', region = '' } = {}
) => {
  const configRegion = config.region;

  return getHeadObject(key, bucket, {
    singletonConn,
    region: region !== '' ? region : configRegion,
  });
};
