import config from 'config/s3';
import getDownloadSignedUrl from '../../services/S3Service/getDownloadSignedUrl';

export default (
  key = '',
  bucket = '',
  { singletonConn = 'default', region = '', expiresIn = 3600 } = {}
) => {
  const configRegion = config.region;

  return getDownloadSignedUrl(key, bucket, {
    singletonConn,
    region: region !== '' ? region : configRegion,
    expiresIn,
  });
};
