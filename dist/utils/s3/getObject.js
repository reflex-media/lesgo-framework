import config from '../../config/aws';
import getObjectService from '../../services/S3Service/getObject';
const getObject = (
  key,
  bucket,
  { singletonConn = 'default', region = '' } = {}
) => {
  const configRegion = config.region;
  return getObjectService(key, bucket, {
    singletonConn,
    region: region !== '' ? region : configRegion,
  });
};
export default getObject;
