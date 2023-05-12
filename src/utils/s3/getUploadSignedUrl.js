import config from 'config/s3';
import getUploadSignedUrl from '../../services/S3Service/getUploadSignedUrl';

export default (
  key = '',
  bucket = '',
  {
    singletonConn = 'default',
    region = '',
    metadata = undefined,
    expiresIn = 600,
  } = {}
) => {
  const configRegion = config.region;

  return getUploadSignedUrl(key, bucket, {
    singletonConn,
    region: region !== '' ? region : configRegion,
    metadata,
    expiresIn,
  });
};
