import config from '../../config/aws';
import getUploadSignedUrlService from '../../services/S3Service/getUploadSignedUrl';
const getUploadSignedUrl = (
  key,
  bucket,
  {
    singletonConn = 'default',
    region = '',
    metadata = undefined,
    expiresIn = 600,
  } = {
    singletonConn: 'default',
    region: '',
    expiresIn: 600,
  }
) => {
  const configRegion = config.region;
  return getUploadSignedUrlService(key, bucket, {
    singletonConn,
    region: region !== '' ? region : configRegion,
    metadata,
    expiresIn,
  });
};
export default getUploadSignedUrl;
