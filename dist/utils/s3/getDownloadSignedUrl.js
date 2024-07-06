import config from '../../config/aws';
import getDownloadSignedUrlService from '../../services/S3Service/getDownloadSignedUrl';
const getDownloadSignedUrl = (
  key,
  bucket,
  { singletonConn = 'default', region = '', expiresIn = 3600 } = {}
) => {
  const configRegion = config.region;
  return getDownloadSignedUrlService(key, bucket, {
    singletonConn,
    region: region !== '' ? region : configRegion,
    expiresIn,
  });
};
export default getDownloadSignedUrl;
