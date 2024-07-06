import config from '../../config/aws';
import getObjectService from '../../services/S3Service/getObject';

const getObject = (
  key: string,
  bucket: string,
  { singletonConn = 'default', region = '' } = {}
) => {
  const configRegion = config.region;

  return getObjectService(key, bucket, {
    singletonConn,
    region: region !== '' ? region : configRegion,
  });
};

export default getObject;
